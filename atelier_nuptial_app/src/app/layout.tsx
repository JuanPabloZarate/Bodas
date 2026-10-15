import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { WeddingStoreProvider } from '@/context/wedding-store';
import { ProspectsProvider } from '@/context/prospects-store';

export const metadata: Metadata = {
  title: 'Atelier Nuptial — Julia & Pedro | Tuscany 2026',
  description:
    'Celebration of Unity: Julia Rossi & Pedro Silva. Villa Bellissima, Greve in Chianti, Tuscany, Italy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
        <WeddingStoreProvider>
          <ProspectsProvider>
            <Header />
            <main className="flex-1 w-full pt-20">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </ProspectsProvider>
        </WeddingStoreProvider>
      </body>
    </html>
  );
}
