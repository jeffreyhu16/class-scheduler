import useSWR, { Fetcher } from "swr";
import axios from "axios";
import { DateTime, ToObjectOutput } from "luxon";

export interface UseClassesParams {
  startDate: ToObjectOutput | undefined;
  day: number;
  coachId?: string;
  locationId?: string;
  courtId?: number;
}

export const useClasses = ({ startDate, day, coachId, locationId, courtId }: UseClassesParams) => {
  const start = startDate ? DateTime.fromObject(startDate).toMillis() : 0;

  let query = `/api/class/classes?startDate=${start}&day=${day}`;

  if (coachId) {
    query = query.concat(`&coachId=${coachId}`);
  }
  if (locationId) {
    query = query.concat(`&locationId=${locationId}`);
  }
  if (courtId) {
    query = query.concat(`&courtId=${courtId}`);
  }

  const { data, isLoading, error, mutate } = useSWR(
    startDate ? [query, startDate, day, locationId, coachId, courtId] : null,
    ([url]) => axios.get(url).then((res) => res.data)
  );

  return {
    classData: data,
    isLoading,
    error,
    mutate,
  };
};
