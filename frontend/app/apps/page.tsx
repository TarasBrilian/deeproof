"use client";

import { Container } from "@/components/ui/Container";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import { PROVIDERS } from "@/lib/constants";
import { VerificationQRModal } from "@/components/ui/VerificationQRModal";
import { useReclaim } from "@/hooks/useReclaim";
import { ProviderCard } from "@/app/apps/components/ProviderCard";

export default function IdentityPage() {
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    // Use the custom useReclaim hook
    const {
        proofs,
        isLoading,
        error,
        requestUrl,
        sessionId,
        startVerification,
        reset
    } = useReclaim();

    // Determine verification status based on hook state
    const verificationStatus: 'waiting' | 'verified' | 'failed' =
        proofs ? 'verified' :
            error ? 'failed' :
                'waiting';


    // Handle Continue button click - verify data was saved by backend
    const handleContinue = async () => {
        try {
            // Get sessionId from the proof object or from hook state
            let sid: string | null = null;

            if (proofs && Array.isArray(proofs) && proofs[0]) {
                const proof = proofs[0];
                // Could be from SDK (identifier) or from our synthetic proof (identifier)
                sid = proof.identifier || proof.session?.sessionId;
            }

            // Fallback to sessionId from hook if not in proofs
            if (!sid && sessionId) {
                sid = sessionId;
            }

            if (!sid) {
                alert('No verification session found. Please try again.');
                return;
            }

            console.log('✅ Using sessionId:', sid);

            // Verify data exists in the database
            const apiUrl = process.env.NEXT_PUBLIC_SERVER || "http://localhost:3001";
            const response = await fetch(`${apiUrl}/api/reclaim/status/${sid}`);
            const data = await response.json();

            if (!data.success || !data.session) {
                console.error('❌ Verification not found in database');
                alert('Verification not found in database. Please try again.');
                return;
            }

            const session = data.session;
            console.log('✅ Verification confirmed in database:', {
                sessionId: session.sessionId,
                email: session.emailEncrypted ? '[encrypted]' : 'none',
                userId: session.binance_uid,
                status: session.status
            });

            // Store verification status in localStorage for the verify page
            localStorage.setItem("deeproof_kyc", JSON.stringify({
                verified: true,
                verifiedAt: new Date().toISOString(),
                provider: "Binance",
                sessionId: session.sessionId,
                userId: session.binance_uid,
                proofs: proofs
            }));

            // Clean up old localStorage keys
            localStorage.removeItem('reclaim_session');
            localStorage.removeItem('verification_data');

            // Redirect to verify page
            setIsQRModalOpen(false);
            router.push('/apps/verify');

        } catch (error) {
            console.error('Error handling continue:', error);
            alert('Failed to proceed. Please try again.');
        }
    };

    const handleBinanceClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        setIsQRModalOpen(true);
        reset(); // Reset previous session if any

        try {
            // Use a simple userId for initialization
            // The actual Binance UID will come from Reclaim proof
            const userId = `verification-${Date.now()}`;

            // startVerification already calls /init endpoint internally
            await startVerification(userId, address);

        } catch (err) {
            console.error('Error starting verification:', err);
            // Error state is handled by the hook and displayed in status
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-20">
            <Container>
                <div className="flex flex-col space-y-12">

                    {/* Header Section */}
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <h1 className="font-display font-bold text-4xl md:text-5xl text-ghost-white">
                            Choose Verification Source
                        </h1>
                        <p className="text-code-grey text-lg">
                            Select a provider to bind your identity. <br />
                            <span className="text-oracle-gold font-semibold">Privacy First. Zero Data Disclosure.</span>
                        </p>
                    </div>

                    {/* Providers Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PROVIDERS.map((provider) => (
                            <ProviderCard
                                key={provider.name}
                                provider={provider}
                                isLoading={isLoading}
                                isQRModalOpen={isQRModalOpen}
                                onBinanceClick={handleBinanceClick}
                            />
                        ))}
                    </div>

                </div>
            </Container>

            <VerificationQRModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                requestUrl={requestUrl}
                isLoading={isLoading}
                status={verificationStatus}
                onContinue={handleContinue}
            />
        </main>
    );
}
