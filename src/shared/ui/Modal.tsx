"use client";
import React, { useEffect, useRef } from "react";
import { useI18n } from "@/shared/i18n/I18nContext";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
    const { t } = useI18n();
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            closeButtonRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 id="modal-title" className="text-2xl font-bold">{title}</h2>
                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-2xl"
                        aria-label={t.modal.close}
                    >
                        &times;
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;