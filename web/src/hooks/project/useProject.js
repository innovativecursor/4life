import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, getAllProjects } from "../../services/project.service";

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