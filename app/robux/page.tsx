'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Calendar, Key, CreditCard, Coins, Trophy, Sparkles } from 'lucide-react';

interface UserRobux {
    balance: number;
    lastLogin: string;
    loginStreak: number;
    gamePassExpiry: string | null;
    redeemedCodes: string[];
}

export default function RobuxPage() {
    const [activeTab, setActiveTab] = useState<'gamepass' | 'login' | 'redeem' | 'giftcard'>('gamepass');
    const [userRobux, setUserRobux] = useState<UserRobux>({
        balance: 0,
        lastLogin: '',
        loginStreak: 0,
        gamePassExpiry: null,
        redeemedCodes: []
    });
    const [redeemCode, setRedeemCode] = useState('');
    const [giftCardCode, setGiftCardCode] = useState('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        const savedData = localStorage.getItem('userRobux');
        if (savedData) {
            setUserRobux(JSON.parse(savedData));
        }
    }, []);

    const saveUserData = (data: UserRobux) => {
        setUserRobux(data);
        localStorage.setItem('userRobux', JSON.stringify(data));
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleGamePassPurchase = () => {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 5);

        const newData = {
            ...userRobux,
            gamePassExpiry: expiryDate.toISOString(),
            balance: userRobux.balance + 500
        };

        saveUserData(newData);
        showNotification('success', '🎉 Game Pass 5 Hari Aktif! +500 Robux');
    };

    const handleDailyLogin = () => {
        const today = new Date().toDateString();
        const lastLogin = new Date(userRobux.lastLogin).toDateString();

        if (lastLogin === today) {
            showNotification('error', '❌ Anda sudah login hari ini!');
            return;
        }

        const isConsecutive = new Date(userRobux.lastLogin).getTime() > Date.now() - 86400000 * 2;
        const newStreak = isConsecutive ? userRobux.loginStreak + 1 : 1;
        const reward = Math.min(50 + (newStreak * 10), 200);

        const newData = {
            ...userRobux,
            lastLogin: new Date().toISOString(),
            loginStreak: newStreak,
            balance: userRobux.balance + reward
        };

        saveUserData(newData);
        showNotification('success', `🎁 Login Berhasil! +${reward} Robux (Streak: ${newStreak} hari)`);
    };

    const handleRedeemCode = () => {
        if (!redeemCode.trim()) {
            showNotification('error', '❌ Masukkan kode redeem!');
            return;
        }

        if (userRobux.redeemedCodes.includes(redeemCode)) {
            showNotification('error', '❌ Kode sudah pernah digunakan!');
            return;
        }

        const validCodes: { [key: string]: number } = {
            'ROBUX100': 100,
            'ROBUX250': 250,
            'ROBUX500': 500,
            'WELCOME2024': 150,
            'FREEGIFT': 75,
            'SPECIAL1000': 1000
        };

        const reward = validCodes[redeemCode.toUpperCase()];

        if (reward) {
            const newData = {
                ...userRobux,
                balance: userRobux.balance + reward,
                redeemedCodes: [...userRobux.redeemedCodes, redeemCode.toUpperCase()]
            };

            saveUserData(newData);
            showNotification('success', `✅ Kode berhasil! +${reward} Robux`);
            setRedeemCode('');
        } else {
            showNotification('error', '❌ Kode tidak valid!');
        }
    };

    const handleGiftCard = () => {
        if (!giftCardCode.trim()) {
            showNotification('error', '❌ Masukkan kode gift card!');
            return;
        }

        const cardValue = Math.floor(Math.random() * 900) + 100;

        const newData = {
            ...userRobux,
            balance: userRobux.balance + cardValue
        };

        saveUserData(newData);
        showNotification('success', `💳 Gift Card Berhasil! +${cardValue} Robux`);
        setGiftCardCode('');
    };

    const isGamePassActive = userRobux.gamePassExpiry && new Date(userRobux.gamePassExpiry) > new Date();
    const daysRemaining = isGamePassActive
        ? Math.ceil((new Date(userRobux.gamePassExpiry!).getTime() - Date.now()) / 86400000)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-4 sm:py-6 md:py-12 px-3 sm:px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-4 sm:mb-6 md:mb-12"
                >
                    <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
                        <Coins className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-yellow-400" />
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-md">Robux Center</h1>
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-yellow-400" />
                    </div>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-200 px-4 font-medium drop-shadow-sm">Dapatkan Robux Gratis Setiap Hari!</p>
                </motion.div>

                {/* Balance Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 mb-4 sm:mb-6 md:mb-8 shadow-2xl border border-white/10"
                >
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg mb-1 font-medium">Saldo Robux Anda</p>
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                <Coins className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 flex-shrink-0 text-white drop-shadow-sm" />
                                <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white break-all leading-tight drop-shadow-md">
                                    {userRobux.balance.toLocaleString()}
                                </h2>
                            </div>
                        </div>
                        <Trophy className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-white/40 flex-shrink-0" />
                    </div>
                    {userRobux.loginStreak > 0 && (
                        <div className="mt-2 sm:mt-3 md:mt-4 bg-black/20 rounded-lg md:rounded-xl p-2 sm:p-2.5 md:p-3 lg:p-4 backdrop-blur-sm">
                            <p className="text-white font-semibold text-xs sm:text-sm md:text-base">🔥 Login Streak: {userRobux.loginStreak} hari</p>
                        </div>
                    )}
                </motion.div>

                {/* Notification */}
                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className={`fixed top-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-50 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 rounded-xl shadow-2xl border ${notification.type === 'success'
                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                : 'bg-rose-600 border-rose-500 text-white'
                                }`}
                        >
                            <p className="font-bold text-xs sm:text-sm md:text-base lg:text-lg drop-shadow-sm">{notification.message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 mb-4 sm:mb-6 md:mb-8">
                    {[
                        { id: 'gamepass', icon: Gift, label: 'Game Pass' },
                        { id: 'login', icon: Calendar, label: 'Login Harian' },
                        { id: 'redeem', icon: Key, label: 'Kode Redeem' },
                        { id: 'giftcard', icon: CreditCard, label: 'Gift Card' }
                    ].map((tab) => (
                        <motion.button
                            key={tab.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`p-2.5 sm:p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl font-bold text-xs sm:text-sm md:text-base lg:text-lg transition-all border ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white shadow-xl border-white/20'
                                : 'bg-slate-800/50 text-slate-200 hover:bg-slate-700/50 border-white/5 hover:border-white/10'
                                }`}
                        >
                            <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 mx-auto mb-1 md:mb-2" />
                            <span className="block leading-tight">{tab.label}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900/60 backdrop-blur-xl rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl border border-white/10"
                >
                    {activeTab === 'gamepass' && (
                        <div className="text-center">
                            <Gift className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 text-pink-400 drop-shadow-lg" />
                            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Game Pass 5 Hari</h3>
                            <p className="text-slate-200 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base lg:text-lg px-2 font-medium">
                                Dapatkan 500 Robux + Bonus harian selama 5 hari!
                            </p>

                            {isGamePassActive ? (
                                <div className="bg-emerald-500/20 border-2 border-emerald-500/50 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
                                    <p className="text-emerald-300 text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                                        ✅ Game Pass Aktif! Tersisa {daysRemaining} hari
                                    </p>
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleGamePassPurchase}
                                    className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-5 sm:px-6 md:px-8 lg:px-12 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-full font-bold text-xs sm:text-sm md:text-base lg:text-xl shadow-lg hover:shadow-pink-500/30 transition-all border border-white/10"
                                >
                                    Aktifkan Game Pass
                                </motion.button>
                            )}
                        </div>
                    )}

                    {activeTab === 'login' && (
                        <div className="text-center">
                            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 text-blue-400 drop-shadow-lg" />
                            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Login Harian</h3>
                            <p className="text-slate-200 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base lg:text-lg px-2 font-medium">
                                Login setiap hari untuk mendapatkan Robux gratis!
                            </p>
                            <div className="bg-blue-500/20 border-2 border-blue-400/50 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
                                <p className="text-blue-200 text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                                    Reward: 50-200 Robux (meningkat dengan streak!)
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDailyLogin}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 sm:px-6 md:px-8 lg:px-12 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-full font-bold text-xs sm:text-sm md:text-base lg:text-xl shadow-lg hover:shadow-blue-500/30 transition-all border border-white/10"
                            >
                                Klaim Login Harian
                            </motion.button>
                        </div>
                    )}

                    {activeTab === 'redeem' && (
                        <div className="text-center">
                            <Key className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 text-yellow-400 drop-shadow-lg" />
                            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Kode Redeem</h3>
                            <p className="text-slate-200 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base lg:text-lg px-2 font-medium">
                                Masukkan kode untuk mendapatkan Robux gratis!
                            </p>
                            <div className="max-w-md mx-auto mb-3 sm:mb-4 md:mb-6 px-2">
                                <input
                                    type="text"
                                    value={redeemCode}
                                    onChange={(e) => setRedeemCode(e.target.value)}
                                    placeholder="Masukkan kode redeem..."
                                    className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-xl bg-slate-800/80 text-white placeholder-slate-400 border-2 border-slate-600 focus:border-yellow-400 focus:outline-none text-xs sm:text-sm md:text-base lg:text-lg transition-colors"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRedeemCode}
                                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-5 sm:px-6 md:px-8 lg:px-12 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-full font-bold text-xs sm:text-sm md:text-base lg:text-xl shadow-lg hover:shadow-yellow-500/30 transition-all border border-white/10"
                            >
                                Redeem Kode
                            </motion.button>
                            <div className="mt-4 sm:mt-6 md:mt-8 bg-slate-800/50 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 mx-2 border border-white/5">
                                <p className="text-slate-300 text-xs sm:text-sm mb-2 font-medium">Kode yang tersedia:</p>
                                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-yellow-400 font-mono text-xs sm:text-sm font-bold">
                                    <span>ROBUX100</span>
                                    <span>ROBUX250</span>
                                    <span>ROBUX500</span>
                                    <span>WELCOME2024</span>
                                    <span>FREEGIFT</span>
                                    <span>SPECIAL1000</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'giftcard' && (
                        <div className="text-center">
                            <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 text-emerald-400 drop-shadow-lg" />
                            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Gift Card</h3>
                            <p className="text-slate-200 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base lg:text-lg px-2 font-medium">
                                Tukarkan kode gift card untuk mendapatkan Robux!
                            </p>
                            <div className="max-w-md mx-auto mb-3 sm:mb-4 md:mb-6 px-2">
                                <input
                                    type="text"
                                    value={giftCardCode}
                                    onChange={(e) => setGiftCardCode(e.target.value)}
                                    placeholder="Masukkan kode gift card..."
                                    className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-xl bg-slate-800/80 text-white placeholder-slate-400 border-2 border-slate-600 focus:border-emerald-400 focus:outline-none text-xs sm:text-sm md:text-base lg:text-lg transition-colors"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGiftCard}
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 sm:px-6 md:px-8 lg:px-12 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-full font-bold text-xs sm:text-sm md:text-base lg:text-xl shadow-lg hover:shadow-emerald-500/30 transition-all border border-white/10"
                            >
                                Tukar Gift Card
                            </motion.button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
