package main

import (
	"github.com/julienschmidt/httprouter"
	"github.com/zjjw/txt/api"
	"log"
	"net/http"
	"time"
)

func CORS(handler http.Handler) http.Handler {
	wrapped := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		handler.ServeHTTP(w, r)
	}
	return http.HandlerFunc(wrapped)
}

func main() {
	router := httprouter.New()

	router.GET("/api/posts/:id", api.GetPost)
	router.GET("/api/posts", api.GetPosts)
	router.POST("/api/posts", api.NewPost)
	router.GET("/ws", api.WS)

	handler := CORS(router)

	s := &http.Server{
		Addr:         ":8008",
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Fatal(s.ListenAndServe())
}
