import { useGetRepos } from "@/src/api/get-repos"
import { Repository } from "@/src/lib/type"
import axios, { AxiosError } from "axios"
import { useEffect, useRef, useState } from "react"

export const useOrgs = () => {
    const [org, setOrg] = useState('')
    const [allRepos, setAllRepos] = useState<Repository[] | []>([])
    const [cursor, setCursor] = useState<string | undefined>(undefined)
    const { data: repos, isLoading, error } = useGetRepos(org, { pageSize: 10, cursor })

    const containerRef = useRef<HTMLDivElement>(null)
    const hasMoreRepos = repos?.data.hasNextPage ?? false


    useEffect(() => {
        if (repos?.data.list) {
            setAllRepos((prevRepos: Repository[] | []) => {
                // ensuring only new repos are shown
                if (prevRepos.find(x => x.id === repos.data.list[0].id)) {
                    return repos.data.list
                } else return [...prevRepos, ...repos.data.list]
            })
        }
    }, [repos])


    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container
            if (scrollHeight - scrollTop <= clientHeight + 2 && hasMoreRepos && !isLoading) {
                setCursor(repos?.data.endCursor)
            }
        }

        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
    }, [hasMoreRepos, isLoading, repos?.data.endCursor])

    const handleSubmit = (inputValue: string) => {
        clearInput()
        setOrg(inputValue)
    }

    const clearInput = () => {
        setAllRepos([]);
        setCursor(undefined)
        setOrg("")
    };


    const handleError = (error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
            return error.response?.data.message
        } else {
            return error.message
        }
    }

    return {
        allRepos,
        repos,
        isLoading,
        containerRef,
        error,
        clearInput,
        handleError,
        handleSubmit,
    }
}