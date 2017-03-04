package api_test

// import (
// 	"bytes"
// 	"github.com/golang/protobuf/proto"
// 	"github.com/gorilla/websocket"
// 	"github.com/julienschmidt/httprouter"
// 	"github.com/zjjw/txt/api"
// 	"github.com/zjjw/txt/models"
// 	"net/http/httptest"
// 	"testing"
// )

// var dialier = websocket.Dialer{
// 	ReadBufferSize:  1024,
// 	WriteBufferSize: 1024,
// }

// func newServer(t *testing.T) *cstServer {
// 	var s cstServer
// 	s.Server = httptest.NewServer(cstHandler{t})
// 	s.Server.URL += cstRequestURI
// 	s.URL = makeWsProto(s.Server.URL)
// 	return &s
// }

// func TestDial(t *testing.T) {
// 	s := newServer(t)
// 	defer s.Close()

// 	ws, _, err := cstDialer.Dial(s.URL, nil)
// 	if err != nil {
// 		t.Fatalf("Dial: %v", err)
// 	}
// 	defer ws.Close()
// 	sendRecv(t, ws)
// }

// func TestGetWS(t *testing.T) {
// 	ps := httprouter.Params{
// 		httprouter.Param{"id", "1"},
// 	}

// 	req := httptest.NewRequest("GET", "http://example.com/foo", nil)
// 	w := httptest.NewRecorder()

// 	api.WS(w, req, ps)

// 	t.Logf("%d - %s", w.Code, w.Body.String())

// 	if w.Code != 200 {
// 		t.Fail()
// 	}

// 	post := &models.Post{}
// 	err := proto.Unmarshal(w.Body.Bytes(), post)

// 	if err != nil {
// 		t.Fail()
// 	}

// 	if post.Id != "1" {
// 		t.Fail()
// 	}

// 	if post.Contents != "hello world" {
// 		t.Fail()
// 	}
// }
