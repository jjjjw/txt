package api

import (
	"github.com/golang/protobuf/proto"
	"github.com/gorilla/websocket"
	"github.com/julienschmidt/httprouter"
	"github.com/zjjw/txt/models"
	"log"
	"net/http"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func WS(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	conn, connErr := upgrader.Upgrade(w, r, nil)
	if connErr != nil {
		log.Fatal(connErr)
	}

	post := &models.Post{
		Id:       "2",
		Contents: "hello websocket world",
	}

	data, marshalErr := proto.Marshal(post)
	if marshalErr != nil {
		log.Fatal(marshalErr)
	}

	writeErr := conn.WriteMessage(websocket.BinaryMessage, data)
	if writeErr != nil {
		log.Fatal(writeErr)
	}
}
