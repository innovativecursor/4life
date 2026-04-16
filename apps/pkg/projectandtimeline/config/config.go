package config

type CreateTimelineRequest struct {
	Name  string   `json:"name" binding:"required"`
	Steps []string `json:"steps" binding:"required"`
}

type CreateProjectRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	TimelineID  *uint  `json:"timeline_id"`
}

type UpdateStepsStatusData struct {
	ProjectID      uint     `json:"project_id" binding:"required"`
	TimelineStepID uint     `json:"timeline_step_id" binding:"required"`
	Status         string   `json:"status" binding:"required"`
	Images         []string `json:"images"`
}
