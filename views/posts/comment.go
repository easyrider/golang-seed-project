package posts

import (
	"github.com/dancannon/gonews/models"
	"github.com/russross/blackfriday"
	"html/template"
)

type Comment struct {
	Comment  models.Comment
	Children []Comment
}

func (v *Comment) HasChildren() bool {
	return len(v.Children) > 0
}

func (v *Comment) CommentContent() template.HTML {
	return template.HTML(string(blackfriday.MarkdownCommon([]byte(v.Comment.Content))))
}
