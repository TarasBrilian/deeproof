"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Provider } from "@/lib/constants";

interface ProviderCardProps {
    provider: Provider;
    isLoading: boolean;
    isQRModalOpen: boolean;
    onBinanceClick: (e: React.MouseEvent) => void;
}

export const ProviderCard = ({
    provider,
    isLoading,
    isQRModalOpen,
    onBinanceClick
}: ProviderCardProps) => {
    return (
        <Link
            href={provider.href}
            className="block group h-full"
            onClick={(e) => {
                if (provider.name === "Binance") {
                    onBinanceClick(e);
                }
            }}
        >
            <Card className="h-full bg-deep-charcoal border-white/10 hover:border-electric-azure transition-all duration-300 relative overflow-hidden group-hover:transform group-hover:-translate-y-1">
                <div className="absolute inset-0 bg-transparent group-hover:bg-electric-azure/5 transition-colors" />

                <div className="relative z-10 flex flex-col h-full space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-void-black border border-white/10 flex items-center justify-center shadow-lg group-hover:border-electric-azure/50 transition-colors">
                        <provider.icon className="w-6 h-6 text-electric-azure group-hover:text-white transition-colors" />
                    </div>

                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xl text-white">{provider.name}</h3>
                        {provider.status === "Available" ? (
                            <span className="text-[10px] bg-zk-green/10 text-zk-green px-2 py-0.5 rounded border border-zk-green/20 uppercase font-bold tracking-wider">
                                {isLoading && isQRModalOpen && provider.name === "Binance" ? "Loading..." : "Live"}
                            </span>
                        ) : (
                            <span className="text-[10px] bg-white/5 text-code-grey px-2 py-0.5 rounded border border-white/10 uppercase font-bold tracking-wider">
                                Soon
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-code-grey flex-1">
                        {provider.description}
                    </p>
                </div>
            </Card>
        </Link>
    );
};
