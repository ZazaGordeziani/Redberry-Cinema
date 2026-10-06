type PageContainerProps = {
    children: React.ReactNode;
};

export const PageContainer = ({ children }: PageContainerProps) => {
    return <main className="flex grow overflow-hidden">{children}</main>;
};
