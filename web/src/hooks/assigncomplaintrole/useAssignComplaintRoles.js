import { useMutation } from "@tanstack/react-query";
import { assignComplaintRolesService } from "../../services/assigncomplaintrole";
export const useAssignComplaintRoles = () => {
    return useMutation({
        mutationFn: assignComplaintRolesService
    })
}