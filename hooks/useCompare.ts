import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useAtom } from "jotai";
import { compareAtom, compareCarsAtom } from "@/jotai/compareAtom";
import { CarResponse } from "@/types/edit-car";

export const useCompare = () => {
  const [ids, setIds] = useAtom(compareAtom);
  const [cars, setCars] = useAtom(compareCarsAtom);

  const fetchCars = async () => {
    if (ids.length === 0) return [];
    const carPromises = ids.slice(-4).map((id) =>
      axios
        .get<CarResponse>(`/api/car/${id}`, {
          headers: {
            "Cache-Control": "no-cache",
            cache: "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
        .then((res) => res.data),
    );
    const carsData = await Promise.all(carPromises);
    return carsData;
  };

  const { isLoading, isError, refetch } = useQuery<CarResponse[], AxiosError>(
    ["cars", ids],
    fetchCars,
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      refetchInterval: 5 * 60 * 1000, // 5 minutes
      onSuccess: (response) => setCars(response),
    },
  );

  return {
    cars,
    ids,
    setIds,
    isLoading,
    isError,
    refetch,
  };
};
