'use client'

import { useState } from 'react'
import { User, Mail, Phone, Shield, Edit2, Save, X, Loader2, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Modal from '@/app/components/Modal'

interface ProfilePageProps {
    user: {
        id: string
        username: string
        nama_lengkap: string
        email: string | null
        telepon: string | null
        role: string
        foto_url: string | null
    }
}

export default function ProfilePage({ user }: ProfilePageProps) {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const [formData, setFormData] = useState({
        nama_lengkap: user.nama_lengkap,
        email: user.email || '',
        telepon: user.telepon || '',
    })

    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setErrorMessage('')
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        })
    }

    const handleSaveProfile = async () => {
        try {
            setLoading(true)
            setErrorMessage('')

            // Validasi
            if (!formData.nama_lengkap.trim()) {
                setErrorMessage('Nama lengkap tidak boleh kosong')
                setLoading(false)
                return
            }

            // TODO: Implement API call to update profile
            // const response = await fetch('/api/profile', {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // })

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            setSuccessMessage('Profil berhasil diperbarui!')
            setShowSuccessModal(true)
            setIsEditing(false)

        } catch (error) {
            console.error('Error updating profile:', error)
            setErrorMessage('Gagal memperbarui profil')
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = async () => {
        try {
            setLoading(true)
            setErrorMessage('')

            // Validasi
            if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
                setErrorMessage('Semua field password harus diisi')
                setLoading(false)
                return
            }

            if (passwordData.new_password !== passwordData.confirm_password) {
                setErrorMessage('Password baru dan konfirmasi tidak cocok')
                setLoading(false)
                return
            }

            if (passwordData.new_password.length < 6) {
                setErrorMessage('Password baru minimal 6 karakter')
                setLoading(false)
                return
            }

            // TODO: Implement API call to change password
            // const response = await fetch('/api/profile/password', {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         user_id: user.id,
            //         old_password: passwordData.old_password,
            //         new_password: passwordData.new_password
            //     })
            // })

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            setSuccessMessage('Password berhasil diubah!')
            setShowSuccessModal(true)
            setShowPasswordModal(false)
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' })

        } catch (error) {
            console.error('Error changing password:', error)
            setErrorMessage('Gagal mengubah password')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setFormData({
            nama_lengkap: user.nama_lengkap,
            email: user.email || '',
            telepon: user.telepon || '',
        })
        setIsEditing(false)
        setErrorMessage('')
    }

    return (
        <div className="px-4 py-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Profil Saya</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola informasi profil Anda</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Edit2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
            )}

            {/* Profile Picture */}
            <div className="flex flex-col items-center py-6">
                {user.foto_url ? (
                    <img
                        src={user.foto_url}
                        alt={user.nama_lengkap}
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-100">
                        {user.nama_lengkap.charAt(0).toUpperCase()}
                    </div>
                )}
                <h2 className="text-lg font-bold text-gray-900 mt-4">{user.nama_lengkap}</h2>
                <p className="text-sm text-gray-500">@{user.username}</p>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">

                {/* Nama Lengkap */}
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Nama Lengkap
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            name="nama_lengkap"
                            value={formData.nama_lengkap}
                            onChange={handleChange}
                            disabled={!isEditing || loading}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-accent/30 focus:border-accent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                            placeholder="Masukkan nama lengkap"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing || loading}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-accent/30 focus:border-accent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                            placeholder="email@example.com"
                        />
                    </div>
                </div>

                {/* Telepon */}
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Telepon
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="tel"
                            name="telepon"
                            value={formData.telepon}
                            onChange={handleChange}
                            disabled={!isEditing || loading}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-accent/30 focus:border-accent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                            placeholder="08123456789"
                        />
                    </div>
                </div>

                {/* Username (Read Only) */}
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Username
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={user.username}
                            disabled
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-gray-50 cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Role (Read Only) */}
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Role
                    </label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={user.role === 'admin' ? 'Administrator' : 'Guru'}
                            disabled
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-gray-50 cursor-not-allowed capitalize"
                        />
                    </div>
                </div>

            </div>

            {/* Action Buttons */}
            {isEditing ? (
                <div className="flex gap-3">
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Batal
                    </button>
                    <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Simpan
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                >
                    <Lock className="w-4 h-4" />
                    Ubah Password
                </button>
            )}

            {/* Change Password Modal */}
            <Modal
                isOpen={showPasswordModal}
                onClose={() => !loading && setShowPasswordModal(false)}
                title="Ubah Password"
                confirmation={{
                    negativeBtn: 'Batal',
                    positiveBtn: 'Ubah Password',
                    handlePositiveBtn: handleChangePassword,
                    loading: {
                        text: 'Mengubah...',
                        isLoading: loading,
                        setIsLoading: setLoading
                    }
                }}
            >
                <div className="space-y-4">
                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                            <p className="text-sm text-red-600">{errorMessage}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Password Lama
                        </label>
                        <input
                            type="password"
                            name="old_password"
                            value={passwordData.old_password}
                            onChange={handlePasswordChange}
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:outline-none focus:ring-accent/30 focus:border-accent transition-all disabled:bg-gray-50"
                            placeholder="Masukkan password lama"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Password Baru
                        </label>
                        <input
                            type="password"
                            name="new_password"
                            value={passwordData.new_password}
                            onChange={handlePasswordChange}
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:outline-none focus:ring-accent/30 focus:border-accent transition-all disabled:bg-gray-50"
                            placeholder="Masukkan password baru (min. 6 karakter)"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Konfirmasi Password Baru
                        </label>
                        <input
                            type="password"
                            name="confirm_password"
                            value={passwordData.confirm_password}
                            onChange={handlePasswordChange}
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:outline-none focus:ring-accent/30 focus:border-accent transition-all disabled:bg-gray-50"
                            placeholder="Konfirmasi password baru"
                        />
                    </div>
                </div>
            </Modal>

            {/* Success Modal */}
            <Modal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false)
                    setSuccessMessage('')
                    router.refresh()
                }}
                title="Berhasil!"
            >
                <div className="flex flex-col items-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Save className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-700 text-sm text-center">
                        {successMessage}
                    </p>
                </div>
            </Modal>

        </div>
    )
}