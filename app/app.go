package app

import (
	"github.com/dancannon/gonews/lib/log"
	"github.com/dancannon/gonews/lib/template"
	"github.com/dancannon/gonews/repositories"
	"github.com/gorilla/mux"
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
	"os"
	"path"
)

var (
	AppName string

	BasePath   string
	ConfigPath string
	ViewsPath  string
	AssetsPath string
	LogsPath   string

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
	ViewsPath = path.Join(BasePath, "views")
	AssetsPath = path.Join(BasePath, "assets")
	LogsPath = path.Join(BasePath, "logs")

	Sessions = sessions.NewFilesystemStore("", securecookie.GenerateRandomKey(64))
	Cookies = sessions.NewCookieStore(securecookie.GenerateRandomKey(64))

	log.Init(LogsPath)
	template.Init(ViewsPath)

	repositories.InitRethink()

	Initialized = true
}

func SetRouter(r *mux.Router) {
	Router = r
}
