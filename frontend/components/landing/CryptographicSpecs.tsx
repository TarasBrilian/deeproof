"use client";

import { Container } from "@/components/ui/Container";
import {
    Function,
    Key,
    LockKey
} from "@phosphor-icons/react";

export function CryptographicSpecs() {
    return (
        <section className="mb-32 bg-deep-charcoal/30 py-20 border-y border-white/5">
            <Container>
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Column 1: Cryptographic Logic */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                <Function className="w-6 h-6 text-code-grey" />
                            </div>
                            <h3 className="font-display font-bold text-2xl">Cryptographic Specifications</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 rounded-xl bg-void-black border border-white/10 font-mono text-sm">
                                <p className="text-code-grey mb-2">// 1. Hash Normalization (Blind Matching)</p>
                                <p className="text-white mb-4">
                                    <span className="text-proof-purple">H</span> = <span className="text-electric-azure">SHA256</span>(normalize(<span className="text-zk-green">email</span>))
                                </p>
                                <p className="text-code-grey text-xs italic opacity-60">
                                    *Inputs are trimmed and lowercased before hashing to ensure determinism.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-void-black border border-white/10 font-mono text-sm">
                                <p className="text-code-grey mb-2">// 2. Oracle Signature (JIT Attestation)</p>
                                <p className="text-white">
                                    <span className="text-oracle-gold">Sig</span> = <span className="text-electric-azure">Sign</span><sub>sk</sub>(Wallet || Expiry || Status)
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-void-black border border-white/10 font-mono text-sm">
                                <p className="text-code-grey mb-2">// 3. On-Chain Verification</p>
                                <p className="text-white">
                                    <span className="text-zk-green">Valid</span> = <span className="text-electric-azure">ecrecover</span>(Sig, hash) == <span className="text-protocol-cyan">ORACLE_ADMIN</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Encryption Standard */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                <Key className="w-6 h-6 text-code-grey" />
                            </div>
                            <h3 className="font-display font-bold text-2xl">AES-256 Encryption Standard</h3>
                        </div>

                        <div className="prose prose-invert max-w-none text-code-grey text-sm mb-6">
                            <p>
                                For regulatory compliance, we maintain an encrypted recovery trail using
                                <span className="text-white font-mono mx-1">AES-256-GCM</span>
                                (Galois/Counter Mode). This ensures authorized recovery while preserving privacy against casual leaks.
                            </p>
                        </div>

                        <div className="relative p-8 rounded-xl bg-void-black border border-white/10 flex flex-col gap-4 items-center justify-center">
                            {/* Visual Flow for Encryption */}
                            <div className="w-full flex items-center justify-between font-mono text-xs">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="px-3 py-1 bg-white/10 rounded text-white">Plaintext</div>
                                    <div className="h-8 w-[1px] bg-white/20"></div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="px-3 py-1 bg-oracle-gold/20 text-oracle-gold rounded border border-oracle-gold/30">256-bit Key</div>
                                    <div className="h-8 w-[1px] bg-oracle-gold/30"></div>
                                </div>
                            </div>

                            <div className="w-full p-4 rounded bg-deep-charcoal border border-white/10 text-center">
                                <p className="font-bold text-white mb-1">AES-GCM Cipher</p>
                                <p className="text-[10px] text-code-grey">IV (96-bit) + Auth Tag (128-bit)</p>
                            </div>

                            <div className="h-6 w-[1px] bg-white/20"></div>

                            <div className="px-4 py-2 bg-zk-green/10 text-zk-green border border-zk-green/20 rounded font-mono text-sm flex items-center gap-2">
                                <LockKey className="w-4 h-4" />
                                Encrypted Data
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
