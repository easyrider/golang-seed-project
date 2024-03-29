package repositories

import (
	. "github.com/sagittaros/gonews/models"
	r "github.com/sagittaros/gorethink"
)

type postRepository struct {
}

func (repo *postRepository) FindById(id string) (Post, error) {
	var post Post
	row, err := r.Table("posts").Get(id).RunRow(session)
	if err != nil {
		// error
	}
	if row.IsNil() {
		// nothing was found
	}
	err = row.Scan(&post)
	return post, err
}

func (repo *postRepository) FindAll() ([]Post, error) {
	var posts []Post
	rows, err := r.Table("posts").Run(session)
	if err != nil {
		return posts, err
	}

	for rows.Next() {
		var post Post

		err := rows.Scan(&post)
		if err != nil {
			return posts, err
		}
		posts = append(posts, post)
	}

	return posts, err
}

func (repo *postRepository) FindTopByPage(page int, count int) ([]Post, error) {
	var posts []Post
	query := r.Table("posts").OrderBy(r.Desc(orderByTop))
	query = query.Map(func(row r.RqlTerm) r.RqlTerm {
		return row.Merge(map[string]interface{}{
			"Author": r.Table("users").Get(row.Field("Author")).Field("Username").Default(""),
		})
	})
	query = query.Skip((page - 1) * count).Limit(count)
	row, err := query.RunRow(session)
	if err != nil {
		// error
	}
	if row.IsNil() {
		// nothing was found
	}
	err = row.Scan(&posts)
	// if err != nil {
	// 	return posts, err
	// }

	// for rows.Next() {
	// 	var post Post

	// 	err := rows.Scan(&post)
	// 	if err != nil {
	// 		return posts, err
	// 	}
	// 	posts = append(posts, post)
	// }

	return posts, err
}

func (repo *postRepository) FindNewByPage(page int, count int) ([]Post, error) {
	var posts []Post
	query := r.Table("posts").OrderBy(r.Desc(orderByNew))
	query = query.Skip((page - 1) * count).Limit(count)
	rows, err := query.Run(session)
	if err != nil {
		return posts, err
	}

	for rows.Next() {
		var post Post

		err := rows.Scan(&post)
		if err != nil {
			return posts, err
		}
		posts = append(posts, post)
	}

	return posts, err
}

func (repo *postRepository) Store(post Post) (Post, error) {
	response, err := r.Table("posts").Insert(post).RunWrite(session)

	if err != nil {
		return post, err
	}

	// Find new ID of product if needed
	if post.Id == "" && len(response.GeneratedKeys) == 1 {
		post.Id = response.GeneratedKeys[0]
	}

	return post, nil
}

func (repo *postRepository) Update(post Post) (Post, error) {
	_, err := r.Table("posts").Update(post).RunWrite(session)

	if err != nil {
		return post, err
	}

	return post, nil
}

func (repo *postRepository) Delete(id string) error {
	return r.Table("posts").Get(id).Delete().Exec(session)
}

func (repo *postRepository) DeleteAll() error {
	return r.Table("posts").Delete().Exec(session)
}
