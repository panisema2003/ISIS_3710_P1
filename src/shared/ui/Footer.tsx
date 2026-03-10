"use client";

import React from "react";
import { useI18n } from "@/shared/i18n/I18nContext";

const Footer = () => {
    const { t } = useI18n();

    return (
        <footer className="bg-gray-800 text-white p-4 text-center" role="contentinfo">
            &copy; {new Date().getFullYear()} {t.nav.brand}. {t.footer.rights}
        </footer>
    );
};

export default Footer;