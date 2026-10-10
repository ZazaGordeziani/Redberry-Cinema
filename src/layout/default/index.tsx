import LogInView from '@/components/authorization/modals/login/view';
import RegisterView from '@/components/authorization/modals/register/view';
import Footer from '@/components/base/footer';
import Header from '@/components/base/header/header';
import { PageContainer } from '@/components/base/page-container/page-container';
import { lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import { BounceLoader } from 'react-spinners';

const BookingModal = lazy(() => import('@/components/booking/booking-modal'));

const DefaultLayout = () => {
    const location = useLocation();
    const bookingOpen = new URLSearchParams(location.search).has('booking');
    return (
        <div className="min-h-screen">
            <div className="relative mx-auto flex w-full max-w-[1920px] flex-col justify-center">
                <Header />
                <LogInView />
                <RegisterView />
                {bookingOpen && (
                    <Suspense
                        fallback={
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                <BounceLoader
                                    color="#EC3013"
                                    size={84}
                                    speedMultiplier={0.6}
                                />
                            </div>
                        }
                    >
                        <BookingModal />
                    </Suspense>
                )}
                <PageContainer>
                    <Suspense
                        fallback={
                            <div className="flex min-h-dvh w-full items-center justify-center">
                                <BounceLoader
                                    color="#EC3013"
                                    size={84}
                                    speedMultiplier={0.6}
                                />
                            </div>
                        }
                    >
                        <Outlet />
                    </Suspense>
                </PageContainer>
                <Footer />
            </div>
        </div>
    );
};

export default DefaultLayout;
