import { useState, useEffect, useCallback } from "react";
import { AuthSession } from "@/lib/types";

export const useAuthSession = () => {
    const [authSession, setAuthSession] = useState<AuthSession | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const checkSession = useCallback(async () => {
        const storedSession = localStorage.getItem("deeproof_session");
        if (!storedSession) return;

        try {
            const session: AuthSession = JSON.parse(storedSession);

            // Check if session is expired
            if (new Date() > new Date(session.expiresAt)) {
                localStorage.removeItem("deeproof_session");
                return;
            }

            // Validate session with backend
            const apiUrl = process.env.NEXT_PUBLIC_SERVER || "http://localhost:3001";
            const response = await fetch(`${apiUrl}/api/auth/session`, {
                headers: {
                    'Authorization': `Bearer ${session.sessionToken}`
                }
            });

            if (response.ok) {
                setAuthSession(session);
                setIsEmailVerified(true);
            } else {
                localStorage.removeItem("deeproof_session");
                setAuthSession(null);
                setIsEmailVerified(false);
            }
        } catch (err) {
            console.error("Error checking session:", err);
            localStorage.removeItem("deeproof_session");
            setAuthSession(null);
            setIsEmailVerified(false);
        }
    }, []);

    const logout = useCallback(async () => {
        if (!authSession) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_SERVER || "http://localhost:3001";
            await fetch(`${apiUrl}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authSession.sessionToken}`
                }
            });
        } catch (err) {
            console.error('Error logging out:', err);
        }

        localStorage.removeItem("deeproof_session");
        setAuthSession(null);
        setIsEmailVerified(false);
    }, [authSession]);

    // Initial check
    useEffect(() => {
        checkSession();
    }, [checkSession]);

    return {
        authSession,
        isEmailVerified,
        checkSession,
        logout
    };
};
