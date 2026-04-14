package models

import "gorm.io/gorm"

type User struct {
	gorm.Model

	FirstName       string
	LastName        string
	Email           string `gorm:"unique;not null" json:"email"`
	EmailVerified   bool
	ApplicationRole string // e.g., "Superadmin",
	ApprovalStatus  string `gorm:"default:'pending'"` // "pending", "approved", "rejected"
}

type ApplicationRole struct {
	gorm.Model
	Name string `gorm:"unique;not null"`
}
