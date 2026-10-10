import { Link } from 'react-router';

const NotFoundPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <p className="text-h1 text-helper-red font-extrabold uppercase">
                Error 404
            </p>
            <p className="text-h1 text-helper-red font-extrabold uppercase">
                Such page does not exist
            </p>
            <Link to="/" className="text-label-m font-semibold text-white">
                Go to main page
            </Link>
        </div>
    );
};

export default NotFoundPage;
