import { CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
    className?: string;
    size?: number;
}

export function Spinner({ className, size = 20 }: SpinnerProps) {
    return (
        <CircleNotch
            size={size}
            weight="bold"
            className={cn("animate-spin text-current", className)}
        />
    );
}
