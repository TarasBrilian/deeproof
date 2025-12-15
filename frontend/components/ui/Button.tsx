import * as React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    isLoading?: boolean;
}

export const buttonVariants = ({
    variant = "primary",
    className = ""
}: {
    variant?: "primary" | "secondary" | "ghost";
    className?: string;
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-azure disabled:pointer-events-none disabled:opacity-40 font-semibold";
    const variants = {
        primary: "bg-electric-azure text-ghost-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]",
        secondary: "bg-transparent border border-code-grey text-ghost-white hover:border-ghost-white hover:bg-white/5",
        ghost: "bg-transparent text-code-grey hover:text-ghost-white",
    };
    const sizes = "h-12 px-6 py-3";

    return cn(baseStyles, variants[variant], sizes, className);
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={buttonVariants({ variant, className })}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <Spinner size={16} />
                        <span>PROCESSING...</span>
                    </div>
                ) : (
                    children
                )}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
