import React, { PropsWithChildren } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Autoplay from "embla-carousel-autoplay";
interface CarouselProps {
  loop?: boolean;
  spacing?: string; // Tailwind spacing classes like "space-x-4"
}

const HorizontalCarousel: React.FC<PropsWithChildren<CarouselProps>> = ({
  children,
  loop = false,
  spacing = "space-x-4",
}) => {
  const [emblaRef] = useEmblaCarousel({ loop: false }, [WheelGesturesPlugin()]);
  // Autoplay({ delay: 3000, stopOnInteraction: false })
  return (
    <div className="w-[100%] embla overflow-scroll space-x-4" ref={emblaRef}>
      <div className="embla__container flex space-x-4 ">{children}</div>
    </div>
  );
};

const VerticalCarousel: React.FC<PropsWithChildren<CarouselProps>> = ({
  children,
  loop = false,
  spacing = "space-y-4",
}) => {
  const [emblaRef] = useEmblaCarousel({ loop: false }, [WheelGesturesPlugin()]);
  return (
    <div className="w-[100%] embla overflow-scroll " ref={emblaRef}>
      <div className="embla__container-vertical max-height[30rem] flex flex-col ">
        {children}
      </div>
    </div>
  );
};

export { HorizontalCarousel, VerticalCarousel };
