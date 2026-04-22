import { useMutation } from "@tanstack/react-query";
import { createProject } from "../../services/project.service";

export const useAddProject = () => {
    return useMutation({
        mutationFn: createProject,
    });
};