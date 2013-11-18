package repositories

import (
	. "github.com/sagittaros/gonews/models"
	r "github.com/sagittaros/gorethink"
)

type userRepository struct {
}

func (repo *userRepository) FindById(id string) (User, error) {
	var user User
	row, err := r.Table("users").Get(id).RunRow(session)
	if err != nil {
		// error
	}
	if row.IsNil() {
		// nothing was found
	}
	err = row.Scan(&user)

	return user, err
}

func (repo *userRepository) FindAll() ([]User, error) {
	var users []User
	rows, err := r.Table("users").Run(session)
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

	row, err := query.RunRow(session)
	err = row.Scan(&user)

	return user, err
}

func (repo *userRepository) Insert(user User) (User, error) {
	response, err := r.Table("users").Insert(user).RunWrite(session)

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
	return r.Table("users").Get(id).Delete().Exec(session)
}

func (repo *userRepository) DeleteAll() error {
	return r.Table("users").Delete().Exec(session)
}
