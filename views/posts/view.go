package posts

import (
	"github.com/dancannon/gonews/models"
	"github.com/gorilla/mux"
	"github.com/russross/blackfriday"
	"html/template"
)

type View struct {
	Post     models.Post
	Comments []Comment
	Router   *mux.Router
}

func (v *View) PostContent() template.HTML {
	if v.Post.IsType(models.PostTypeText) {
		return template.HTML(string(blackfriday.MarkdownCommon([]byte(v.Post.Content))))
	}
	return ""
}
