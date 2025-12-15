import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    status?: "verified" | "pending" | "failed" | "processing";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, status, children, ...props }, ref) => {
        const variants = {
            verified: "bg-zk-green text-void-black",
            pending: "bg-alert-orange text-void-black",
            failed: "bg-red-500 text-ghost-white",
            processing: "bg-electric-azure text-ghost-white",
        };

        const labels = {
            verified: "VERIFIED",
            pending: "PENDING",
            failed: "FAILED",
            processing: "PROCESSING",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                    status ? variants[status] : "",
                    className
                )}
                {...props}
            >
                {children || (status ? labels[status] : null)}
            </div>
        );
    }
);
Badge.displayName = "Badge";

export { Badge };
