'use client'

import { ArrowLeft, SearchX } from 'lucide-react'
import Link from 'next/link'

export default function NotFoundPage() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6">
                <SearchX className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Halaman Tidak Ditemukan
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
            </p>
            <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Beranda
            </Link>
        </div>
    )
}