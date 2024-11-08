import RepoRow from '../repo-row';
import RepoLoader from '../loaders/repo-loader';
import { Repository } from '../../lib/type';
import { useRepoList } from './use-repo-list';

interface RepoListProps {
  repos: Repository[];
  orgId: string;
  isLoading: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  hasNextPage?: boolean;
  isFetching: boolean;
}

export function RepoList({ repos, isLoading, orgId, containerRef, hasNextPage, isFetching }: RepoListProps) {
  const { handleCheckboxChange } = useRepoList(orgId);

  return (
    <div ref={containerRef} className="h-[80vh] overflow-y-auto">
      {isLoading && repos.length === 0 && (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <RepoLoader key={i} />
          ))}
        </div>
      )}
      {repos.length > 0 && (
        <div className="space-y-4">
          {repos.map((repo) => (
            <RepoRow
              key={repo.id}
              repo={repo}
              handleCheckboxChange={handleCheckboxChange}
              isFetching={isFetching}
            />
          ))}
          <div>
            {hasNextPage ? (isLoading && <RepoLoader />) : <p className='flex items-center justify-center w-full'>No more repositories to load.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
