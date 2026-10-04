type PageContainerProps = {
    children: React.ReactNode;
};

export const PageContainer = ({ children }: PageContainerProps) => {
    return (
        <main className="flex grow justify-center overflow-hidden">
            {children}
        </main>
    );
};
