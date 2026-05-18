import { useQuery, useMutation } from "@tanstack/react-query";
import { assignComplaintRolesService, getComplaintRolesService } from "../../services/assigncomplaintrole";
export const useAssignComplaintRoles = () => {
    return useMutation({
        mutationFn: assignComplaintRolesService
    })
}


// GET COMPLAINT ROLES
export const useGetComplaintRoles = (
  projectId,
  enabled = true
) => {
  return useQuery({
    queryKey: ["complaint-roles", projectId],

    queryFn: () =>
      getComplaintRolesService(projectId),

    enabled: !!projectId && enabled,
  });
};