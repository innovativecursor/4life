import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveUser, getAllAdmins } from "../../services/admin.service";

export const useGetAdmins = () => {
    return useQuery({
        queryKey: ["admins"],
        queryFn: getAllAdmins,
    });
};

export const useApproveUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: approveUser,
        onSuccess: () => {
            queryClient.invalidateQueries(["admins"]);
        },
    });
};
