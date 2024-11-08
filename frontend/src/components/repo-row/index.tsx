import { Card, CardContent } from '../ui/card';
import { Repository } from '../../lib/type';
import { Button } from '../ui/button';
import { ChevronDownIcon, ChevronRightIcon, ExternalLinkIcon } from '@radix-ui/react-icons'
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { useRepoRow } from './use-repo-row';

interface IRepoRowProps {
    handleCheckboxChange: (id: string, checkedStatus: any) => void
    repo: Repository;
    isFetching: boolean;
}

const RepoRow = ({ repo, handleCheckboxChange }: IRepoRowProps) => {
    const {
        expandedRepo,
        selected,
        setExpandedRepo,
        handleCheck
    } = useRepoRow(handleCheckboxChange, repo)

    return <Card>
        <CardContent className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                        id={`checkbox-${repo.name}`}
                        checked={selected}
                        onCheckedChange={handleCheck}
                    />
                    <h2 className="text-lg font-semibold">{repo.name}</h2>
                </div>
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    <ExternalLinkIcon className="inline mr-1" />
                    View Repo
                </a>
            </div>
            <div className="text-sm text-gray-500 mt-1 flex gap-2 items-center flex-wrap"><p>Language:</p> {repo.language.map(x => <Badge variant={'secondary'} key={x}> {x} </Badge>)}</div>
            <Button
                variant="ghost"
                className="mt-2 p-0 px-2"
                onClick={() => setExpandedRepo(expandedRepo === repo.name ? null : repo.name)}
            >
                {expandedRepo === repo.name ? (
                    <ChevronDownIcon className="mr-1" />
                ) : (
                    <ChevronRightIcon className="mr-1" />
                )}
                {expandedRepo === repo.name ? 'Hide' : 'Show'} First {repo.branchCount > 10 ? `10 of ${repo.branchCount}` : repo.branchCount} Branches
            </Button>
            {expandedRepo === repo.name && (
                <ul className="mt-2 ml-6 space-y-1 list-disc">
                    {repo.branches.map((branch: string) => (
                        <li key={branch} className="text-sm">{branch}</li>
                    ))}
                </ul>
            )}
        </CardContent>
    </Card>;
};

export default RepoRow;
