import endpoints from "../lib/endpoints";
import { fetchDataGet, fetchDataPost } from "../lib/fetchdata";

export const assignComplaintRolesService = async (payload) => {
  return await fetchDataPost(endpoints.assigncompalinrole.add, payload);
};


// GET COMPLAINT ROLES
export const getComplaintRolesService = async (
  projectId
) => {
  return await fetchDataGet(
    endpoints.getComplaintRoles(projectId)
  );
};

