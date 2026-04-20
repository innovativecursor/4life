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
	Market      string
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

type TimelineStepRole struct {
	gorm.Model

	TimelineStepID uint
	RoleName       string // "Manufacturer", "Exporter", etc.
}

type ProjectComplaint struct {
	gorm.Model

	ProjectID uint
	UserID    uint

	Text string

	Images []ProjectComplaintImage `gorm:"foreignKey:ComplaintID"`
}

type ProjectComplaintImage struct {
	gorm.Model

	ComplaintID uint
	ImageURL    string
}

type ComplaintRoleAccess struct {
	gorm.Model

	ProjectID uint
	RoleName  string // Manufacturer, Exporter, etc.
}
