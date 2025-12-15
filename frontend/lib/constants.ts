import {
    Bank,
    Globe,
    ShieldCheck,
    Fingerprint,
    IdentificationCard
} from "@phosphor-icons/react";

export interface Provider {
    name: string;
    icon: React.ElementType;
    status: "Available" | "Coming Soon";
    description: string;
    href: string;
}

export const PROVIDERS: Provider[] = [
    {
        name: "Binance",
        icon: Bank,
        status: "Available",
        description: "Reclaim Protocol: Verify KYC Level 2",
        href: "#"
    },
    {
        name: "OKX",
        icon: Globe,
        status: "Coming Soon",
        description: "Verify Exchange Account Status",
        href: "#"
    },
    {
        name: "Bybit",
        icon: ShieldCheck,
        status: "Coming Soon",
        description: "Exchange Identity Verification",
        href: "#"
    },
    {
        name: "Fractal ID",
        icon: Fingerprint,
        status: "Coming Soon",
        description: "Web3 Identity Verification",
        href: "#"
    },
    {
        name: "Didit",
        icon: IdentificationCard,
        status: "Coming Soon",
        description: "Decentralized Identity Provider",
        href: "#"
    }
];
