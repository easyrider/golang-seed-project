package validation

import (
	"fmt"
	"strings"
)

type NotBlank struct {
	Field   string
	Message string
}

func (r NotBlank) Validate(v *Validator, data []string) bool {
	return data[0] != ""
}
func (r NotBlank) Error(data []string) string {
	if r.Message != "" {
		return fmt.Sprintf(r.Message)
	} else {
		if r.Field != "" {
			return fmt.Sprintf("The %s field should not be blank", r.Field)
		} else {
			return fmt.Sprintf("That field should not be blank")
		}
	}
}

type Blank struct {
	Field   string
	Message string
}

func (r Blank) Validate(v *Validator, data []string) bool {
	return data[0] == ""
}
func (r Blank) Error(data []string) string {
	if r.Message != "" {
		return fmt.Sprintf(r.Message)
	} else {
		if r.Field != "" {
			return fmt.Sprintf("The %s field should be blank", r.Field)
		} else {
			return fmt.Sprintf("That field should be blank")
		}
	}
}

type Length struct {
	Field   string
	Message string

	Min int
	Max int
}

func (r Length) Validate(v *Validator, data []string) bool {
	return len(data) > r.Min && len(data) < r.Max
}
func (r Length) Error(data []string) string {
	if r.Message != "" {
		return fmt.Sprintf(r.Message)
	} else {
		if r.Field != "" {
			return fmt.Sprintf("The %s field should have between %d and %d elements", r.Field, r.Min, r.Max)
		} else {
			return fmt.Sprintf("That field should have between %d and %d elements", r.Min, r.Max)
		}
	}
}

type Email struct {
	Field   string
	Message string
}

func (r Email) Validate(v *Validator, data []string) bool {
	// Skip this test if the field is blank
	if data[0] == "" {
		return true
	}

	return strings.Index(data[0], "@") > -1
}
func (r Email) Error(data []string) string {
	if r.Message != "" {
		return fmt.Sprintf(r.Message)
	} else {
		if r.Field != "" {
			return fmt.Sprintf("The %s field should be an E-Mail address", r.Field)
		} else {
			return fmt.Sprintf("That field should be E-Mail address")
		}
	}
}

type Matches struct {
	Field      string
	Message    string
	OtherField string
}

func (r Matches) Validate(v *Validator, data []string) bool {
	if r.OtherField == "" {
		return false
	}

	// Ensure the other field exists
	if _, ok := v.data[r.OtherField]; !ok {
		return false
	}

	return data[0] == v.data[r.OtherField][0]
}
func (r Matches) Error(data []string) string {
	if r.Message != "" {
		return fmt.Sprintf(r.Message)
	} else {
		if r.Field != "" {
			return fmt.Sprintf("The %s fields should be the same", r.Field)
		} else {
			return fmt.Sprintf("Those fields should be the same")
		}
	}
}
