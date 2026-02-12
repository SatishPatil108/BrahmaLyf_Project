import React, { useEffect, useState } from 'react';
import { assets } from '@/assets/assets';

const BannerImage = () => {
  const [stopScroll, setStopScroll] = React.useState(false);
  const cardData = [
    {
      title: "Calm the Mind, Elevate the Soul",
      image : assets.mindimage
    },
    {
      title: "Charge Your Spirit, Clear Your Path",
      image: assets.bannerimage1
    },
    {
      title: "Calm with Purpose, Move with Power",
      image: assets.meditation
    },
    {
      title: "Find Your Focus, Ignite Your Calm",
      image: assets.bethechangeimg
    },
  ];

  return (
    <>
      <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }

                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>

      <div className="py-12 w-full relative max-w-6xl mx-auto" onMouseEnter={() => setStopScroll(true)} onMouseLeave={() => setStopScroll(false)}>
        <div className="marquee-inner flex w-fit" style={{ animationPlayState: stopScroll ? "paused" : "running", animationDuration: cardData.length * 2500 + "ms" }}>
          <div className="flex">
            {[...cardData, ...cardData].map((card, index) => (
              <div key={index} className="w-56 mx-4 h-[20rem] relative group hover:scale-90 transition-all duration-300">
                <img src={card.image} alt="card" className="w-full h-full object-cover" />
                <div className="flex items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-0 backdrop-blur-md left-0 w-full h-full bg-black/20">
                  <p className="text-white text-lg font-semibold text-center">{card.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerImage;
