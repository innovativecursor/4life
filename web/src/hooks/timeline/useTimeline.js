import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTimeline,
  getAllTimelines,
  updateTimeline,
} from "../../services/timeline.service";

// GET
export const useGetTimelines = () => {
  return useQuery({
    queryKey: ["timelines"],
    queryFn: getAllTimelines,
  });
};

//  ADD
export const useAddTimeline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTimeline,
    onSuccess: () => {
      queryClient.invalidateQueries(["timelines"]);
    },
  });
};

//  UPDATE
export const useUpdateTimeline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTimeline,
    onSuccess: () => {
      queryClient.invalidateQueries(["timelines"]);
    },
  });
};
