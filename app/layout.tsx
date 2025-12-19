import type { Metadata } from 'next';
import { Hanken_Grotesk, Pacifico } from 'next/font/google';
import './globals.css';

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
});

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GymSense',
  description: 'Modern gym management for the modern gym',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${hanken.variable} ${pacifico.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

