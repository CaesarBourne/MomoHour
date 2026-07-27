import type { Metadata } from 'next';
import './globals.css';
import { BaseUrlProvider } from '@/lib/base-url';
import { QueryProvider } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'MoMo Hour Admin Portal',
  description: 'Administer MoMo Hour bouquets, services, schedules, drops, and rewards.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BaseUrlProvider>
          <QueryProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>
            </ToastProvider>
          </QueryProvider>
        </BaseUrlProvider>
      </body>
    </html>
  );
}
