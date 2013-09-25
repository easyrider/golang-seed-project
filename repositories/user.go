package repositories

import (
	. "github.com/dancannon/gonews/models"
	r "github.com/dancannon/gorethink"
)

type userRepository struct {
}

func (repo *userRepository) FindById(id string) (User, error) {
	var user User
	err := r.Table("users").Get(id).RunRow(conn).Scan(&user)

	return user, err
}

func (repo *userRepository) FindAll() ([]User, error) {
	var users []User
	rows, err := r.Table("users").Run(conn)
	if err != nil {
		return users, err
	}

	for rows.Next() {
		var user User

		err := rows.Scan(&user)
		if err != nil {
			return users, err
		}
		users = append(users, user)
	}

	return users, err
}

func (repo *userRepository) FindByUsername(username string) (User, error) {
	var user User
	query := r.Table("users").GetAllByIndex("Username", username)

	row := query.RunRow(conn)
	err := row.Scan(&user)

	return user, err
}

func (repo *userRepository) Insert(user User) (User, error) {
	response, err := r.Table("users").Insert(user).RunWrite(conn)

	if err != nil {
		return user, err
	}

	// Find new ID of product if needed
	if user.Id == "" && len(response.GeneratedKeys) == 1 {
		user.Id = response.GeneratedKeys[0]
	}

	return user, nil
}

func (repo *userRepository) Delete(id string) error {
	return r.Table("users").Get(id).Delete().Exec(conn)
}

func (repo *userRepository) DeleteAll() error {
	return r.Table("users").Delete().Exec(conn)
}
