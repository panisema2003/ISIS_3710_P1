"use client";

import { I18nProvider } from "@/shared/i18n/I18nContext";
import Header from "@/shared/ui/Header";
import Footer from "@/shared/ui/Footer";
import Notification from "@/shared/ui/Notification";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <Header />
      <Notification />
      <main id="main-content">
        {children}
      </main>
      <Footer />
    </I18nProvider>
  );
}
