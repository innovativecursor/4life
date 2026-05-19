import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignStepRoles,
  createComplaint,
  createProject,
  getAllComplaints,
  getAllProjects,
  getAllStepRoles,
  getProjectById,
  updateStepStatus,
} from "../../services/project.service";

export const useAddProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });
};

export const useGetProjects = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["projects", page],
    queryFn: () =>
      getAllProjects({
        page,
        limit,
      }),
  });
};

export const useGetProjectById = (id, enabled) => {
  return useQuery({
    queryKey: ["project-details", id],
    queryFn: () => getProjectById(id),
    enabled: !!id && enabled,
  });
};

export const useUpdateStepStatus = () => {
  return useMutation({
    mutationFn: updateStepStatus,
  });
};

export const useAssignStepRoles = () => {
  return useMutation({
    mutationFn: assignStepRoles,
  });
};

// GET STEP ROLES
export const useGetStepRoles = (
  projectId,
  enabled = true
) => {
  return useQuery({
    queryKey: [
      "step-roles",
      projectId,
    ],

    queryFn: () =>
      getAllStepRoles(projectId),

    enabled: !!projectId && enabled,
  });
};

// CREATE COMPLAINT
export const useCreateComplaint = () => {
  return useMutation({
    mutationFn: createComplaint,
  });
};

// GET COMPLAINTS
export const useGetComplaints = (projectId, enabled = true) => {
  return useQuery({
    queryKey: ["complaints", projectId],

    queryFn: () => getAllComplaints(projectId),

    enabled: !!projectId && enabled,
  });
};
