import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTimeline, getAllTimelines } from "../../services/timeline.service";


// 📥 GET
export const useGetTimelines = () => {
  return useQuery({
    queryKey: ["timelines"],
    queryFn: getAllTimelines,
  });
};

// ➕ POST
export const useAddTimeline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTimeline,

    onSuccess: () => {
      queryClient.invalidateQueries(["timelines"]);
    },
  });
};