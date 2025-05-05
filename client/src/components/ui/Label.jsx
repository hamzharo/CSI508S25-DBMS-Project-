import { Label as ShadcnLabel } from "@radix-ui/react-label";
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <ShadcnLabel ref={ref} className={`text-sm font-medium ${className}`} {...props} />
));

Label.displayName = "Label";

export { Label };
