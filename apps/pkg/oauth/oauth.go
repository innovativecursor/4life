package oauth

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/4life/apps/pkg/config"
	"github.com/innovativecursor/4life/apps/pkg/helper/jwthelper"
	"github.com/innovativecursor/4life/apps/pkg/helper/oauthhelper"
	"github.com/innovativecursor/4life/apps/pkg/helper/userinfobygoogle"
	"github.com/innovativecursor/4life/apps/pkg/models"
	"gorm.io/gorm"
)

// var googleOauthConfig = &oauth2.Config{}

// func init() {
// 	googleOauthConfig = &oauth2.Config{
// 		RedirectURL:  "http://localhost:3004", // backend redirect URL
// 		// RedirectURL: "https://admin.kloudpx.com", // backend redirect URL
// 		Scopes:   []string{"profile", "email"},
// 		Endpoint: google.Endpoint,
// 	}
// }
// func GoogleCallbackHandler(c *gin.Context, db *gorm.DB) {
// 	code := c.Query("code")
// 	if code == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Code not found in query params"})
// 		return
// 	}

// 	token, err := googleOauthConfig.Exchange(context.Background(), code)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to exchange code"})
// 		return
// 	}

// 	userInfo, err := userinfobygoogle.GetUserInfo(token.AccessToken)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get user info"})
// 		return
// 	}

// 	email, _ := userInfo["email"].(string)
// 	firstName, _ := userInfo["given_name"].(string)
// 	lastName, _ := userInfo["family_name"].(string)

// 	var admin models.Admin
// 	err = db.Where("email = ?", email).First(&admin).Error
// 	if err == gorm.ErrRecordNotFound {
// 		// Create new admin with pending approval
// 		jwtToken, err := userinfobygoogle.AddAdminInfo(c, db, email, firstName, lastName)
// 		if err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 			return
// 		}

// 		c.JSON(http.StatusOK, gin.H{
// 			"message": "Account created. Awaiting approval from Superadmin.",
// 			"status":  "pending",
// 			"token":   jwtToken,
// 		})
// 		return
// 	} else if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
// 		return
// 	}

// 	// Handle approval status
// 	switch admin.ApprovalStatus {
// 	case "pending":
// 		c.JSON(http.StatusForbidden, gin.H{
// 			"message": "Your account is pending approval by Superadmin.",
// 			"status":  "pending",
// 		})
// 		return

// 	case "rejected":
// 		c.JSON(http.StatusForbidden, gin.H{
// 			"message": "Your account access has been rejected.",
// 			"status":  "rejected",
// 		})
// 		return
// 	}

// 	// Approved admin → issue JWT
// 	jwtToken, err := jwthelper.GenerateJWTToken(email)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "JWT generation failed"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"token":   jwtToken,
// 		"status":  "approved",
// 		"message": "Login successful",
// 	})
// }

func GoogleCallbackHandler(c *gin.Context, db *gorm.DB) {
	cfg, err := config.Env()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Config load failed"})
		return
	}
	oauthCfg, err := oauthhelper.GoogleOAuthConfig(
		cfg.GoogleOauth.AdminRedirectURI,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "OAuth config failed"})
		return
	}

	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Code not found in query params"})
		return
	}

	token, err := oauthCfg.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to exchange code"})
		return
	}

	userInfo, err := userinfobygoogle.GetUserInfo(token.AccessToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get user info"})
		return
	}

	email, _ := userInfo["email"].(string)
	firstName, _ := userInfo["given_name"].(string)
	lastName, _ := userInfo["family_name"].(string)

	var admin models.Admin
	err = db.Where("email = ?", email).First(&admin).Error
	if err == gorm.ErrRecordNotFound {
		// Create new admin with pending approval
		jwtToken, err := userinfobygoogle.AddAdminInfo(c, db, email, firstName, lastName)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Account created. Awaiting approval from Superadmin.",
			"status":  "pending",
			"token":   jwtToken,
		})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Handle approval status
	switch admin.ApprovalStatus {
	case "pending":
		c.JSON(http.StatusForbidden, gin.H{
			"message": "Your account is pending approval by Superadmin.",
			"status":  "pending",
		})
		return

	case "rejected":
		c.JSON(http.StatusForbidden, gin.H{
			"message": "Your account access has been rejected.",
			"status":  "rejected",
		})
		return
	}

	// Approved admin → issue JWT
	jwtToken, err := jwthelper.GenerateJWTToken(email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "JWT generation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":   jwtToken,
		"status":  "approved",
		"message": "Login successful",
	})
}

func GetAllAdmins(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	adminUser, ok := user.(*models.Admin)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	// OPTIONAL: restrict only Superadmin
	if adminUser.ApplicationRole != "Superadmin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	var admins []models.Admin

	if err := db.Order("created_at DESC").Find(&admins).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch admins"})
		return
	}

	type AdminResponse struct {
		ID              uint   `json:"id"`
		FirstName       string `json:"first_name"`
		LastName        string `json:"last_name"`
		Email           string `json:"email"`
		EmailVerified   bool   `json:"email_verified"`
		ApplicationRole string `json:"application_role"`
		ApprovalStatus  string `json:"approval_status"`
		CreatedAt       string `json:"created_at"`
	}

	var response []AdminResponse

	for _, a := range admins {
		response = append(response, AdminResponse{
			ID:              a.ID,
			FirstName:       a.FirstName,
			LastName:        a.LastName,
			Email:           a.Email,
			EmailVerified:   a.EmailVerified,
			ApplicationRole: a.ApplicationRole,
			ApprovalStatus:  a.ApprovalStatus,
			CreatedAt:       a.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"total":  len(response),
		"admins": response,
	})
}

type UpdateAdminAccessRequest struct {
	Email  string `json:"email" binding:"required,email"`
	Role   string `json:"role"`   // Admin, ReadOnly
	Status string `json:"status"` // approved/rejected
}

func SuperAdminUpdateAdmin(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	currentAdmin, ok := user.(*models.Admin)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	if currentAdmin.ApplicationRole != "Superadmin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only Superadmin can update admins"})
		return
	}
	var req UpdateAdminAccessRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	validRoles := map[string]bool{
		"Admin":    true,
		"ReadOnly": true,
	}

	validStatus := map[string]bool{
		"approved": true,
		"rejected": true,
	}

	if req.Role != "" && !validRoles[req.Role] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role"})
		return
	}

	if req.Status != "" && !validStatus[req.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status"})
		return
	}

	if currentAdmin.Email == req.Email {
		c.JSON(http.StatusForbidden, gin.H{"error": "You cannot modify your own permissions"})
		return
	}

	var admin models.Admin
	if err := db.Where("email = ?", req.Email).First(&admin).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	if admin.ApplicationRole == "Superadmin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Cannot modify Superadmin"})
		return
	}
	updateData := map[string]interface{}{}
	if req.Role != "" {
		updateData["application_role"] = req.Role
	}
	if req.Status != "" {
		updateData["approval_status"] = req.Status
	}

	db.Model(&admin).Updates(updateData)

	c.JSON(http.StatusOK, gin.H{"message": "Admin updated successfully", "admin": admin})
}
