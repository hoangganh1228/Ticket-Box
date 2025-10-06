import Footer from '@/src/components/layout/Footer';
import Header from '@/src/components/layout/Header';
import ReactQueryProvider from '@/src/providers/ReactQueryProvider';
import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ReactQueryProvider>
        <Header />
        {children}
        <Footer />
      </ReactQueryProvider>
    </div>
  );
}
