"use client";

import { Container } from "@/components/ui/Container";
import {
    QrCode,
    Database,
    EyeSlash,
} from "@phosphor-icons/react";

export function Features() {
    return (
        <section>
            <Container>
                <div className="border-t border-white/10 pt-24">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="mx-auto w-16 h-16 rounded-full bg-deep-charcoal border border-white/10 flex items-center justify-center mb-6">
                                <EyeSlash className="w-8 h-8 text-code-grey" />
                            </div>
                            <h4 className="font-display font-bold text-lg mb-2">Full Privacy</h4>
                            <p className="text-sm text-code-grey">Deeproof operates as a black box. Input: Hash. Output: Signature.</p>
                        </div>
                        <div className="p-6">
                            <div className="mx-auto w-16 h-16 rounded-full bg-deep-charcoal border border-white/10 flex items-center justify-center mb-6">
                                <Database className="w-8 h-8 text-code-grey" />
                            </div>
                            <h4 className="font-display font-bold text-lg mb-2">Encrypted Trail</h4>
                            <p className="text-sm text-code-grey">We maintain an encrypted link for regulatory recovery, inaccessible to the public.</p>
                        </div>
                        <div className="p-6">
                            <div className="mx-auto w-16 h-16 rounded-full bg-deep-charcoal border border-white/10 flex items-center justify-center mb-6">
                                <QrCode className="w-8 h-8 text-code-grey" />
                            </div>
                            <h4 className="font-display font-bold text-lg mb-2">Reclaim Powered</h4>
                            <p className="text-sm text-code-grey">Uses Reclaim Protocol to generate proofs from existing CEX accounts.</p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
