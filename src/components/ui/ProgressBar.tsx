import React, { useEffect, useState } from "react";
import CurvedArc from "./CurvedArc";
import needle from "../../../public/image/needle.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
const GaugeComponent = ({
  value = 65,
  maxValue = 100,
  duration = 1500,
  title = "Your Advayu Presence",
  subtitle = "Good presence",
  buttonText = "Create Strong Offers",
  onButtonClick = () => {},
  color = "rgb(106, 178, 180)",
  className = "",
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const startAnimation = () => {
      const start = 0; // Always start from 0
      const end = Math.min(value, maxValue); // Cap value at maxValue
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Cap progress at 1
        const animatedValue = start + (end - start) * progress;

        setCurrentValue(animatedValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    startAnimation();
  }, [value, maxValue, duration]);

  // Calculate the rotation based on the current value
  const rotation = (currentValue / maxValue) * 180 - 90;

  return (
    <div className={` p-6 text-center bg-[#F3F3F3] md:mx-4 mb-10 ${className}`}>
      {/* Title */}
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {/* Gauge */}
      <div className="relative w-64 h-32 mx-auto mb-6">
        {/* Background Arc */}
        {/* <div 
      className={`h-32 w-64 rounded-t-full relative `}
      style={{
        background: 'linear-gradient(90deg, rgba(230, 244, 244, 0.8) 0%, rgb(106, 178, 180) 100%)',
        // transform: 'rotate()'
      }}
        /> */}
        <div className="arc" />
        {/* <Eclipse/> */}

        {/* Needle */}
        <div
          className="absolute left-1/2 bottom-0 w-1 h-24 bg-black origin-bottom needle"
          style={{
            transform: `rotate(${90 + rotation}deg)`,
          }}
        />
      </div>

      {/* Value */}
      <div className="text-center mb-4">
        <span className="text-5xl font-bold text-[#199EAD]">
          {Math.round(currentValue)}%
        </span>
        <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
      </div>

      {/* Button */}
      <Button
        size={"thin"}
        onClick={onButtonClick}
        className="w-[207px] py-2 bg-[#199EAD] text-[14px] text-white rounded-lg transition-colors duration-200">
        {buttonText}
      </Button>
    </div>
  );
};

export default GaugeComponent;
