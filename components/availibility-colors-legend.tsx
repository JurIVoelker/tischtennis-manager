import { Cancel01Icon, HelpCircleIcon, Tick01Icon } from "hugeicons-react";
import Typography from "./typography";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

const AvailabilityColorsLegend = () => {
  const options = [
    {
      label: "Verfügbar",
      customClasses: "border-positive-border bg-positive-light",
      icon: () => <Tick01Icon size={20} className="text-positive-dark" strokeWidth={2}/>,
    },
    {
      label: "Nicht Verfügbar",
      customClasses: "bg-negative-light border-negative-border",
      icon: () => <Cancel01Icon size={20} className="text-negative-dark" strokeWidth={2}/>,
    },
    {
      label: "Vielleicht",
      customClasses: "bg-neutral-light border-neutral-border",
      icon: () => <HelpCircleIcon size={20} className="text-neutral-dark" strokeWidth={2}/>,
    },
    {
      label: "Nicht abgestimmt",
      customClasses: "bg-secondary border-input",
      icon: () => <></>,
    },
  ];

  return (
    <div>
      <Separator className="mb-4 mt-6" />
      <div className="space-y-1">
        {options.map((option, i) => {
          const IconComponent = option.icon;
          return (
            <div key={i} className="flex gap-2 items-center">
              <div
                className={cn(
                  "w-7 h-7 rounded-full border flex justify-center items-center",
                  option.customClasses
                )}
              >
                <IconComponent />
              </div>
              <Typography variant="p-gray">= {option.label}</Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailabilityColorsLegend;
