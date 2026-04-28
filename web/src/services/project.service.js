import endpoints from "../lib/endpoints";
import { fetchDataGet, fetchDataPost } from "../lib/fetchdata";

export const createProject = async (data) => {
  return await fetchDataPost(endpoints.project.add, data);
};

export const getAllProjects = async (params) => {
  return await fetchDataGet(endpoints.project.list, params);
};

export const getProjectById = async (id) => {
  const url = endpoints.project.projectById.replace(":id", id);
  return await fetchDataGet(url);
};
