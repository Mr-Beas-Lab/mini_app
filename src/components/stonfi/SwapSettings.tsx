import { useId } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import {
  SLIPPAGE_TOLERANCE_OPTIONS,
  setSlippageTolerance,
} from "../../store/slice/swap-settings";
import { RootState } from "@/store/store";
 
export function SwapSettings({
  trigger = (
    <Button variant="outline" className="w-fit">
      Settings
    </Button>
  ),
}: {
  trigger?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Swap Settings</DialogTitle>
        </DialogHeader>
        <SlippageToleranceSection />
      </DialogContent>
    </Dialog>
  );
}

const transformValue = (value: number) => value * 100;
const transformValueBack = (value: number) => value / 100;

const SlippageToleranceSection = () => {
  const dispatch = useDispatch();
  const slippageTolerance = useSelector(
    (state: RootState) => state.swapSettings.slippageTolerance
  );

  const inputId = useId();

  return (
    <section className="flex space-x-2 items-end">
      <div className="grid items-center gap-1.5 w-full">
        <Label htmlFor={inputId}>Slippage Tolerance</Label>
        <Input
          id={inputId}
          type="number"
          value={transformValue(slippageTolerance)}
          onChange={(e) =>
            dispatch(
              setSlippageTolerance(
                transformValueBack(Number.parseFloat(e.target.value))
              )
            )
          }
        />
      </div>
      {SLIPPAGE_TOLERANCE_OPTIONS.map((value) => (
        <Button
          key={value}
          variant={value === slippageTolerance ? "default" : "secondary"}
          onClick={() => dispatch(setSlippageTolerance(value))}
        >
          {transformValue(value)}%
        </Button>
      ))}
    </section>
  );
};
