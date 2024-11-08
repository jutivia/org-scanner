import { Repository } from "@/src/lib/type";
import React from "react";

export const useRepoRow = (handleCheckboxChange: (id: string, checkedStatus: boolean) => void, repo: Repository) => {
    const [expandedRepo, setExpandedRepo] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState(false)

    const handleCheck =(checked: boolean) => {
        setSelected(checked); 
        handleCheckboxChange(repo.id, checked)
    }

    React.useEffect(()=>{
        setSelected(repo.selected)
    },[repo.selected])

    return {
        expandedRepo,
        selected,
        setExpandedRepo,
        setSelected,
        handleCheck

    }
}