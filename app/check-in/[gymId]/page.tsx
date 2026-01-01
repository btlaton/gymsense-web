/**
 * Check-In QR Code Display Page
 * 
 * A static page where gym owners can access/view the check-in QR code.
 * URL: /check-in/{gymId}
 * 
 * Query params:
 * - ?qr-only=true - Displays only the QR code (for printing services)
 */

import { Metadata } from 'next';
import QRCode from 'react-qr-code';

export const metadata: Metadata = {
  title: 'Check-In QR Code | Gymsense',
  description: 'Member check-in QR code',
};

interface CheckInPageProps {
  params: {
    gymId: string;
  };
  searchParams: {
    'qr-only'?: string;
  };
}

export default function CheckInPage({ params, searchParams }: CheckInPageProps) {
  const { gymId } = params;
  const qrValue = `https://gymsense.io/check-in/${gymId}`;
  const qrOnly = searchParams['qr-only'] === 'true';

  // QR-only mode: Display just the QR code for printing services
  if (qrOnly) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <QRCode
          value={qrValue}
          size={512}
          level="H"
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </main>
    );
  }

  // Full page mode: Display with branding
  return (
    <main className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white font-serif italic">
            gymsense
          </h1>
          <p className="text-stone-400">Member Check-In</p>
        </div>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-2xl inline-block">
          <QRCode
            value={qrValue}
            size={256}
            level="H"
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <p className="text-stone-400 text-sm">
            Members scan this code with the Gymsense app to check in
          </p>
          <p className="text-stone-600 text-xs font-mono break-all">
            {qrValue}
          </p>
        </div>
      </div>
    </main>
  );
}

