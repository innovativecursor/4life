package projectandtimeline

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
	cfg "github.com/innovativecursor/4life/apps/pkg/config"
	"github.com/innovativecursor/4life/apps/pkg/helper/s3helper"
	"github.com/innovativecursor/4life/apps/pkg/models"
	"github.com/innovativecursor/4life/apps/pkg/projectandtimeline/config"
	"gorm.io/gorm"
)

func CreateTimeline(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	currentUser, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var req config.CreateTimelineRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(req.Steps) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Steps cannot be empty"})
		return
	}

	var existing models.Timeline
	if err := db.Where("name = ?", req.Name).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Timeline already exists"})
		return
	}
	var timeline models.Timeline

	err := db.Transaction(func(tx *gorm.DB) error {

		timeline = models.Timeline{
			Name:        req.Name,
			IsDefault:   false,
			CreatedByID: &currentUser.ID,
		}

		if err := tx.Create(&timeline).Error; err != nil {
			return err
		}

		for i, step := range req.Steps {
			if err := tx.Create(&models.TimelineStep{
				Name:       step,
				StepOrder:  i + 1,
				TimelineID: timeline.ID,
			}).Error; err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create timeline"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Timeline created",
		"timeline": timeline,
	})
}

func GetAllTimelines(c *gin.Context, db *gorm.DB) {

	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var timelines []models.Timeline

	if err := db.
		Preload("Steps", func(db *gorm.DB) *gorm.DB {
			return db.Order("step_order ASC")
		}).
		Order("created_at DESC").
		Find(&timelines).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch timelines",
		})
		return
	}

	type StepResponse struct {
		ID        uint   `json:"id"`
		Name      string `json:"name"`
		StepOrder int    `json:"step_order"`
	}

	type TimelineResponse struct {
		ID        uint           `json:"id"`
		Name      string         `json:"name"`
		IsDefault bool           `json:"is_default"`
		Steps     []StepResponse `json:"steps"`
		CreatedAt string         `json:"created_at"`
	}

	var response []TimelineResponse

	for _, t := range timelines {
		var steps []StepResponse

		for _, s := range t.Steps {
			steps = append(steps, StepResponse{
				ID:        s.ID,
				Name:      s.Name,
				StepOrder: s.StepOrder,
			})
		}

		response = append(response, TimelineResponse{
			ID:        t.ID,
			Name:      t.Name,
			IsDefault: t.IsDefault,
			Steps:     steps,
			CreatedAt: t.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"total":     len(response),
		"timelines": response,
	})
}

func UpdateTimeline(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user"})
		return
	}

	var req struct {
		TimelineID uint   `json:"timeline_id" binding:"required"`
		Name       string `json:"name" binding:"required"`
		Steps      []struct {
			ID        *uint  `json:"id"` // optional
			Name      string `json:"name" binding:"required"`
			StepOrder int    `json:"step_order" binding:"required"`
		} `json:"steps" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var timeline models.Timeline
	if err := db.First(&timeline, req.TimelineID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Timeline not found"})
		return
	}

	err := db.Transaction(func(tx *gorm.DB) error {

		if err := tx.Model(&timeline).
			Update("name", req.Name).Error; err != nil {
			return err
		}

		var existingSteps []models.TimelineStep
		if err := tx.Where("timeline_id = ?", timeline.ID).
			Find(&existingSteps).Error; err != nil {
			return err
		}

		existingMap := make(map[uint]models.TimelineStep)
		for _, s := range existingSteps {
			existingMap[s.ID] = s
		}

		// track processed IDs
		usedIDs := make(map[uint]bool)

		for _, step := range req.Steps {

			// UPDATE
			if step.ID != nil {
				if existing, ok := existingMap[*step.ID]; ok {

					existing.Name = step.Name
					existing.StepOrder = step.StepOrder

					if err := tx.Save(&existing).Error; err != nil {
						return err
					}

					usedIDs[*step.ID] = true
				}
			} else {
				// CREATE
				newStep := models.TimelineStep{
					Name:       step.Name,
					StepOrder:  step.StepOrder,
					TimelineID: timeline.ID,
				}

				if err := tx.Create(&newStep).Error; err != nil {
					return err
				}
			}
		}

		for _, s := range existingSteps {
			if !usedIDs[s.ID] {
				if err := tx.Delete(&s).Error; err != nil {
					return err
				}
			}
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update timeline",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Timeline updated successfully",
	})
}
func CreateProject(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var req config.CreateProjectRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var timelineID uint

	if req.TimelineID != nil {
		timelineID = *req.TimelineID
	} else {
		var defaultTimeline models.Timeline
		if err := db.Where("is_default = ?", true).First(&defaultTimeline).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Default timeline not found"})
			return
		}
		timelineID = defaultTimeline.ID
	}

	project := models.Project{
		Name:        req.Name,
		Description: req.Description,
		Market:      req.Market,
		TimelineID:  timelineID,
	}

	if err := db.Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
		return
	}

	c.JSON(http.StatusOK, project)
}

func GetAllProjects(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	// pagination
	page := 1
	if p := c.Query("page"); p != "" {
		fmt.Sscanf(p, "%d", &page)
		if page < 1 {
			page = 1
		}
	}

	limit := 10
	offset := (page - 1) * limit

	// total count
	var total int64
	db.Model(&models.Project{}).Count(&total)

	// fetch projects
	var projects []models.Project
	if err := db.Preload("Timeline").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&projects).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
		return
	}

	// response
	c.JSON(http.StatusOK, gin.H{
		"projects": projects,
		"pagination": gin.H{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": int((total + int64(limit) - 1) / int64(limit)),
		},
	})
}

func GetProjectByID(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	id := c.Param("id")

	var project models.Project

	// preload timeline
	if err := db.Preload("Timeline").
		First(&project, id).Error; err != nil {

		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	type StepResponse struct {
		StepID    uint     `json:"step_id"`
		Name      string   `json:"name"`
		StepOrder int      `json:"step_order"`
		Status    string   `json:"status"`
		UpdatedBy uint     `json:"updated_by"`
		Images    []string `json:"images"`
	}

	var stepStatuses []models.ProjectStepStatus

	if err := db.
		Preload("Images").
		Where("project_id = ?", project.ID).
		Find(&stepStatuses).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch steps"})
		return
	}

	// get timeline steps for mapping
	var timelineSteps []models.TimelineStep
	db.Where("timeline_id = ?", project.TimelineID).
		Order("step_order ASC").
		Find(&timelineSteps)

		// map timelineStepID → step details
		// create status map
	statusMap := make(map[uint]models.ProjectStepStatus)
	for _, s := range stepStatuses {
		statusMap[s.TimelineStepID] = s
	}

	var responseSteps []StepResponse

	for _, step := range timelineSteps {

		status := "pending"
		updatedBy := uint(0)
		var imageURLs []string

		if s, ok := statusMap[step.ID]; ok {
			status = s.Status
			updatedBy = s.UpdatedByID

			for _, img := range s.Images {
				imageURLs = append(imageURLs, img.ImageURL)
			}
		}

		responseSteps = append(responseSteps, StepResponse{
			StepID:    step.ID,
			Name:      step.Name,
			StepOrder: step.StepOrder,
			Status:    status,
			UpdatedBy: updatedBy,
			Images:    imageURLs,
		})
	}
	// sort by step_order (important)
	sort.Slice(responseSteps, func(i, j int) bool {
		return responseSteps[i].StepOrder < responseSteps[j].StepOrder
	})

	c.JSON(http.StatusOK, gin.H{
		"project": project,
		"timeline": gin.H{
			"id":   project.Timeline.ID,
			"name": project.Timeline.Name,
		},
		"steps": responseSteps,
	})
}

func UpdateStepStatus(c *gin.Context, db *gorm.DB) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	currentUser, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var req config.UpdateStepsStatusData

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	validStatus := map[string]bool{
		"pending":     true,
		"in_progress": true,
		"completed":   true,
	}
	if !validStatus[req.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status"})
		return
	}

	// 🔥 CHECK ROLE PERMISSION
	var allowedRoles []models.TimelineStepRole

	if err := db.Where("timeline_step_id = ?", req.TimelineStepID).
		Find(&allowedRoles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Role check failed"})
		return
	}

	hasAccess := false
	// allow admin/superadmin always
	if currentUser.ApplicationRole == "Superadmin" || currentUser.ApplicationRole == "Admin" {
		hasAccess = true
	} else {
		for _, r := range allowedRoles {
			if r.RoleName == currentUser.ApplicationRole {
				hasAccess = true
				break
			}
		}
	}
	if !hasAccess {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "You are not allowed to update this step",
		})
		return
	}
	var stepStatus models.ProjectStepStatus

	err := db.Where("project_id = ? AND timeline_step_id = ?",
		req.ProjectID, req.TimelineStepID).
		First(&stepStatus).Error

	if err != nil {
		stepStatus = models.ProjectStepStatus{
			ProjectID:      req.ProjectID,
			TimelineStepID: req.TimelineStepID,
			Status:         "pending",
		}

		if err := db.Create(&stepStatus).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create step"})
			return
		}
	}
	cfgData, err := cfg.Env()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Configuration error"})
		return
	}

	ctx := c.Request.Context()

	err = db.Transaction(func(tx *gorm.DB) error {

		// update status
		stepStatus.Status = req.Status
		stepStatus.UpdatedByID = currentUser.ID

		if err := tx.Save(&stepStatus).Error; err != nil {
			return err
		}

		// handle images
		for _, base64Img := range req.Images {

			decodedImage, err := base64.StdEncoding.DecodeString(base64Img)
			if err != nil {
				return fmt.Errorf("invalid base64 image")
			}

			profileType := "project"
			userType := "step"
			uuidString := s3helper.GenerateUniqueID().String()
			userIDString := fmt.Sprintf("%d", currentUser.ID)
			imageName := "step_image"

			if err := s3helper.UploadToS3(
				ctx,
				profileType,
				userType,
				cfgData.S3.BucketName,
				uuidString,
				userIDString,
				imageName,
				decodedImage,
			); err != nil {
				return err
			}

			extension, _ := s3helper.GetFileExtension(decodedImage)

			imageURL := "https://" + cfgData.S3.BucketName + ".s3." + cfgData.S3.Region + ".amazonaws.com/" +
				profileType + "/" + userType + "/" + uuidString + "/" + userIDString + "/" + imageName + "." + extension

			// save image
			if err := tx.Create(&models.ProjectStepImage{
				ProjectStepStatusID: stepStatus.ID,
				ImageURL:            imageURL,
			}).Error; err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Step updated successfully",
	})
}

func AssignRolesToStep(c *gin.Context, db *gorm.DB) {

	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var req struct {
		TimelineStepID uint     `json:"timeline_step_id"`
		Roles          []string `json:"roles"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// delete old roles
	db.Where("timeline_step_id = ?", req.TimelineStepID).
		Delete(&models.TimelineStepRole{})

	// add new roles
	for _, role := range req.Roles {
		db.Create(&models.TimelineStepRole{
			TimelineStepID: req.TimelineStepID,
			RoleName:       role,
		})
	}

	c.JSON(http.StatusOK, gin.H{"message": "Roles assigned successfully"})
}

func AssignComplaintRoles(c *gin.Context, db *gorm.DB) {

	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var req struct {
		ProjectID uint     `json:"project_id"`
		Roles     []string `json:"roles"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// delete old roles
	db.Where("project_id = ?", req.ProjectID).
		Delete(&models.ComplaintRoleAccess{})

	// insert new roles
	for _, role := range req.Roles {
		db.Create(&models.ComplaintRoleAccess{
			ProjectID: req.ProjectID,
			RoleName:  role,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Complaint roles assigned",
	})
}

func CreateComplaint(c *gin.Context, db *gorm.DB) {

	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	currentUser, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var req struct {
		ProjectID uint     `json:"project_id" binding:"required"`
		Text      string   `json:"text"`
		Images    []string `json:"images"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if len(req.Images) > 5 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Maximum 5 images allowed",
		})
		return
	}

	var allowed []models.ComplaintRoleAccess
	db.Where("project_id = ?", req.ProjectID).Find(&allowed)

	hasAccess := false
	for _, r := range allowed {
		if r.RoleName == currentUser.ApplicationRole {
			hasAccess = true
			break
		}
	}

	// superadmin override
	if currentUser.ApplicationRole == "Superadmin" {
		hasAccess = true
	}

	if !hasAccess {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "You are not allowed to complain on this project",
		})
		return
	}

	// create complaint
	complaint := models.ProjectComplaint{
		ProjectID: req.ProjectID,
		UserID:    currentUser.ID,
		Text:      req.Text,
	}

	if err := db.Create(&complaint).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create complaint"})
		return
	}

	cfgData, _ := cfg.Env()
	ctx := c.Request.Context()

	// upload images
	for _, base64Img := range req.Images {

		decodedImage, err := base64.StdEncoding.DecodeString(base64Img)
		if err != nil {
			continue
		}

		uuid := s3helper.GenerateUniqueID().String()

		s3helper.UploadToS3(
			ctx,
			"project",
			"complaint",
			cfgData.S3.BucketName,
			uuid,
			fmt.Sprintf("%d", currentUser.ID),
			"complaint",
			decodedImage,
		)

		ext, _ := s3helper.GetFileExtension(decodedImage)

		imageURL := "https://" + cfgData.S3.BucketName + ".s3." + cfgData.S3.Region + ".amazonaws.com/" +
			"project/complaint/" + uuid + "/" + fmt.Sprintf("%d", currentUser.ID) + "/complaint." + ext

		db.Create(&models.ProjectComplaintImage{
			ComplaintID: complaint.ID,
			ImageURL:    imageURL,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Complaint created successfully",
	})
}
