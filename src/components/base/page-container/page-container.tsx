type PageContainerProps = {
    children: React.ReactNode;
};

export const PageContainer = ({ children }: PageContainerProps) => {
    return <main className="flex w-full grow overflow-hidden">{children}</main>;
};
