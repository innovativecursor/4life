import endpoints from "../lib/endpoints";
import { fetchDataPost } from "../lib/fetchdata";

export const assignComplaintRolesService = async (payload) => {
  return await fetchDataPost(endpoints.assigncompalinrole.add, payload);
};
