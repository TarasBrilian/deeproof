"use client";

import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import {
    Cpu,
    FingerprintSimple,
    Link as LinkIcon,
    CheckCircle
} from "@phosphor-icons/react";

export function IdentityVisualization() {
    return (
        <section id="protocol" className="mb-32">
            <Container>
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="relative w-full max-w-[480px] h-[320px] mx-auto bg-deep-charcoal/50 border border-white/10 rounded-2xl backdrop-blur-sm p-8 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(217,119,6,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(217,119,6,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
                            <div className="relative z-10 flex items-center justify-between w-full max-w-sm gap-4">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-void-black border-2 border-electric-azure flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                        <Cpu className="w-8 h-8 text-electric-azure" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-mono text-code-grey mb-1">WALLET</p>
                                        <p className="text-sm font-mono text-white bg-white/5 px-2 py-1 rounded">0x74...f44e</p>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center relative">
                                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-electric-azure via-oracle-gold to-zk-green transform -translate-y-1/2 opacity-50"></div>
                                    <div className="w-12 h-12 rounded-lg bg-oracle-gold/20 border border-oracle-gold flex items-center justify-center z-10 relative animate-pulse">
                                        <LinkIcon className="w-6 h-6 text-oracle-gold" />
                                    </div>
                                    <div className="mt-8">
                                        <Badge className="bg-zk-green/20 text-zk-green border-zk-green/50">BOUND</Badge>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-void-black border-2 border-zk-green flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                        <FingerprintSimple className="w-8 h-8 text-zk-green" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-mono text-code-grey mb-1">IDENTITY HASH</p>
                                        <p className="text-sm font-mono text-hash-grey bg-white/5 px-2 py-1 rounded">0x9a8b...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <div>
                            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Identity Uniqueness <br /> <span className="text-oracle-gold">Without Exposure</span></h2>
                            <p className="text-code-grey text-lg">
                                Deeproof serves as a blind intermediary. We cryptographically bind a wallet to a verified identity, allowing partners to verify "Anti-Sybil" status via an API logic check—never receiving the raw user data.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                "One Person, One Wallet (Anti-Sybil)",
                                "Zero PII Shared with Partners",
                                "Just-in-Time Regulatory Oracle",
                                "GDPR-Compliant 'Right to be Forgotten'"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle weight="fill" className="w-5 h-5 text-zk-green flex-shrink-0" />
                                    <span className="text-ghost-white font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
