import { useEffect, useState } from "react";

const AutoScrollCarousel = ({ images, visibleCount = 5, interval = 2000 }) => {
  const [visibleImages, setVisibleImages] = useState([]);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!images || images.length === 0) return;

    if (images.length <= visibleCount) {
      setVisibleImages(images);
      return;
    }

    // Initialize first window of images
    setVisibleImages(images.slice(0, visibleCount));

    const timer = setInterval(() => {
      let img = images.shift(); images.push(img); setVisibleImages(images.slice(0, visibleCount));
    }, interval); return () => clearInterval(timer);
  }, [images, visibleCount, interval]);

  

return (
  <div className="w-full flex justify-center items-center overflow-hidden">
    <div
      className={`flex gap-4 transition-transform duration-500 ease-linear ${animating ? "-translate-x-[20%]" : "translate-x-0"
        }`}
    >
      {visibleImages.map((img, i) => (
        <div
          key={`${img}-${i}`}
          className="w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden shadow-md border border-gray-200 flex-shrink-0"
        >
          <img
            src={img}
            alt={`carousel-${i}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  </div>
);
};

export default AutoScrollCarousel;
