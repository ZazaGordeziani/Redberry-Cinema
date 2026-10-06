import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css';
import DefaultLayout from '@/layout/default';
import MainPage from '@/pages/main-page';
import AuthGuard from '@/guards/auth-guard/auth-guard';
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route path="/" element={<MainPage />} />
                    <Route element={<AuthGuard />}>
                        <Route path="/login" element={<MainPage />} />
                        <Route path="/register" element={<MainPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
