'use client'

import { OrgSearchForm } from '../org-search-form'
import { RepoList } from '../repo-list'
import { useOrgs } from './useOrgs'

export default function OrgComponent() {
 
  const {
    allRepos,
    repos,
    isLoading,
    containerRef,
    error,
    clearInput,
    handleError,
    handleSubmit, 
  } = useOrgs()


  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <OrgSearchForm onSubmit={handleSubmit} clearInput={clearInput} />
      {error 
      ? <p className="text-red-500 text-center">{handleError(error)}</p> 
      : <RepoList containerRef={containerRef}
          repos={allRepos}
          orgId={repos?.data.orgId || ""}
          isLoading={isLoading}
          hasNextPage={repos?.data.hasNextPage ?? true}
        />}
    </div>
  )
}