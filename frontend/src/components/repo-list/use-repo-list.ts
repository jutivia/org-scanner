import { useSelectRepo } from "@/src/api/select-repo"

export const useRepoList = (orgId: string) => {
    const { mutateAsync: selectRepo } = useSelectRepo()

    const handleCheckboxChange = async (repoId: string, checked: any) => {
      await selectRepo({ orgId, repoId, selected: checked as boolean })
    }

    return {
        handleCheckboxChange 
    }
}