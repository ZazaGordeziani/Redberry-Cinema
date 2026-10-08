import ComingSoon from '@/pages/main-page/components/coming-soon';
import Hero from '@/pages/main-page/components/hero';
import NowPlaying from '@/pages/main-page/components/now-playing';
import RecentlyViewed from '@/pages/main-page/components/recently-viewed';

const MainPage = () => {
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
