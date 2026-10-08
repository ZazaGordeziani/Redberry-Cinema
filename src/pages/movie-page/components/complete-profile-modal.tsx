import CloseSign from '@/assets/close-sign';

type CompleteProfileModalProps = {
    onClose: () => void;
};

const CompleteProfileModal = ({ onClose }: CompleteProfileModalProps) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2424244D] backdrop-blur-xs"
            onClick={onClose}
        >
            <section
                className="bg-background border-background-tertiary relative flex w-150 items-center justify-center rounded-[28px] border px-10 py-16"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6"
                >
                    <CloseSign className="h-6 w-6 cursor-pointer" />
                </button>
                <p className="text-display text-helper-red text-center font-extrabold">
                    complete profile to buy ticket
                </p>
            </section>
        </div>
    );
};

export default CompleteProfileModal;
