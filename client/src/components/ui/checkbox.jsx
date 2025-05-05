import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow", // Use border-primary (or border-input if preferred)
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", // Use ring-ring for focus
      "disabled:cursor-not-allowed disabled:opacity-50",
      // --- THIS IS THE CRITICAL ADDITION ---
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      // --- END CRITICAL ADDITION ---
      className // Allows passing additional classes from where you use <Checkbox>
    )}    
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
    {/* <CheckboxPrimitive.Indicator className="flex items-center justify-center text-blue-600"> */}
      <CheckIcon className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
