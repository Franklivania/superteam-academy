"use client";

import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query";
import * as api from "./config";

type QueryOptions<T> = Omit<UseQueryOptions<T, Error, T, QueryKey>, "queryFn"> & {
  queryKey: QueryKey;
  path: string;
};

export function useAPIQuery<T>({ queryKey, path, ...opts }: QueryOptions<T>) {
  return useQuery({
    ...opts,
    queryKey,
    queryFn: () => api.getData<T>(path),
  });
}

export function useAPIMutation<TData = unknown, TVariables = unknown>(
  method: "post" | "patch" | "put" | "delete",
  path_or_builder: string | ((variables: TVariables) => string),
  options?: UseMutationOptions<TData, Error, TVariables>,
) {
  return useMutation({
    ...options,
    mutationFn: async (variables: TVariables) => {
      const path = typeof path_or_builder === "string" ? path_or_builder : path_or_builder(variables);
      if (method === "post") return api.postData<TData>(path, variables as object);
      if (method === "patch") return api.patchData<TData>(path, variables as object);
      if (method === "put") return api.updateData<TData>(path, variables as object);
      return api.deleteData<TData>(path);
    },
  });
}

export { api };
