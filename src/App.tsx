import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css';
import DefaultLayout from '@/layout/default';
import MainPage from '@/pages/main-page';
import AuthGuard from '@/guards/auth-guard/auth-guard';
import ProfileGuard from '@/guards/profile-guard/profile-guard';
import ProfilePage from '@/pages/profile-page';
import MoviePage from '@/pages/movie-page';
import SessionsPage from '@/pages/sessions-page';
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route path="/" element={<MainPage />} />{' '}
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
            </Routes>
        </BrowserRouter>
    );
}

export default App;
