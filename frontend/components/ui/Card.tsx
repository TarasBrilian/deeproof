import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    active?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, active, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative rounded-xl border border-white/10 bg-deep-charcoal/80 backdrop-blur-md p-6 md:p-8 transition-all duration-300",
                    "hover:border-electric-azure hover:-translate-y-1 hover:shadow-lg",
                    active && "border-electric-azure bg-deep-charcoal/90",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Card.displayName = "Card";

export { Card };
