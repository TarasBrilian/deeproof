"use client";

import { buttonVariants } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative z-10 mb-32">
            <Container className="text-center">
                <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-[5rem] leading-[1.1] tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    Deep Verification, <br />
                    Zero Disclosure.
                </h1>
                <p className="font-sans text-lg md:text-xl text-code-grey max-w-2xl mx-auto mb-12 leading-relaxed">
                    The Privacy-Preserving Compliance Oracle. We bind identities to wallets using cryptographic hashes, allowing you to prove compliance without ever revealing raw data.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/apps" className={buttonVariants({ variant: "primary", className: "w-full sm:w-auto group" })}>
                        Start Binding
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link href="/docs" target="_blank" className={buttonVariants({ variant: "secondary", className: "w-full sm:w-auto" })}>
                        Read Documentation
                    </Link>
                </div>
            </Container>
        </section>
    );
}
