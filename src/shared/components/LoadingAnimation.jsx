import { useEffect, useRef } from 'react';
import { animate, svg } from 'animejs';

export const LoadingAnimation = () => {
  const svgRef = useRef(null);
  const carRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !carRef.current) return;

    const pathElement = svgRef.current.querySelector('path');

    if (pathElement) {
      const { translateX, translateY, rotate } = svg.createMotionPath(pathElement, 0);

      animate(carRef.current, {
        ease: 'linear',
        duration: 5000,
        loop: true,
        translateX,
        translateY,
        rotate
      });

      animate(svg.createDrawable(pathElement), {
        draw: '0 1',
        ease: 'linear',
        duration: 5000,
        loop: true
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        <svg
          ref={svgRef}
          width="200"
          height="120"
          viewBox="0 0 200 120"
          className="text-[#0a332a]"
        >
          <path
            d="M 20 80 Q 100 20 180 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeOpacity="0.3"
          />
          <g ref={carRef} className="transform-origin-center">
            <rect
              x="-15"
              y="-10"
              width="30"
              height="15"
              rx="5"
              fill="#0a332a"
            />
            <rect
              x="-8"
              y="-18"
              width="16"
              height="10"
              rx="3"
              fill="#0a332a"
            />
            <circle cx="-8" cy="5" r="5" fill="#1f2937" />
            <circle cx="8" cy="5" r="5" fill="#1f2937" />
          </g>
        </svg>
        <p className="text-center text-gray-500 mt-2">Cargando...</p>
      </div>
    </div>
  );
};
