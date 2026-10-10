import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css';
import DefaultLayout from '@/layout/default';
import AuthGuard from '@/guards/auth-guard/auth-guard';
import ProfileGuard from '@/guards/profile-guard/profile-guard';
import NotFoundPage from '@/pages/not-found-page';

const MainPage = lazy(() => import('@/pages/main-page'));
const MoviePage = lazy(() => import('@/pages/movie-page'));
const SessionsPage = lazy(() => import('@/pages/sessions-page'));
const ProfilePage = lazy(() => import('@/pages/profile-page'));

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/movies/:slug" element={<MoviePage />} />
                    <Route path="/sessions" element={<SessionsPage />} />
                    <Route element={<AuthGuard />}>
                        <Route path="/login" element={<MainPage />} />
                        <Route path="/register" element={<MainPage />} />
                    </Route>
                    <Route element={<ProfileGuard />}>
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
