'use client'

import { useState, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useGetRepos } from '../api/get-repos'
import { Repository } from '../lib/type'
import RepoLoader from './loaders/repo-loader'
import RepoRow from './repo-row'
import { useSelectRepo } from '../api/select-repo'
import axios, { AxiosError } from 'axios'

export default function OrgComponent() {
  const [org, setOrg] = useState('')
  const [inputValue, setInputValue] = useState('');
  const [allRepos, setAllRepos] = useState<Repository[] | []>([])
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const { ref } = useInView({ threshold: 0 })
  const { data: repos, isLoading, error} = useGetRepos(org, { pageSize: 10, cursor })
  const { mutateAsync: selectRepo } = useSelectRepo()
  const containerRef = useRef<HTMLDivElement>(null)

  const hasMoreRepos = repos?.data.hasNextPage ?? false


  useEffect(() => {
    if (repos?.data.list) {
      setAllRepos((prevRepos: Repository[] | []) => {
        // ensuring only new repos are shown
        if(prevRepos.find(x=> x.id === repos.data.list[0].id)) {
          return  repos.data.list
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOrg(inputValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setAllRepos([]);
      setCursor(undefined)
      setOrg("")
    }
    setInputValue(e.target.value);
  };

  const handleCheckboxChange = async (repoId: string, checked: any) => {
    await selectRepo({ orgId: repos?.data.orgId ?? "", repoId, selected: checked as boolean })
  }

  const handleError = (error: Error | AxiosError) => {
    if (axios.isAxiosError(error)) {
      return <div>{error.response?.data.message}</div>;
    } else {
      return <div>{error.message}</div>;
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Enter GitHub organization name e.g microsoft"
            className="flex-grow"
            onChange={handleInputChange}
            value={inputValue}
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      <div ref={containerRef} className="h-[80vh] overflow-y-auto">
        {isLoading && allRepos.length === 0 && (
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <RepoLoader key={i} />
            ))}
          </div>
        )}

        {error && <p className="text-red-500 text-center">{handleError(error)}</p>}

        {allRepos.length > 0 && (
          <div className="space-y-4">
            {allRepos.map((repo) => (
              <RepoRow repo={repo} handleCheckboxChange={handleCheckboxChange} />
            ))}
            {isLoading  && (
              <div ref={ref}>
                {(cursor) ? <RepoLoader /> : <p className='flex items-center justify-center w-full'>No more repositories to load.</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}