import endpoints from "../lib/endpoints";
import { fetchDataGet, fetchDataPost } from "../lib/fetchdata";

export const getAllRoles = async () => {
  return await fetchDataGet(endpoints.allrole.list);
};

export const createRole = async (data) => {
  return await fetchDataPost(endpoints.allrole.add, data);
};
