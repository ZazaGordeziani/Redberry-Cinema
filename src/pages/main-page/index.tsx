import ComingSoon from '@/pages/main-page/components/coming-soon';
import Hero from '@/pages/main-page/components/hero';
import NowPlaying from '@/pages/main-page/components/now-playing';
import RecentlyViewed from '@/pages/main-page/components/recently-viewed';
import {
    useComingSoonMovies,
    useFeaturedMovies,
    useNowPlayingMovies,
} from '@/react-query/query';
import { BounceLoader } from 'react-spinners';

const MainPage = () => {
    const featured = useFeaturedMovies();
    const nowPlaying = useNowPlayingMovies();
    const comingSoon = useComingSoonMovies();
    const isLoading =
        featured.isLoading || nowPlaying.isLoading || comingSoon.isLoading;

    if (isLoading) {
        return (
            <div className="flex min-h-[70vh] w-full items-center justify-center">
                <BounceLoader color="#EC3013" size={84} speedMultiplier={0.6} />
            </div>
        );
    }

    return (
        <div className="w-full">
            <Hero />
            <RecentlyViewed />
            <NowPlaying />
            <div className="bg-background-tertiary h-px w-full" />
            <ComingSoon />
        </div>
    );
};

export default MainPage;
