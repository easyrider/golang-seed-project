package repositories

import (
	. "github.com/sagittaros/gonews/models"
	r "github.com/sagittaros/gorethink"
)

type commentRepository struct {
}

func (repo *commentRepository) FindById(id string) (Comment, error) {
	var comment Comment
	row, err := r.Table("comments").Get(id).RunRow(session)
	if err != nil {
		// error
	}
	if row.IsNil() {
		// nothing was found
	}
	err = row.Scan(&comment)

	return comment, err
}

func (repo *commentRepository) FindAll() ([]Comment, error) {
	var comments []Comment
	rows, err := r.Table("comments").Run(session)
	if err != nil {
		return comments, err
	}

	for rows.Next() {
		var comment Comment

		err := rows.Scan(&comment)
		if err != nil {
			return comments, err
		}
		comments = append(comments, comment)
	}

	return comments, err
}

func (repo *commentRepository) FindByPost(post string) ([]Comment, error) {
	var comments []Comment
	query := r.Table("comments").Filter(r.Row.Field("Post").Eq(post))
	query = query.Filter(r.Row.Field("Depth").Eq(0)).OrderBy(r.Desc(orderByTop))
	rows, err := query.Run(session)
	if err != nil {
		return comments, err
	}

	for rows.Next() {
		var comment Comment

		err := rows.Scan(&comment)
		if err != nil {
			return comments, err
		}
		comments = append(comments, comment)
	}

	return comments, err
}

func (repo *commentRepository) FindChildren(id string) ([]Comment, error) {
	var comments []Comment
	query := r.Table("comments").Filter(r.Row.Field("Parent").Eq(id))
	query = query.OrderBy(r.Desc(orderByTop))
	rows, err := query.Run(session)
	if err != nil {
		return comments, err
	}

	for rows.Next() {
		var comment Comment

		err := rows.Scan(&comment)
		if err != nil {
			return comments, err
		}
		comments = append(comments, comment)
	}

	return comments, err
}

func (repo *commentRepository) Store(comment Comment) (Comment, error) {
	response, err := r.Table("comments").Insert(comment).RunWrite(session)

	if err != nil {
		return comment, err
	}

	// Find new ID of product if needed
	if comment.Id == "" && len(response.GeneratedKeys) == 1 {
		comment.Id = response.GeneratedKeys[0]
	}

	return comment, nil
}

func (repo *commentRepository) Update(comment Comment) (Comment, error) {
	_, err := r.Table("comments").Update(comment).RunWrite(session)

	if err != nil {
		return comment, err
	}

	return comment, nil
}

func (repo *commentRepository) Delete(id string) error {
	return r.Table("comments").Get(id).Delete().Exec(session)
}

func (repo *commentRepository) DeleteAll() error {
	return r.Table("comments").Delete().Exec(session)
}
