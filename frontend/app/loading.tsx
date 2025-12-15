"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "@phosphor-icons/react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void-black">
            <div className="relative">
                {/* Rotating Gradient Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 rounded-full border-t-2 border-r-2 border-electric-azure/50 border-b-2 border-l-2 border-transparent"
                />

                {/* Pulsing Shield Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ShieldCheck weight="fill" className="w-10 h-10 text-electric-azure" />
                    </motion.div>
                </div>

                {/* Outer Glow */}
                <div className="absolute inset-0 bg-electric-azure/20 blur-2xl rounded-full -z-10 animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex flex-col items-center gap-2"
            >
                <h3 className="text-xl font-display font-bold text-white tracking-widest uppercase">
                    Verifying
                </h3>
                <div className="h-1 w-24 bg-deep-charcoal rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-electric-azure"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
