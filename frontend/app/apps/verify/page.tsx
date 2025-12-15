"use client";

import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
    Envelope,
    EyeSlash,
    Warning,
    CheckCircle,
    SpinnerGap,
    UserCircle,
    ShieldCheck
} from "@phosphor-icons/react";

import { KycStatusBanner } from "@/app/apps/verify/components/KycStatusBanner";
import { BindingVisualization } from "@/app/apps/verify/components/BindingVisualization";
import { VerificationStep } from "@/app/apps/verify/components/VerificationStep";
import { useAuthSession } from "@/hooks/useAuthSession";

export default function VerifyPage() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { authSession, isEmailVerified, logout } = useAuthSession();

    const [email, setEmail] = useState("");
    const [hash, setHash] = useState("0x0000000000000000...");
    const [isBound, setIsBound] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
    const [magicLinkSent, setMagicLinkSent] = useState(false);

    // Email match verification state (new "Verify it's me" step)
    const [isEmailMatched, setIsEmailMatched] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

    // KYC verification state
    const [isKycVerified, setIsKycVerified] = useState(false);
    const [kycProvider, setKycProvider] = useState<string | null>(null);

    // Sync state from authSession
    useEffect(() => {
        if (authSession) {
            setEmail(authSession.email);
            setHash(authSession.emailHash.substring(0, 42) + "...");
        }
    }, [authSession]);

    // Check KYC status on mount
    useEffect(() => {
        const storedKyc = localStorage.getItem("deeproof_kyc");
        if (storedKyc) {
            try {
                const kyc = JSON.parse(storedKyc);
                if (kyc.verified) {
                    setIsKycVerified(true);
                    setKycProvider(kyc.provider || "Unknown");
                }
            } catch (err) {
                console.error("Error parsing KYC status:", err);
            }
        }
    }, []);

    // Generate hash when email changes
    useEffect(() => {
        if (isEmailVerified) return;

        if (!email) {
            setHash("0x0000000000000000...");
            return;
        }

        const generateHash = async () => {
            const normalized = email.trim().toLowerCase();
            const msgBuffer = new TextEncoder().encode(normalized);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            setHash(hashHex.substring(0, 42) + "...");
        };
        generateHash();

        // Reset email match status when email changes
        setIsEmailMatched(false);
    }, [email, isEmailVerified]);

    // Helper function to get sessionId from localStorage
    const getSessionId = (): string | null => {
        const storedKyc = localStorage.getItem("deeproof_kyc");
        if (!storedKyc) return null;

        try {
            const kyc = JSON.parse(storedKyc);
            if (kyc.sessionId) return kyc.sessionId;
            if (kyc.proofs && kyc.proofs[0]) return kyc.proofs[0].identifier;
        } catch (e) {
            console.error("Error parsing stored KYC data", e);
        }
        return null;
    };

    // "Verify it's me" button handler - validates email matches Reclaim verification
    const handleVerifyEmail = async () => {
        if (!email) {
            setError("Please enter an email address");
            return;
        }

        const sessionId = getSessionId();
        if (!sessionId) {
            setError("No verification session found. Please verify with Binance first.");
            return;
        }

        setIsVerifyingEmail(true);
        setError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_SERVER || "http://localhost:3001";
            const response = await fetch(`${apiUrl}/api/auth/verify-email-match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, sessionId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Email verification failed');
            }

            if (data.matched) {
                setIsEmailMatched(true);
                console.log('✅ Email verified as matching Reclaim identity');
            } else {
                throw new Error('Email does not match verified identity');
            }
        } catch (err: any) {
            console.error('Error verifying email:', err);
            setError(err.message || 'An error occurred during verification');
            setIsEmailMatched(false);
        } finally {
            setIsVerifyingEmail(false);
        }
    };

    const handleSendMagicLink = async () => {
        if (!email) {
            setError("Please enter an email address");
            return;
        }

        // Use the helper function we defined earlier
        const sessionId = getSessionId();
        if (!sessionId) {
            setError("No verification session found. Please verify with Binance first.");
            return;
        }

        setIsSendingMagicLink(true);
        setError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_SERVER || "http://localhost:3001";
            const response = await fetch(`${apiUrl}/api/auth/send-magic-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, sessionId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send magic link');
            }

            setMagicLinkSent(true);
        } catch (err: any) {
            console.error('Error sending magic link:', err);
            setError(err.message || 'An error occurred');
        } finally {
            setIsSendingMagicLink(false);
        }
    };


    const handleBind = async () => {
        if (!isEmailVerified || !authSession) {
            setError("Please verify your email first");
            return;
        }

        if (!isConnected || !address) {
            setError("Please connect your wallet");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const identityHash = authSession.emailHash;
            const message = `Bind Identity: ${identityHash}`;
            const signature = await signMessageAsync({ message });

            const apiUrl = process.env.NEXT_PUBLIC_SERVER || "http://localhost:3001";

            // Use the helper function we defined earlier
            const sessionId = getSessionId();

            const response = await fetch(`${apiUrl}/api/bind`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress: address,
                    email: authSession.email,
                    signature,
                    sessionId: sessionId // Send sessionId for backend validation
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to bind identity');
            }

            setIsBound(true);
            console.log('Binding successful:', data);

        } catch (err: any) {
            console.error('Error binding identity:', err);
            setError(err.message || 'An error occurred during binding');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        setEmail("");
        setHash("0x0000000000000000...");
        setMagicLinkSent(false);
    };

    return (
        <main className="min-h-screen pt-24 pb-20">
            <Container>
                <div className="flex flex-col space-y-12">

                    {/* Header Section */}
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <h1 className="font-display font-bold text-4xl md:text-5xl text-ghost-white">
                            Identity Binding Protocol
                        </h1>
                        <p className="text-code-grey text-lg">
                            Bind your wallet to a cryptographically hashed identity. <br />
                            <span className="text-oracle-gold font-semibold">One Identity, One Wallet.</span>
                        </p>
                    </div>

                    <KycStatusBanner
                        isVerified={isKycVerified}
                        provider={kycProvider}
                    />

                    <BindingVisualization
                        isConnected={isConnected}
                        address={address}
                        isBound={isBound}
                        isEmailVerified={isEmailVerified}
                        email={email}
                        setEmail={setEmail}
                        magicLinkSent={magicLinkSent}
                        hash={hash}
                        authSession={authSession}
                        onLogout={handleLogout}
                    />

                    {/* Action Area */}
                    <div className="grid md:grid-cols-2 gap-8">

                        <VerificationStep
                            title="1. Verify Email"
                            descriptions={[
                                {
                                    icon: <Envelope className="w-5 h-5 text-oracle-gold" />,
                                    text: <>We'll send a <span className="text-white font-bold">magic link</span> to your email for verification. No password needed.</>
                                },
                                {
                                    icon: <EyeSlash className="w-5 h-5 text-code-grey" />,
                                    text: <>Your email is hashed (SHA-256) and <span className="text-white font-bold">never stored in plain text</span>.</>
                                }
                            ]}
                            actionElement={
                                magicLinkSent && !isEmailVerified ? (
                                    <div className="mt-8 p-4 bg-oracle-gold/10 border border-oracle-gold/20 rounded-lg text-center">
                                        <Envelope className="w-8 h-8 mx-auto text-oracle-gold mb-2" />
                                        <p className="text-sm text-oracle-gold font-semibold">Magic link sent!</p>
                                        <p className="text-xs text-code-grey mt-1">Check your email and click the link to verify.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Error display */}
                                        {error && !isEmailMatched && (
                                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                <p className="text-sm text-red-500">{error}</p>
                                            </div>
                                        )}

                                        {/* Step 1: Verify it's me button */}
                                        {!isEmailMatched && !isEmailVerified && (
                                            <Button
                                                className="w-full bg-electric-azure hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                                onClick={handleVerifyEmail}
                                                disabled={!isKycVerified || !email || isVerifyingEmail}
                                            >
                                                {isVerifyingEmail ? (
                                                    <><SpinnerGap className="mr-2 w-5 h-5 animate-spin" /> Verifying...</>
                                                ) : (
                                                    <><ShieldCheck className="mr-2 w-5 h-5" /> Verify it's me</>
                                                )}
                                            </Button>
                                        )}

                                        {/* Step 2: Send Magic Link button (only enabled after verify) */}
                                        {isEmailMatched && !isEmailVerified && (
                                            <div className="space-y-3">
                                                <div className="p-3 bg-zk-green/10 border border-zk-green/20 rounded-lg text-center">
                                                    <CheckCircle className="w-6 h-6 mx-auto text-zk-green mb-1" />
                                                    <p className="text-sm text-zk-green font-semibold">Email verified as matching KYC identity!</p>
                                                </div>
                                                <Button
                                                    className="w-full bg-oracle-gold hover:shadow-[0_0_20px_rgba(217,119,6,0.5)]"
                                                    onClick={handleSendMagicLink}
                                                    disabled={isSendingMagicLink}
                                                >
                                                    {isSendingMagicLink ? (
                                                        <><SpinnerGap className="mr-2 w-5 h-5 animate-spin" /> Sending...</>
                                                    ) : (
                                                        "Send Magic Link"
                                                    )}
                                                </Button>
                                            </div>
                                        )}

                                        {/* Email verified state */}
                                        {isEmailVerified && (
                                            <Button
                                                className="w-full bg-zk-green hover:bg-zk-green/90"
                                                disabled
                                            >
                                                <CheckCircle className="mr-2 w-5 h-5" /> Email Verified
                                            </Button>
                                        )}
                                    </div>
                                )
                            }
                        >
                            <></>
                        </VerificationStep>

                        <VerificationStep
                            title="2. Authorize Oracle"
                            descriptions={[
                                {
                                    icon: <Warning className="w-5 h-5 text-oracle-gold" />,
                                    text: <>Binding is <span className="text-white font-bold">permanent</span> for this wallet. We will hash your email (SHA256) and store the link in our encrypted oracle.</>
                                },
                                {
                                    icon: <EyeSlash className="w-5 h-5 text-code-grey" />,
                                    text: <>No raw data is shared with partners. They only verify the <span className="font-mono text-hash-grey">0xHash...</span></>
                                }
                            ]}
                            actionElement={
                                <Button
                                    className={`w-full ${isBound ? "bg-zk-green hover:bg-zk-green/90" : "bg-electric-azure hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"}`}
                                    onClick={handleBind}
                                    disabled={!isKycVerified || !isEmailVerified || isBound || isLoading || !isConnected}
                                >
                                    {isLoading ? (
                                        <>Processing...</>
                                    ) : isBound ? (
                                        <><CheckCircle className="mr-2 w-5 h-5" /> Identity Bound</>
                                    ) : !isKycVerified ? (
                                        "Complete KYC First"
                                    ) : !isEmailVerified ? (
                                        "Verify Email First"
                                    ) : !isConnected ? (
                                        "Connect Wallet First"
                                    ) : (
                                        "Bind Identity & Generate Proof"
                                    )}
                                </Button>
                            }
                        >
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-sm text-red-500">{error}</p>
                                </div>
                            )}
                        </VerificationStep>

                    </div>

                </div>
            </Container>
        </main>
    );
}
