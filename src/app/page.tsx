"use client";

import Image from "next/image";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <section className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start" aria-label={t.home.welcome}>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-[5rem]">{t.home.welcome}</h1>
        <Image src="/logo_pexels.jpg" alt={t.home.imageAlt} width={800} height={400} className="rounded-lg shadow-lg mt-12" />
      </section>
    </div>
  );
}
