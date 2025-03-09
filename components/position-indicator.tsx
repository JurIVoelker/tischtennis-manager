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
    variant === "black" ? "bg-primary text-white" : "bg-secondary text-black";

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
