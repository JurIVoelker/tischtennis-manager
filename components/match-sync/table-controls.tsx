import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { PlusSignSquareIcon } from "hugeicons-react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const TableControls = ({
  noneSelected,
  onHideSelected,
  onImportSelected,
  onShowHidden,
  showHidden,
  isLoading,
  onDeleteHidden,
}: {
  isLoading: boolean;
  noneSelected?: boolean;
  onHideSelected: () => void;
  onImportSelected: () => void;
  onShowHidden: (hidden: boolean) => void;
  showHidden: boolean;
  onDeleteHidden: () => void;
}) => {
  return (
    <div className="sticky bottom-0 w-full flex items-center left-0 justify-center bg-gradient-to-t from-background to-transparent pt-10 pointer-events-none">
      <div className="relative bottom-2 md:bottom-4 bg-background p-3 rounded-md shadow-lg border flex justify-center gap-2 overflow-hidden pointer-events-auto flex-col items-center md:flex-row">
        <div className="flex-col sm:flex-row gap-2 flex">
          {!showHidden && (
            <Button
              variant="default"
              disabled={noneSelected}
              onClick={onHideSelected}
              className="pointer-events-auto"
              isLoading={isLoading}
            >
              <EyeOff />
              Ausgewählte ignorieren
            </Button>
          )}
          {showHidden && (
            <Button
              variant="default"
              disabled={noneSelected}
              onClick={onDeleteHidden}
              className="pointer-events-auto"
              isLoading={isLoading}
            >
              <Eye />
              Ausgewählte nicht ignorieren
            </Button>
          )}
          <Button
            variant="default"
            disabled={noneSelected}
            onClick={onImportSelected}
            className="pointer-events-auto"
            isLoading={isLoading}
          >
            <PlusSignSquareIcon />
            Ausgewählte importieren
          </Button>
        </div>
        <Separator orientation="vertical" className="h-10 hidden md:block" />
        <Separator className="block md:hidden" />
        <div className="flex items-center space-x-2">
          <Switch
            id="show-hidden"
            className="pointer-events-auto"
            onCheckedChange={onShowHidden}
            disabled={isLoading}
          />
          <Label htmlFor="show-hidden">Versteckte Anzeigen </Label>
        </div>
      </div>
    </div>
  );
};

export default TableControls;
