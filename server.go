package main

import (
	"fmt"
	"github.com/dancannon/gonews/app"
	"github.com/dancannon/gonews/controllers"
	"github.com/dancannon/gonews/util/log"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"net/http"
)

func NewServer(mode string, addr string) *http.Server {
	// Create application
	app.Init(mode)

	// Setup router
	app.SetRouter(initRouting())

	// Setup logging handler
	loggingHandler := handlers.CombinedLoggingHandler(log.GetLogFile("access.log"), app.Router)

	// Create and start server
	return &http.Server{
		Addr:    fmt.Sprintf("%s", addr),
		Handler: loggingHandler,
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
