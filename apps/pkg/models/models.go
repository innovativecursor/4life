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

type Timeline struct {
	gorm.Model
	Name        string
	IsDefault   bool
	CreatedByID *uint
	Steps       []TimelineStep `gorm:"foreignKey:TimelineID"`
}

type TimelineStep struct {
	gorm.Model
	TimelineID uint
	Name       string
	StepOrder  int
}

type Project struct {
	gorm.Model
	Name        string
	Description string
	TimelineID  uint
	Timeline    Timeline `gorm:"foreignKey:TimelineID"`
}

type ProjectStepStatus struct {
	gorm.Model

	ProjectID      uint
	TimelineStepID uint

	Status string // pending, in_progress, completed

	UpdatedByID uint

	Images []ProjectStepImage `gorm:"foreignKey:ProjectStepStatusID"`
}

type ProjectStepImage struct {
	gorm.Model

	ProjectStepStatusID uint
	ImageURL            string
}
