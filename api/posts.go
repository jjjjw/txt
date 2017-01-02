package api

import (
	"github.com/golang/protobuf/proto"
	"github.com/julienschmidt/httprouter"
	"github.com/zjjw/txt/models"
	"log"
	"net/http"
	"io/ioutil"
)

func GetPost(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	post := &models.Post{
		Id:       ps.ByName("id"),
		Contents: "hello world",
	}

	data, marshalErr := proto.Marshal(post)
	if marshalErr != nil {
		log.Fatal(marshalErr)
	}

	_, writeErr := w.Write(data)
	if writeErr != nil {
		log.Fatal(writeErr)
	}
}

func GetPosts(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	posts := &models.Posts{
		Posts: []*models.Post{
			{"1", "hello world"},
		},
	}

	data, marshalErr := proto.Marshal(posts)
	if marshalErr != nil {
		log.Fatal(marshalErr)
	}

	_, writeErr := w.Write(data)
	if writeErr != nil {
		log.Fatal(writeErr)
	}
}

func NewPost(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	data, readErr := ioutil.ReadAll(r.Body)

	if readErr != nil {
		log.Fatal(readErr)
	}

	post := &models.Post{}
	validationErr := proto.Unmarshal(data, post)

	if validationErr != nil {
		log.Fatal(validationErr)
	}

	data, marshalErr := proto.Marshal(post)
	if marshalErr != nil {
		log.Fatal(marshalErr)
	}

	_, writeErr := w.Write(data)
	if writeErr != nil {
		log.Fatal(writeErr)
	}
}
