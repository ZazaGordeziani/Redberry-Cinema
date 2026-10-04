import Footer from '@/components/base/footer';
import Header from '@/components/base/header/header';
import { PageContainer } from '@/components/base/page-container/page-container';
import { Outlet } from 'react-router';

const DefaultLayout = () => {
    console.log('hello');
    return (
        <div className="min-h-screen">
            <div className="mx-auto flex w-full max-w-[1920px] flex-col items-center justify-center">
                <Header />
                <PageContainer>
                    <Outlet />
                </PageContainer>
                <Footer />
            </div>
        </div>
    );
};

export default DefaultLayout;
