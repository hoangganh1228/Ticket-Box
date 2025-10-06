// 'use client';

// import {usePathname} from 'next/navigation';
// import React from "react";
// import Header from '../components/layout/Header';

// export default function LayoutWrapper({children}: Readonly<{
//     children: React.ReactNode;
// }>) {
//     const pathname = usePathname();

//     const hideHeaderRoutes = ['/login', '/register'];
//     const shouldShowHeader = !hideHeaderRoutes.includes(pathname);


//     return (
//         <>
//             {shouldShowHeader && <Header/>}
//             <main className={`${shouldShowHeader ? 'container mx-auto' : ''}`}>{children}</main>
//         </>
//     );
// }
