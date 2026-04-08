'use client'

import Link from 'next/link'
import { Mail, MapPin, Phone, Eye, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import LogoKM from "@/public/assets/img/kampus-merdeka.png"
import LogoNextBlack from "@/public/assets/next-black.svg"
import LogoUNG from "@/public/assets/img/ung.png"
import LogoKemen from "@/public/assets/img/kemendikbud.png"
{/* Components */ }
import AnimatedCounter from './AnimatedCounter'
{/* Components End */ }

const footerLinks = {
    platform: [
        { name: 'Beranda', href: '/' },
        { name: 'Blog', href: '/#blog' },
        { name: 'Tentang Kami', href: '/#tentang-kami' },
    ],
    resources: [
        { name: 'Dokumentasi', href: '#' },
        { name: 'Tutorial', href: '#' },
        { name: 'FAQ', href: '#' },
        { name: 'Panduan', href: '#' },
    ],
    legal: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
    ],
}

export default function Footer({ generalSetting }: { generalSetting: any }) {
    const [viewerCount, setViewerCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const IP_STORAGE_KEY = "_ipd"

    useEffect(() => {
        (async () => {
            try {
                const ipdata = localStorage.getItem(IP_STORAGE_KEY)
                if (!ipdata) {
                    fetch("https://api.ipify.org?format=json").then(_ => _.json()).then(async (_) => {
                        const post_response = await fetch('/api/tracking', {
                            method: "post",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ ip: _?.ip })
                        })
                        const post_result = await post_response.json()
                        if (post_result.success) {
                            localStorage.setItem(IP_STORAGE_KEY, JSON.stringify({ date: post_result.data?.created_at, ip: post_result.data?.ip }))
                        }
                    }).catch(console.error);
                }

                const get_response = await fetch('/api/tracking')
                const get_result = await get_response.json()

                if (get_result.success) setViewerCount(get_result.count);
            } catch (error) {
                console.error('Error fetching viewer count:', error)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <div className="lg:w-2/5 flex-shrink-0">
                        <div className="flex items-center gap-2 mb-4">
                            <img src={generalSetting?.mbkm_icon || LogoKemen.src} alt="Logo Kemendikbud" className="h-16 w-16" />
                            <img src={LogoUNG.src} alt="Logo UNG" className="h-[62px] w-[62px] mr-[6px]" />
                            <img src={LogoKM.src} alt="Logo Kampus Merdeka" className="h-16" />
                        </div>
                        <h3 className="text-white font-medium lg:text-2xl text-xl mb-3 uppercase">
                            {generalSetting?.mbkm_location_name || process.env.NEXT_PUBLIC_APP_NAME}
                        </h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            {generalSetting?.footer_description || process.env.NEXT_PUBLIC_APP_DESCRIPTION}
                        </p>

                        <div className="space-y-2 text-sm">
                            {generalSetting?.mbkm_address && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span>{generalSetting?.mbkm_address}</span>
                                </div>
                            )}
                            {generalSetting?.mbkm_email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                    <a href={`mailto:${generalSetting?.mbkm_email}`} className="hover:text-orange-500 transition-colors">
                                        {generalSetting?.mbkm_email}
                                    </a>
                                </div>
                            )}
                            {generalSetting?.mbkm_phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                    <a href={`tel:${generalSetting?.mbkm_phone}`} className="hover:text-orange-500 transition-colors">
                                        {generalSetting?.mbkm_phone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-white font-semibold mb-4">Platform</h4>
                            <ul className="space-y-2">
                                {footerLinks.platform.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm hover:text-orange-500 transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm hover:text-orange-500 transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm hover:text-orange-500 transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-1 lg:hidden mb-4">
                {!loading && (
                    <>
                        <Eye className="h-4 w-4 text-gray-400 mb-0.5" />
                        <AnimatedCounter className="text-sm text-gray-400" value={viewerCount} />
                    </>
                )}
            </div>

            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                        <p className="text-center md:text-sm text-xs text-gray-400">
                            © {new Date().getFullYear()} {generalSetting?.mbkm_location_name || process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.
                        </p>

                        <div className="items-center justify-center gap-1 lg:flex hidden">
                            {!loading && (
                                <>
                                    <Eye className="h-4 w-4 text-gray-400 mb-0.5" />
                                    <AnimatedCounter className="text-sm text-gray-400" value={viewerCount} />
                                </>
                            )}
                        </div>

                        <div className="flex items-center md:text-sm text-xs text-gray-400 gap-1">
                            Developed with
                            <div className="flex justify-between gap-1">
                                <div className="h-4 w-4 bg-white rounded-full flex items-center justify-center md:mt-[0.075rem]">
                                    <img className="w-full h-full scale-105" src={LogoNextBlack.src} alt="" />
                                </div>
                                <span>NextJS</span>
                            </div>
                            by
                            <a href={process.env.NEXT_PUBLIC_DEV_PORTFOLIO} target='_blank' title="View portfolio" className="font-medium hover:text-primary transition-colors cursor-pointer">
                                Wahyu Tams <ExternalLink className="h-4 w-4 inline-block mb-0.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}