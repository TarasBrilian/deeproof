import { useState, useCallback, useRef } from 'react';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';

export function useReclaim() {
    const [proofs, setProofs] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [requestUrl, setRequestUrl] = useState<string>("");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    // Poll backend for verification status
    const startPolling = useCallback((sid: string) => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
        }

        let apiUrl = process.env.NEXT_PUBLIC_SERVER || "http://localhost:3001";
        if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
            apiUrl = `http://${apiUrl}`;
        }

        console.log('🔄 Starting polling for session:', sid);

        pollingRef.current = setInterval(async () => {
            try {
                const response = await fetch(`${apiUrl}/api/reclaim/status/${sid}`);
                const data = await response.json();

                if (data.success && data.session && data.session.status === 'VERIFIED') {
                    console.log('✅ Verification detected via polling!', data.session);

                    // Stop polling
                    if (pollingRef.current) {
                        clearInterval(pollingRef.current);
                        pollingRef.current = null;
                    }

                    const syntheticProof = {
                        identifier: data.session.sessionId,
                        verified: true,
                        fromBackend: true,
                        session: {
                            sessionId: data.session.sessionId,
                            binance_uid: data.session.binance_uid,
                            status: data.session.status
                        }
                    };

                    // Store only non-sensitive verification status
                    localStorage.setItem('verification_data', JSON.stringify({
                        sessionId: data.session.sessionId,
                        binanceUid: data.session.binance_uid,
                        verified: true
                    }));

                    setProofs([syntheticProof]);
                    setIsLoading(false);
                }
            } catch (e) {
                console.log('Polling error (will retry):', e);
            }
        }, 2000); // Poll every 2 seconds

        // Stop polling after 5 minutes
        setTimeout(() => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
                console.log('⏱️ Polling timeout reached');
            }
        }, 5 * 60 * 1000);
    }, []);

    const startVerification = useCallback(async (userId: string, walletAddress?: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch config from backend
            const params = new URLSearchParams({ userId });
            if (walletAddress) {
                params.append('userAddress', walletAddress);
            }

            let apiUrl = process.env.NEXT_PUBLIC_SERVER || "http://localhost:3001";
            if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
                apiUrl = `http://${apiUrl}`;
            }

            const response = await fetch(`${apiUrl}/api/reclaim/init?${params.toString()}`);
            const data = await response.json();

            if (!data.success || !data.data) {
                throw new Error(data.error || 'Failed to initialize verification');
            }

            const { reclaimProofRequestConfig, sessionId: sid } = data.data;
            setSessionId(sid);

            // Create ReclaimProofRequest from config
            const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
                reclaimProofRequestConfig
            );

            // Get request URL for QR code
            const url = await reclaimProofRequest.getRequestUrl();
            setRequestUrl(url);
            setIsLoading(false);

            // Start polling for backend status (this is more reliable than SDK callback)
            startPolling(sid);

            // Also start SDK session as backup (may not work with backend callback)
            await reclaimProofRequest.startSession({
                onSuccess: (proofs) => {
                    console.log('=== RECLAIM SDK onSuccess (backup) ===');
                    if (pollingRef.current) {
                        clearInterval(pollingRef.current);
                        pollingRef.current = null;
                    }
                    setProofs(proofs);
                    setIsLoading(false);
                },
                onError: (err) => {
                    console.log('SDK onError (polling may still work):', err.message);
                }
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setIsLoading(false);
        }
    }, [startPolling]);

    const reset = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
        setProofs(null);
        setError(null);
        setRequestUrl("");
        setSessionId(null);
        setIsLoading(false);
    }, []);

    return {
        proofs,
        isLoading,
        error,
        requestUrl,
        sessionId,
        startVerification,
        reset
    };
}
