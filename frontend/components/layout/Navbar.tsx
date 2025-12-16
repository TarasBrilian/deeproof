"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";


export function Navbar() {
    const { open } = useAppKit();
    const { address, isConnected } = useAccount();
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isAppPage = pathname?.startsWith("/apps");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = isAppPage
        ? [
            { name: "Identity", href: "/apps" },
            { name: "Verify", href: "/apps/verify" },
        ]
        : [
            { name: "Documentation", href: "https://deeproof.gitbook.io/docs" },
            { name: "Technology", href: "#technology" },
            { name: "Protocol", href: "#protocol" },
        ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "py-4 bg-void-black/80 backdrop-blur-md border-b border-[#333333]"
                    : "py-6 bg-transparent"
            )}
        >
            <Container>
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/logo.png"
                            alt="Deeproof Logo"
                            width={140}
                            height={40}
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                target={item.href.startsWith("http") ? "_blank" : undefined}
                                onClick={(e) => {
                                    if (item.href.startsWith("#")) {
                                        e.preventDefault();
                                        const element = document.querySelector(item.href);
                                        if (element) {
                                            const offset = 100; // Match scroll-padding
                                            const bodyRect = document.body.getBoundingClientRect().top;
                                            const elementRect = element.getBoundingClientRect().top;
                                            const elementPosition = elementRect - bodyRect;
                                            const offsetPosition = elementPosition - offset;

                                            window.scrollTo({
                                                top: offsetPosition,
                                                behavior: "smooth"
                                            });
                                        }
                                    }
                                }}
                                className="text-sm font-medium text-code-grey hover:text-white transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        {isAppPage ? (
                            <Button
                                variant="primary"
                                className="h-10 px-5 text-xs uppercase tracking-wide"
                                onClick={() => open()}
                            >
                                {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
                            </Button>
                        ) : (
                            <Link
                                href="/apps"
                                className={cn(
                                    "inline-flex items-center justify-center rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-azure disabled:pointer-events-none disabled:opacity-40 font-semibold",
                                    "bg-electric-azure text-ghost-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]",
                                    "h-10 px-5 text-xs uppercase tracking-wide"
                                )}
                            >
                                Launch App
                            </Link>
                        )}
                    </div>
                </div>
            </Container>
        </header>
    );
}
