import { useEffect, useState } from "react";

export default function useCountDown( expiredAt: string | null,  onExpire?: () => void) {
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        if(!expiredAt) return;

        function updateRemaining() {
            const diff = new Date(expiredAt as string).getTime() - Date.now();
            if (diff <= 0) {
                setRemaining(0);
                if (onExpire) onExpire();
            } else {
                setRemaining(Math.floor(diff / 1000));
            }
        }
        updateRemaining();
        const interval = setInterval(updateRemaining, 1000);

        return () => clearInterval(interval);
    },[expiredAt, onExpire]);

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    return { minutes, seconds, isExpired: remaining <= 0 };
}