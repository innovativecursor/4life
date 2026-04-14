package userinfobygoogle

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/4life/apps/pkg/helper/jwthelper"
	"github.com/innovativecursor/4life/apps/pkg/models"
	"gorm.io/gorm"
)

func AddAdminInfo(c *gin.Context, db *gorm.DB, email, firstName, lastName string) (string, error) {
	// Default new user role and approval
	role := "NA"
	approvalStatus := "pending"

	var existing models.User
	err := db.Where("email = ?", email).First(&existing).Error

	if err == nil && existing.ApplicationRole == "Superadmin" {
		role = "Superadmin"
		approvalStatus = "approved"
	}

	if err == gorm.ErrRecordNotFound {
		admin := models.User{
			Email:           email,
			FirstName:       firstName,
			LastName:        lastName,
			EmailVerified:   true,
			ApplicationRole: role,
			ApprovalStatus:  approvalStatus,
		}
		if err := db.Create(&admin).Error; err != nil {
			return "", fmt.Errorf("failed to create admin: %w", err)
		}
		existing = admin

	} else if err != nil {
		return "", fmt.Errorf("failed to fetch admin: %w", err)

	} else {
		updated := false
		if existing.ApplicationRole != role {
			existing.ApplicationRole = role
			updated = true
		}
		if existing.ApprovalStatus != approvalStatus {
			existing.ApprovalStatus = approvalStatus
			updated = true
		}
		if updated {
			if err := db.Save(&existing).Error; err != nil {
				return "", fmt.Errorf("failed to update admin: %w", err)
			}
		}
	}

	jwtToken, err := jwthelper.GenerateJWTToken(email)
	if err != nil {
		return "", fmt.Errorf("failed to generate JWT: %w", err)
	}

	return jwtToken, nil
}

func GetUserInfo(accessToken string) (map[string]interface{}, error) {
	userInfoEndpoint := "https://www.googleapis.com/oauth2/v2/userinfo"
	resp, err := http.Get(fmt.Sprintf("%s?access_token=%s", userInfoEndpoint, accessToken))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var userInfo map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, err
	}

	return userInfo, nil
}
