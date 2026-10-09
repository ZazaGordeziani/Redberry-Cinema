import {
    useEffect,
    useRef,
    useState,
    type MouseEvent,
    type ReactNode,
} from 'react';

type HorizontalScrollProps = {
    className?: string;
    barClassName?: string;
    showFade?: boolean;
    children: ReactNode;
};

const HorizontalScroll = ({
    className,
    barClassName,
    showFade = true,
    children,
}: HorizontalScrollProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [thumb, setThumb] = useState({ width: 0, left: 0 });
    const [canScroll, setCanScroll] = useState(false);

    const updateThumb = () => {
        const el = scrollRef.current;
        if (!el) return;

        const { scrollLeft, scrollWidth, clientWidth } = el;
        const overflows = scrollWidth > clientWidth;

        setCanScroll(overflows);

        const track = trackRef.current;
        if (!overflows || !track) return;

        const trackWidth = track.clientWidth;
        const width = Math.max((clientWidth / scrollWidth) * trackWidth, 24);
        const maxLeft = trackWidth - width;
        const left =
            maxLeft === 0
                ? 0
                : (scrollLeft / (scrollWidth - clientWidth)) * maxLeft;

        setThumb({ width, left });
    };

    useEffect(() => {
        updateThumb();
        const el = scrollRef.current;
        if (!el) return;

        el.addEventListener('scroll', updateThumb);
        window.addEventListener('resize', updateThumb);

        const ro = new ResizeObserver(updateThumb);
        ro.observe(el);
        Array.from(el.children).forEach((child) => ro.observe(child));

        return () => {
            el.removeEventListener('scroll', updateThumb);
            window.removeEventListener('resize', updateThumb);
            ro.disconnect();
        };
    }, [children, canScroll]);

    const onThumbMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        const el = scrollRef.current;
        const track = trackRef.current;
        if (!el || !track) return;

        const startX = e.clientX;
        const startLeft = thumb.left;
        const maxLeft = track.clientWidth - thumb.width;
        const maxScroll = el.scrollWidth - el.clientWidth;

        const onMove = (ev: globalThis.MouseEvent) => {
            const nextLeft = Math.min(
                Math.max(startLeft + (ev.clientX - startX), 0),
                maxLeft,
            );
            el.scrollLeft =
                maxLeft === 0 ? 0 : (nextLeft / maxLeft) * maxScroll;
        };

        const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    const onTrackMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) return;

        const el = scrollRef.current;
        const track = trackRef.current;
        if (!el || !track) return;

        const rect = track.getBoundingClientRect();
        const ratio = (event.clientX - rect.left) / rect.width;
        el.scrollLeft = ratio * (el.scrollWidth - el.clientWidth);
    };

    return (
        <div className="relative">
            <div
                ref={scrollRef}
                className={`now-playing-scroll flex overflow-x-auto ${barClassName ? 'pb-0' : 'pb-3.75'} ${className ?? ''}`}
                onWheel={(e) => {
                    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                        e.currentTarget.scrollLeft += e.deltaY;
                    }
                }}
            >
                {children}
            </div>

            {canScroll && (
                <div
                    ref={trackRef}
                    onMouseDown={onTrackMouseDown}
                    className={`bg-light-grey-muted relative h-1.5 w-full cursor-pointer rounded-[22px] ${barClassName ?? 'mt-4'}`}
                >
                    <div
                        className="bg-helper-red absolute top-0 h-full cursor-pointer rounded-[22px]"
                        style={{
                            width: `${thumb.width}px`,
                            left: `${thumb.left}px`,
                        }}
                        onMouseDown={onThumbMouseDown}
                    />
                </div>
            )}

            {canScroll && showFade && (
                <div className="from-background pointer-events-none absolute top-0 right-0 bottom-3.75 z-10 w-20 bg-linear-to-l to-transparent" />
            )}
        </div>
    );
};

export default HorizontalScroll;
