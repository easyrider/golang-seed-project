package repositories

import (
	"github.com/sagittaros/gonews/lib/log"
	r "github.com/sagittaros/gorethink"
)

var (
	session *r.Session
)

func InitRethink() {
	var err error

	session, err = r.Connect(map[string]interface{}{
		"address":  "localhost:28015",
		"database": "news",
	})
	if err != nil {
		log.ERROR.Fatalln(err.Error())
	}
}
