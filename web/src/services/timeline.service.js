// import endpoints from "../lib/endpoints";
// import { fetchDataGet, fetchDataPost } from "../lib/fetchdata";

// export const addTimeline = async (data) => {
//   return await fetchDataPost(endpoints.timeline.add, data);
// };

// export const getAllTimelines = async () => {
//   return await fetchDataGet(endpoints.timeline.list);
// };


// export const updateTimeline = async (data) => {
//   return await fetchDataPost(endpoints.timeline.update, data);
// };




import endpoints from "../lib/endpoints";
import { fetchDataGet, fetchDataPost, fetchDataPut } from "../lib/fetchdata";

export const addTimeline = async (data) => {
  return await fetchDataPost(endpoints.timeline.add, data);
};

export const getAllTimelines = async () => {
  return await fetchDataGet(endpoints.timeline.list);
};

// ✅ UPDATE
export const updateTimeline = async (data) => {
  return await fetchDataPut(endpoints.timeline.update, data);
};