"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { CheckCircle, XCircle, SpinnerGap } from "@phosphor-icons/react";

export default function AuthVerifyPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("No verification token provided");
            return;
        }

        const verifyToken = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_SERVER || "http://localhost:3001";
                const response = await fetch(`${apiUrl}/api/auth/verify-magic-link?token=${token}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Verification failed");
                }

                // Store session in localStorage
                localStorage.setItem("deeproof_session", JSON.stringify({
                    sessionToken: data.sessionToken,
                    email: data.email,
                    emailHash: data.emailHash,
                    expiresAt: data.expiresAt
                }));

                setStatus("success");
                setMessage("Email verified successfully! Redirecting...");

                // Redirect to verify page after 2 seconds
                setTimeout(() => {
                    router.push("/apps/verify");
                }, 2000);

            } catch (err: any) {
                setStatus("error");
                setMessage(err.message || "Verification failed");
            }
        };

        verifyToken();
    }, [searchParams, router]);

    return (
        <main className="min-h-screen pt-24 pb-20 flex items-center justify-center">
            <Container>
                <Card className="max-w-md mx-auto p-8 bg-deep-charcoal border-white/10 text-center">
                    {status === "loading" && (
                        <div className="space-y-4">
                            <SpinnerGap className="w-16 h-16 mx-auto text-electric-azure animate-spin" />
                            <h2 className="text-xl font-display font-bold text-white">Verifying your email...</h2>
                            <p className="text-code-grey">Please wait while we verify your magic link.</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="space-y-4">
                            <CheckCircle className="w-16 h-16 mx-auto text-zk-green" weight="fill" />
                            <h2 className="text-xl font-display font-bold text-white">Email Verified!</h2>
                            <p className="text-zk-green">{message}</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="space-y-4">
                            <XCircle className="w-16 h-16 mx-auto text-red-500" weight="fill" />
                            <h2 className="text-xl font-display font-bold text-white">Verification Failed</h2>
                            <p className="text-red-400">{message}</p>
                            <button
                                onClick={() => router.push("/apps/verify")}
                                className="mt-4 px-6 py-2 bg-electric-azure text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Go Back to Verify Page
                            </button>
                        </div>
                    )}
                </Card>
            </Container>
        </main>
    );
}
