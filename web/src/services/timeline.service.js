import endpoints from "../lib/endpoints";
import { fetchDataGet, fetchDataPost } from "../lib/fetchdata";

export const addTimeline = async (data) => {
  return await fetchDataPost(endpoints.timeline.add, data);
};

export const getAllTimelines = async () => {
  return await fetchDataGet(endpoints.timeline.list);
};
