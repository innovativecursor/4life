import { useQuery } from "@tanstack/react-query";
import { getAllRoles } from "../../services/role.service";

export const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  });
};
