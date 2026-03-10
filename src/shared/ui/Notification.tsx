"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function Notification() {
  const { message, type, hideNotification } = useNotificationStore();
  const { t } = useI18n();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, hideNotification]);

  if (!message) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`fixed top-5 right-5 p-4 rounded-lg text-white ${bgColor} z-50 flex items-center gap-3`}
    >
      <span>{message}</span>
      <button
        onClick={hideNotification}
        className="ml-2 text-white hover:text-gray-200 font-bold"
        aria-label={t.notification.close}
      >
        &times;
      </button>
    </div>
  );
}