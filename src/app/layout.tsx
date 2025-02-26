import './globals.css';

import { cn } from '@/src/lib/utils';
import { notoSans } from '@/src/lib/fonts';
import { Toaster } from '../components/ui/toaster';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen bg-background font-sans antialiased', notoSans.className)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
