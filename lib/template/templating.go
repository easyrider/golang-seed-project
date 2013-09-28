package template

import (
	"bytes"
	"code.google.com/p/sadbox/zap"
	"fmt"
	"github.com/dancannon/gonews/lib/log"
	"github.com/gorilla/mux"
	htmlTemplate "html/template"
	"net/http"
	"os"
	"path/filepath"
)

var (
	templatePath string
	templates    *htmlTemplate.Template

	router *mux.Router
)

func Init(path string) {
	templatePath = path

	// Get all files in the views directory
	filenames := []string{}
	err := filepath.Walk(templatePath, func(path string, info os.FileInfo, err error) error {
		if !info.IsDir() && filepath.Ext(path) == ".gohtml" {
			filenames = append(filenames, path)
		}

		return nil
	})
	if err != nil {
		log.ERROR.Fatalln(err)
	}

	if len(filenames) == 0 {
		return
	}

	// Parse the view files
	zapper := new(zap.Zapper)
	zapper.Funcs(map[string]interface{}{
		"route": routeHelper,
	})
	zapper, err = zapper.ParseFiles(filenames...)
	if err != nil {
		log.ERROR.Fatalln(err)
	}

	buf := new(bytes.Buffer)
	err = zapper.Zap(buf)
	if err != nil {
		log.ERROR.Fatalln(err)
	}

	// Load the html/template templates
	template := buf.String()
	templates = htmlTemplate.New("_")
	templates.Funcs(map[string]interface{}{
		"route": routeHelper,
	})
	templates = htmlTemplate.Must(templates.Parse(template))
}

func Render(w http.ResponseWriter, name string, data interface{}) error {
	return templates.ExecuteTemplate(w, name, data)
}

func SetRouter(r *mux.Router) {
	router = r
}

// Helper functions
func routeHelper(name string, args ...string) (string, error) {
	route := router.Get(name)
	if route == nil {
		return "", fmt.Errorf("No route exists with the name '%s'", name)
	}

	url, err := route.URL(args...)
	if err != nil {
		return "", err
	}

	return url.String(), nil
}
