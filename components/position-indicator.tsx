import React from "react";

interface PositonIndicatorProps {
  position: number;
  children: React.ReactNode;
  className?: string;
}

const PositonIndicator: React.FC<PositonIndicatorProps> = ({
  position,
  children,
  className,
}) => {
  return (
    <div className={`flex ${className || ""}`}>
      <div className="inline-flex w-6 h-6 bg-gray-200 rounded-full mr-2 justify-center">
        {position}
      </div>
      <p>{children}</p>
    </div>
  );
};

export default PositonIndicator;
