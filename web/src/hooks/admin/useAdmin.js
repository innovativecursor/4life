import { useQuery } from "@tanstack/react-query";
import { getAllAdmins } from "../../services/admin.service";

export const useGetAdmins = () => {
    return useQuery({
        queryKey: ["admins"],
        queryFn: getAllAdmins,
    });
};