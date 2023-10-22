import useSWR from "swr";
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
  const startDateTime = startDate ? DateTime.fromObject(startDate, { zone: "utc" }) : undefined;
  const start = startDateTime ? startDateTime.plus({ days: day - 1 }).toMillis() : 0;
  const end = startDateTime ? startDateTime.plus({ days: day }).toMillis() : 0;

  let query = `/api/class/classes?startDate=${start}&endDate=${end}`;

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
    refetch: mutate,
  };
};
