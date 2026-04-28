import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignStepRoles,
  createProject,
  getAllProjects,
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
