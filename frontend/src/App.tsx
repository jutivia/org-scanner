import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OrgComponent from './components/orgs';

function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
    <OrgComponent />
  </QueryClientProvider>
  );
}

export default App;
