import * as React from "react";
import { cn } from "@/lib/utils";

const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "mx-auto w-full max-w-[1280px] px-5 sm:px-6 lg:px-8",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Container.displayName = "Container";

export { Container };
