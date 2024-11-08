import * as React from 'react';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';



const RepoLoader = () => {
  return  <Card className='w-full'>
  <CardContent className="p-4">
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2" />
  </CardContent>
</Card>;
};

export default RepoLoader;
