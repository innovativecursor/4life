import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRole, getAllRoles } from "../../services/role.service";

export const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
    },
  });
};
