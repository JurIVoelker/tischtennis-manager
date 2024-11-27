import React from "react";

interface PositonIndicatorProps {
  position: number;
  children: React.ReactNode;
  className?: string;
  variant?: "light" | "black";
}

const PositonIndicator: React.FC<PositonIndicatorProps> = ({
  position,
  children,
  className,
  variant = "light",
}) => {
  const variantClasses =
    variant === "black" ? "bg-black text-white" : "bg-gray-200 text-black";

  return (
    <div className={`flex ${className || ""}`}>
      <div
        className={`inline-flex w-6 h-6 rounded-full mr-2 justify-center ${variantClasses}`}
      >
        {position}
      </div>
      <p>{children}</p>
    </div>
  );
};

export default PositonIndicator;
