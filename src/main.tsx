import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@fontsource/archivo/400.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/800.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <StrictMode>
            <App />
        </StrictMode>
    </QueryClientProvider>,
);
