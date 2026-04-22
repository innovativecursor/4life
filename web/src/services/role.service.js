import endpoints from "../lib/endpoints";
import { fetchDataGet } from "../lib/fetchdata";

export const getAllRoles = async () => {
  return await fetchDataGet(endpoints.allrole.list);
};
