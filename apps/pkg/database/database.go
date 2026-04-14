package database

import (
	"fmt"
	"time"

	"github.com/innovativecursor/4life/apps/pkg/config"
	"github.com/innovativecursor/4life/apps/pkg/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func InitDB() (*gorm.DB, error) {
	var err error

	// Open database connection
	cfg, err := config.Env()
	if err != nil {
		return nil, fmt.Errorf("Failed to load config: %v", err)
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", cfg.Database.Username, cfg.Database.Password, cfg.Database.Host, cfg.Database.Port, cfg.Database.DatabaseName)
	dbConn, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	// Set database connection settings
	sqlDB, err := dbConn.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get DB instance: %v", err)
	}
	sqlDB.SetMaxIdleConns(10)                 // Maximum number of idle connections in the connection pool
	sqlDB.SetMaxOpenConns(100)                // Maximum number of open connections
	sqlDB.SetConnMaxLifetime(5 * time.Minute) // Maximum lifetime of a connection

	// Create database tables
	err = dbConn.AutoMigrate(&models.User{}, &models.ApplicationRole{})
	if err != nil {
		return nil, fmt.Errorf("failed to auto migrate User table: %v", err)
	}

	if err := seedSuperAdmin(dbConn, cfg); err != nil {
		return nil, fmt.Errorf("failed to seed superadmin: %v", err)
	}

	if err := seedApplicationRoles(dbConn); err != nil {
		return nil, fmt.Errorf("failed to seed roles: %v", err)
	}
	return dbConn, nil
}

func seedSuperAdmin(db *gorm.DB, cfg config.Config) error {
	var existing models.User

	err := db.Where("email = ?", cfg.SuperAdmin.Email).First(&existing).Error

	if err == gorm.ErrRecordNotFound {
		superAdmin := models.User{
			Email:           cfg.SuperAdmin.Email,
			FirstName:       cfg.SuperAdmin.FirstName,
			LastName:        cfg.SuperAdmin.LastName,
			EmailVerified:   true,
			ApplicationRole: "Superadmin",
			ApprovalStatus:  "approved",
		}

		if err := db.Create(&superAdmin).Error; err != nil {
			return err
		}
		fmt.Println("Superadmin seeded successfully")
		return nil
	}

	if err != nil {
		return err
	}

	// Optional: ensure role is always correct
	if existing.ApplicationRole != "Superadmin" {
		existing.ApplicationRole = "Superadmin"
		existing.ApprovalStatus = "approved"
		db.Save(&existing)
	}

	return nil
}

func seedApplicationRoles(db *gorm.DB) error {
	roles := []string{
		"Superadmin",
		"Manufacturer",
		"Exporter",
		"Importer",
		"Distributor",
		"Retailer",
	}

	for _, role := range roles {
		var existing models.ApplicationRole

		err := db.Where("name = ?", role).First(&existing).Error

		if err == gorm.ErrRecordNotFound {
			newRole := models.ApplicationRole{
				Name: role,
			}

			if err := db.Create(&newRole).Error; err != nil {
				return err
			}
		} else if err != nil {
			return err
		}
	}

	fmt.Println("Application roles seeded successfully")
	return nil
}
