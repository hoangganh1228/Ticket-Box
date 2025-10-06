"use client";

import {usePathname} from "next/navigation";

export function useEventId() {
    const pathname = usePathname();

    const match = pathname.match(/\/organizer\/events\/([^/]+)/);
    return match ? match[1] : null;
}
