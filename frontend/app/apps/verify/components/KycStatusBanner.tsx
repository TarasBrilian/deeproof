"use client";

import { CheckCircle, Warning } from "@phosphor-icons/react";

interface KycStatusBannerProps {
    isVerified: boolean;
    provider: string | null;
}

export const KycStatusBanner = ({ isVerified, provider }: KycStatusBannerProps) => {
    if (!isVerified) {
        return (
            <div className="p-6 rounded-xl border-2 border-red-500/50 bg-red-500/10 text-center">
                <Warning className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">KYC Verification Required</h3>
                <p className="text-code-grey mb-4">
                    You must complete KYC verification before proceeding with email verification and identity binding.
                </p>
                <a
                    href="/apps"
                    className="inline-block px-6 py-3 bg-electric-azure text-white rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-shadow"
                >
                    Complete KYC Verification
                </a>
            </div>
        );
    }

    return (
        <div className="p-4 rounded-xl border border-zk-green/30 bg-zk-green/10 flex items-center justify-center gap-4">
            <CheckCircle className="w-8 h-8 text-zk-green" weight="fill" />
            <div className="text-left">
                <p className="text-zk-green font-semibold">KYC Verified via {provider}</p>
                <p className="text-sm text-code-grey">You can now proceed with email verification</p>
            </div>
        </div>
    );
};
