import { useMutation } from "@tanstack/react-query";
import { SuccessResponse } from "../lib/type";
import api from "../lib/http";

interface SelectRepoPayload {
  repoId: string;
  orgId: string;
  selected: boolean;
}

interface SelectRepoResponse {
  organizationId: string;
  repositoryId: string;
  selected: boolean;
}

const selectRepo = (values: SelectRepoPayload) => {
  const url = `organization/${values.orgId}`;

  return api.patch<SuccessResponse<SelectRepoResponse>, SelectRepoPayload>(url, {
    repositoryId: values.repoId,
    selection: values.selected,
  });
};

export const useSelectRepo = () => {
  return useMutation({
    mutationFn: selectRepo,
    onSuccess: () => {},
  });
};
