'use client'

import { X, Loader2 } from "lucide-react";
import React from "react";

interface ModalProps {
    isOpen: boolean;
    isAlert?: boolean;
    confirmation?: {
        negativeBtn: string;
        positiveBtn: string;
        handlePositiveBtn: () => void;
        loading?: {
            text: string;
            isLoading: boolean;
            setIsLoading: (val: boolean) => void;
        }
    } | null;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, isAlert = false, confirmation = null, onClose, title, children }: ModalProps) {
    if (isAlert) {
        if (isOpen == null) return null;
    } else {
        if (!isOpen) return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-300 p-6 flex items-center justify-between z-10">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)] text-gray-600">
                    {children}
                </div>
                {confirmation && (
                    <div className="p-6 pt-0 overflow-y-auto max-h-[calc(90vh-88px)]">
                        <div className="flex justify-end gap-3">
                            <button onClick={onClose} className="px-4 py-2 text-base bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                                {confirmation.negativeBtn}
                            </button>
                            <button 
                                onClick={() => { 
                                    confirmation.handlePositiveBtn(); 
                                    if (confirmation?.loading) {
                                        confirmation.loading.setIsLoading(true);
                                    } else {
                                        onClose();
                                    }
                                }} 
                                disabled={confirmation?.loading ? confirmation.loading.isLoading : false} 
                                className="px-4 py-2 flex gap-2 items-center justify-center text-base bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {confirmation?.loading ? (
                                    confirmation.loading.isLoading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" />{confirmation.loading.text}</>
                                    ) : confirmation.positiveBtn
                                ) : confirmation.positiveBtn}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};