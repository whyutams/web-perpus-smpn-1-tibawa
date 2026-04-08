'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSInit() {
    const pathname = usePathname();

    useEffect(() => {
        AOS.init({
            duration: 600,
            once: true,
            offset: 30,
        });
    }, []);

    useEffect(() => {
        AOS.refresh();
    }, [pathname]);

    return null;
}