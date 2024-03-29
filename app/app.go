package app

import (
	"github.com/sagittaros/gonews/lib/log"
	"github.com/sagittaros/gonews/lib/template"
	"github.com/sagittaros/gonews/repositories"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"os"
	"path"
)

var (
	AppName string

	BasePath     string
	ConfigPath   string
	TemplatePath string
	AssetsPath   string
	LogsPath     string

	RunMode string = "dev"
	DevMode bool   = true

	Router *mux.Router

	Sessions *sessions.FilesystemStore
	Cookies  *sessions.CookieStore

	Initialized bool = false
)

func Init(mode string) {
	RunMode = mode
	DevMode = mode == "dev"

	BasePath, _ = os.Getwd()
	ConfigPath = path.Join(BasePath, "app")
	TemplatePath = path.Join(BasePath, "templates")
	AssetsPath = path.Join(BasePath, "assets")
	LogsPath = path.Join(BasePath, "logs")

	Sessions = sessions.NewFilesystemStore("", []byte("secret"))
	Cookies = sessions.NewCookieStore([]byte("secret"))
	// Sessions = sessions.NewFilesystemStore("", securecookie.GenerateRandomKey(64))
	// Cookies = sessions.NewCookieStore(securecookie.GenerateRandomKey(64))

	log.Init(LogsPath)
	template.Init(TemplatePath)

	repositories.InitRethink()

	Initialized = true
}

func SetRouter(r *mux.Router) {
	Router = r
	template.SetRouter(r)
}
