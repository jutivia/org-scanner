
import { useQuery } from "@tanstack/react-query";
import { constructQueryString } from "../lib/utils";
import { Iquery, OrgPaginationResponse, Repository, SuccessResponse } from "../lib/type";
import api from "../lib/http";

const getRepos = async (name: string, query: Iquery) => {

  const url = `organization/${name}?${constructQueryString(query)}`;
  const { data } = await api.get<SuccessResponse<OrgPaginationResponse<Repository>>>(url);
  return data;
};

export const useGetRepos = (
  name: string,
  query: Iquery,
) => {
  return useQuery({
    queryKey: ["repositories", name, query],
    queryFn: () => getRepos(name, query),
    enabled: !!name
  });
};
