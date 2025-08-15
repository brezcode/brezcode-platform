import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BrezCode - AI-Powered Breast Health Platform',
  description: 'Comprehensive breast health assessment with AI-powered risk analysis and personalized recommendations based on medical research.',
  keywords: 'breast health, breast cancer risk, medical assessment, AI health, health screening',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}