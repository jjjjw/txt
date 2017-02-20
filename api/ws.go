package api

import (
	"github.com/golang/protobuf/proto"
	"github.com/gorilla/websocket"
	"github.com/julienschmidt/httprouter"
	"github.com/zjjw/txt/models"
	"log"
	"net/http"
	"time"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
)

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of created posts.
	created chan []byte
}

// readPump pumps messages from the websocket connection to the hub.
//
// The application runs readPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, _, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Printf("error: %v", err)
			}
			break
		}
	}
}

// writePump pumps messages from the hub to the websocket connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.created:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.BinaryMessage)
			if err != nil {
				return
			}

			posts := make([]*models.Post, len(c.created)+1)

			first := &models.Post{}
			validationErr := proto.Unmarshal(message, first)
			if validationErr != nil {
				log.Fatal(validationErr)
			}

			posts[0] = first

			n := len(c.created) + 1
			for i := 1; i < n; i++ {
				post := &models.Post{}
				validationErr := proto.Unmarshal(message, post)
				if validationErr != nil {
					log.Fatal(validationErr)
				}
				posts[i] = post
			}

			notification := &models.Notification{
				Type: 0,
				Posts: &models.Posts{
					Posts: posts,
				},
			}

			data, marshalErr := proto.Marshal(notification)
			if marshalErr != nil {
				log.Fatal(marshalErr)
			}

			w.Write(data)

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

func WS(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	conn, connErr := upgrader.Upgrade(w, r, nil)
	if connErr != nil {
		log.Println("connErr:", connErr)
		return
	}

	hub, ok := r.Context().Value("hub").(*Hub)
	if ok == false {
		log.Fatal("Failed to get hub")
	}

	client := &Client{hub: hub, conn: conn, created: make(chan []byte, 256)}
	client.hub.register <- client
	go client.writePump()
	client.readPump()
}
