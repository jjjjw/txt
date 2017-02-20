package api

import (
	"github.com/golang/protobuf/proto"
	"github.com/julienschmidt/httprouter"
	"github.com/satori/go.uuid"
	"github.com/zjjw/txt/models"
	"io/ioutil"
	"log"
	"net/http"
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

	// Set the Id
	post.Id = uuid.NewV4().String()

	data, marshalErr := proto.Marshal(post)
	if marshalErr != nil {
		log.Fatal(marshalErr)
	}

	_, writeErr := w.Write(data)
	if writeErr != nil {
		log.Fatal(writeErr)
	}

	hub, ok := r.Context().Value("hub").(*Hub)
	if ok == false {
		log.Fatal("Failed to get hub")
	}

	// Add to the created posts channel
	hub.created <- data
}
