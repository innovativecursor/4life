import endpoints from "../lib/endpoints";
import { fetchDataGet, fetchDataPut } from "../lib/fetchdata";

export const getAllAdmins = async () => {
  return await fetchDataGet(endpoints.alladmin.list);
};


export const approveUser = async (data) => {
  return await fetchDataPut(endpoints.approveUser.list, data)
}