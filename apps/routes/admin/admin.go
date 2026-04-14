package admin

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/4life/apps/pkg/middleware"
	"github.com/innovativecursor/4life/apps/pkg/oauth"
	"github.com/innovativecursor/4life/apps/routes/getapiroutes"
	"gorm.io/gorm"
)

func Admin(db *gorm.DB) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10005"
		log.Printf("Defaulting to port %s", port)
	}

	apiV1, router := getapiroutes.GetApiRoutes()
	// superadminOnly := []string{"Superadmin"}
	// adminAndSuperadmin := []string{"Superadmin", "Admin"}
	// allRoles := []string{"Superadmin", "Admin", "ReadOnly"}

	// Define handlers oauth
	apiV1.GET("/admin", func(c *gin.Context) {
		c.String(http.StatusOK, "admin Service Healthy")
	})

	apiV1.GET("/auth/google/callback", func(c *gin.Context) {
		oauth.GoogleCallbackHandler(c, db)
	})

	apiV1.GET("/superadmin/get-all-admin", middleware.JWTMiddleware(db), func(c *gin.Context) {
		oauth.GetAllAdmins(c, db)
	})

	apiV1.GET("/superadmin/get-all-roles", middleware.JWTMiddleware(db), func(c *gin.Context) {
		oauth.GetAllApplicationRoles(c, db)
	})

	apiV1.PUT("/superadmin/approve-uesrs", middleware.JWTMiddleware(db), func(c *gin.Context) {
		oauth.SuperAdminUpdateAdmin(c, db)
	})

	// Listen and serve on defined port
	log.Printf("Application started, Listening on Port %s", port)
	router.Run(":" + port)
}
