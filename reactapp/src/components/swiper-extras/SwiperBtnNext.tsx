import { useSwiper } from "swiper/react";

export function SwiperButtonNext({ children }: any) {
    const swiper = useSwiper();
    return (
        <button
            onClick={() => {
                swiper.slideNext();
            }}>
            {children}
        </button>
    );
}
