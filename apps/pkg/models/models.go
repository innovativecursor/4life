package models

import "gorm.io/gorm"

type Admin struct {
	gorm.Model

	FirstName       string
	LastName        string
	Email           string `gorm:"unique;not null" json:"email"`
	EmailVerified   bool
	ApplicationRole string // e.g., "Superadmin", "Admin", "ReadOnly"
	ApprovalStatus  string `gorm:"default:'pending'"` // "pending", "approved", "rejected"
}
