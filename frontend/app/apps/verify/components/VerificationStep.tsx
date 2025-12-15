"use client";

import { ReactNode } from "react";

interface StepDescription {
    icon: ReactNode;
    text: ReactNode;
}

interface VerificationStepProps {
    title: string;
    descriptions: StepDescription[];
    children: ReactNode;
    actionElement?: ReactNode;
}

export const VerificationStep = ({
    title,
    descriptions,
    children,
    actionElement
}: VerificationStepProps) => {
    return (
        <div className="space-y-6">
            <h3 className="font-display font-bold text-2xl">{title}</h3>
            <div className="p-6 rounded-xl border border-white/10 bg-deep-charcoal h-full flex flex-col justify-between">
                <div className="space-y-4">
                    {descriptions.map((desc, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">{desc.icon}</div>
                            <p className="text-sm text-code-grey">{desc.text}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    {children}
                    {actionElement}
                </div>
            </div>
        </div>
    );
};
