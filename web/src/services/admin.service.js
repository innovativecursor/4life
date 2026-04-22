

import endpoints from "../lib/endpoints";
import { fetchDataGet } from "../lib/fetchdata";

export const getAllAdmins = async () => {
    return await fetchDataGet(endpoints.alladmin.list);
};