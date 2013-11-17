package main

import (
	"fmt"
	"github.com/sagittaros/gonews/app"
	"github.com/sagittaros/gonews/controllers"
	"github.com/sagittaros/gonews/lib/log"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"net/http"
)

func NewServer(mode string, addr string) *http.Server {
	// Create application
	app.Init(mode)

	// Setup router
	app.SetRouter(initRouting())

	// Setup handlers
	var handler http.Handler
	handler = app.Router
	handler = handlers.CombinedLoggingHandler(log.GetLogFile("access.log"), handler)

	// Create and start server
	return &http.Server{
		Addr:    fmt.Sprintf("%s", addr),
		Handler: handler,
	}
}

func StartServer(server *http.Server) {
	err := server.ListenAndServe()
	if err != nil {
		log.ERROR.Fatalln("Error: %v", err)
	}
}

func initRouting() *mux.Router {
	r := mux.NewRouter()

	// new(controllers.IndexController).Init(r.PathPrefix("/").Subrouter())
	new(controllers.PostController).Init(r)
	new(controllers.SecurityController).Init(r)

	// Add handler for static files
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("static")))

	return r
}
