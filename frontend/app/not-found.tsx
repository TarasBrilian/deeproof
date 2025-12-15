"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/Button";
import { WarningOctagon, ArrowLeft, House } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 pb-20">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-[-1] opacity-60 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-void-black to-void-black" />

            <Container className="text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                >
                    <div className="relative mb-8 group">
                        <div className="absolute inset-0 bg-alert-orange/20 blur-[40px] rounded-full opacity-50 group-hover:opacity-75 transition-opacity" />
                        <WarningOctagon className="w-24 h-24 text-alert-orange relative z-10" weight="duotone" />
                    </div>

                    <h1 className="font-display font-bold text-6xl md:text-8xl mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        404
                    </h1>

                    <h2 className="font-display text-2xl md:text-3xl text-ghost-white mb-6">
                        Page Not Found
                    </h2>

                    <p className="text-code-grey max-w-md mx-auto mb-10 text-lg leading-relaxed">
                        The cryptographic proof for this page could not be verified. It may have been moved, deleted, or never existed in this reality.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className={buttonVariants({ variant: "primary", className: "w-full sm:w-auto min-w-[160px]" })}
                        >
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Return Home
                        </Link>

                        <Link
                            href="/apps"
                            className={buttonVariants({ variant: "secondary", className: "w-full sm:w-auto min-w-[160px]" })}
                        >
                            <House className="mr-2 w-4 h-4" />
                            Explore Apps
                        </Link>
                    </div>
                </motion.div>
            </Container>
        </main>
    );
}
