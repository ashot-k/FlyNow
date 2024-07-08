import { useSwiper } from "swiper/react";

export function SwiperButtonPrev({ children }: any) {
    const swiper = useSwiper();
    return (
        <button
            onClick={() => {
                swiper.slidePrev();
            }}>
            {children}
        </button>
    );
}
