package main

import (
	"github.com/julienschmidt/httprouter"
	"github.com/zjjw/txt/api"
	"log"
	"net/http"
	"time"
)

func main() {
	router := httprouter.New()
	router.GET("/api/posts/:id", api.GetPost)
	router.GET("/api/posts", api.GetPosts)

	s := &http.Server{
		Addr:         ":8008",
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Fatal(s.ListenAndServe())
}
