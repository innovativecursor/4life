import endpoints from "../lib/endpoints"
import { fetchDataPost } from "../lib/fetchdata"

export const createProject = async (data) => {
    return await fetchDataPost(endpoints.project.add, data)
}