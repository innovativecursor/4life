package admin

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/4life/apps/pkg/middleware"
	"github.com/innovativecursor/4life/apps/pkg/oauth"
	"github.com/innovativecursor/4life/apps/pkg/projectandtimeline"
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
	superadminOnly := []string{"Superadmin"}
	adminAndSuperadmin := []string{"Superadmin", "Admin"}
	var allRoles = []string{
		"Superadmin",
		"Admin",
		"ReadOnly",
		"Manufacturer",
		"Exporter",
		"Importer",
		"Distributor",
		"Retailer",
	}
	// Define handlers oauth
	apiV1.GET("/admin", func(c *gin.Context) {
		c.String(http.StatusOK, "admin Service Healthy")
	})

	apiV1.GET("/auth/google/callback", func(c *gin.Context) {
		oauth.GoogleCallbackHandler(c, db)
	})

	apiV1.GET("/superadmin/get-all-admin", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, superadminOnly...), func(c *gin.Context) {
		oauth.GetAllAdmins(c, db)
	})

	apiV1.GET("/superadmin/get-all-roles", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, superadminOnly...), func(c *gin.Context) {
		oauth.GetAllApplicationRoles(c, db)
	})

	apiV1.POST("/superadmin/create-roles", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, superadminOnly...), func(c *gin.Context) {
		oauth.CreateApplicationRole(c, db)
	})

	apiV1.PUT("/superadmin/approve-uesrs", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, superadminOnly...), func(c *gin.Context) {
		oauth.SuperAdminUpdateAdmin(c, db)
	})

	//project and timeline
	apiV1.POST("/project/add-timeline", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, superadminOnly...), func(c *gin.Context) {
		projectandtimeline.CreateTimeline(c, db)
	})

	apiV1.GET("/project/get-all-timelines", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, superadminOnly...), func(c *gin.Context) {
		projectandtimeline.GetAllTimelines(c, db)
	})

	apiV1.PUT("/project/update-timelines", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, superadminOnly...), func(c *gin.Context) {
		projectandtimeline.UpdateTimeline(c, db)
	})
	apiV1.POST("/project/create-project", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, superadminOnly...), func(c *gin.Context) {
		projectandtimeline.CreateProject(c, db)
	})

	apiV1.GET("/projects/get-all-project", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, allRoles...), func(c *gin.Context) {
		projectandtimeline.GetAllProjects(c, db)
	})

	apiV1.GET("/project/get-project-by/:id", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, allRoles...), func(c *gin.Context) {
		projectandtimeline.GetProjectByID(c, db)
	})

	apiV1.PUT("/project/step-status-update", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, allRoles...), func(c *gin.Context) {
		projectandtimeline.UpdateStepStatus(c, db)
	})

	apiV1.POST("/project/assign-step-roles", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, adminAndSuperadmin...), func(c *gin.Context) {
		projectandtimeline.AssignRolesToStep(c, db)
	})

	apiV1.POST("/project/assign-complaint-roles", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, adminAndSuperadmin...), func(c *gin.Context) {
		projectandtimeline.AssignComplaintRoles(c, db)
	})

	apiV1.POST("/project/create-complaint", middleware.JWTMiddleware(db), middleware.RoleMiddleware(db, allRoles...), func(c *gin.Context) {
		projectandtimeline.CreateComplaint(c, db)
	})
	// Listen and serve on defined port
	log.Printf("Application started, Listening on Port %s", port)
	router.Run(":" + port)
}
