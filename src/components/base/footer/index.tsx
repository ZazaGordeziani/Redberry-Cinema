import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="flex flex-col gap-5 px-8.5 py-6.75">
            <div className="bg-background-tertiary h-px w-full" />
            <div className="flex items-center justify-between">
                <Link to="/" className="cursor-pointer">
                    <p className="text-label-m flex gap-1.5 font-extrabold text-white">
                        KINO <span className="text-helper-red">XII</span>
                    </p>
                </Link>
                <p className="text-body-s font-regular text-light-grey-muted">
                    © 2026 Kino XII. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
