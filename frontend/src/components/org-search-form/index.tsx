import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useOrgSearchForm } from './use-org-search-form';

interface OrgSearchFormProps {
  onSubmit: (org: string) => void;
  clearInput : () => void;
}

export function OrgSearchForm({ onSubmit, clearInput }: OrgSearchFormProps) {
  const {inputValue, handleInputChange, handleSubmit} = useOrgSearchForm(onSubmit, clearInput)

  return (
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
  );
}
