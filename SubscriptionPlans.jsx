import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';

const NAV_TABS = [
    { id: 'home', label: 'Home / Dashboard' },
    { id: 'leaderboard', label: 'Leaderboard', gated: true },
    { id: 'stats', label: 'Personal Stats', gated: true },
    { id: 'shop', label: 'Shop (Amber)' , gated: true },
    { id: 'customize', label: 'Character Customization', gated: true },
    { id: 'quests', label: 'Quests', gated: true },
    { id: 'account', label: 'Account / Settings' }
];

const leaderboardRows = [
    { rank: 1, name: 'AshenWarden', score: 9800 },
    { rank: 2, name: 'DuskRunner', score: 9420 },
    { rank: 3, name: 'EmberScribe', score: 9015 },
    { rank: 4, name: 'NightChord', score: 8740 },
    { rank: 5, name: 'VoidRider', score: 8501 }
];

const statRows = [
    { label: 'Gaming Streak', value: 86 },
    { label: 'Playlist Completion', value: 74 },
    { label: 'Focus Sessions', value: 62 },
    { label: 'Boss Clears', value: 91 }
];

const shopItems = [
    { name: 'Cinder Cloak', price: 450 },
    { name: 'Infernal Halo', price: 620 },
    { name: 'Ebon Wing Trail', price: 900 },
    { name: 'Ashfire Blade Skin', price: 1200 }
];

const characterStyles = ['Wraith', 'Ember Knight', 'Rune Bard', 'Shadow Alchemist'];

const dailyQuests = [
    { title: 'Win 2 matches', progress: 50, reward: 120 },
    { title: 'Listen to 45 minutes', progress: 80, reward: 90 },
    { title: 'Complete 1 focus session', progress: 20, reward: 100 }
];

const weeklyQuests = [
    { title: 'Reach top 10 in a ladder', progress: 40, reward: 500 },
    { title: 'Build a 25-track ritual playlist', progress: 68, reward: 420 }
];

const PAYWALL_PRICING = {
    monthly: '$9.99/month',
    yearly: '$80/year'
};

const getAccessState = (accountMode) => {
    if (accountMode === 'logged_out') return 'logged_out';
    if (accountMode === 'expired') return 'expired';
    if (accountMode === 'no_subscription') return 'no_subscription';
    return 'active';
};

const AccessGate = ({ accessState, children }) => {
    if (accessState === 'active') return children;

    const monthlyPriceId = process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID || 'Not configured';
    const yearlyPriceId = process.env.REACT_APP_STRIPE_YEARLY_PRICE_ID || 'Not configured';

    if (accessState === 'logged_out') {
        return (
            <div className="rounded-2xl border border-fuchsia-500/40 bg-black/60 p-6 shadow-[0_0_30px_rgba(217,70,239,0.25)]">
                <h3 className="text-xl font-semibold text-fuchsia-200">Sign in to enter the Cinder Vault</h3>
                <p className="mt-2 text-sm text-purple-100/80">Log in to unlock subscription options and feature access.</p>
            </div>
        );
    }

    if (accessState === 'expired') {
        return (
            <div className="rounded-2xl border border-amber-500/60 bg-black/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.25)]">
                <h3 className="text-xl font-semibold text-amber-200">Subscription expired</h3>
                <p className="mt-2 text-sm text-purple-100/80">Renew to restore access to leaderboard, stats, shop, customization, and quests.</p>
                <button className="mt-4 rounded-lg bg-amber-500 px-4 py-2 font-medium text-black transition hover:bg-amber-400">Renew now</button>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-cyan-400/50 bg-black/60 p-6 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
            <h3 className="text-xl font-semibold text-cyan-200">Premium required</h3>
            <p className="mt-2 text-sm text-purple-100/80">Upgrade to access this section.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-fuchsia-400/40 bg-black/50 p-4">
                    <p className="font-semibold">Monthly</p>
                    <p className="text-fuchsia-300">{PAYWALL_PRICING.monthly}</p>
                    <p className="mt-1 text-xs text-purple-200/70">{monthlyPriceId}</p>
                </div>
                <div className="rounded-xl border border-fuchsia-400/40 bg-black/50 p-4">
                    <p className="font-semibold">Yearly</p>
                    <p className="text-fuchsia-300">{PAYWALL_PRICING.yearly}</p>
                    <p className="mt-1 text-xs text-purple-200/70">{yearlyPriceId}</p>
                </div>
            </div>
        </div>
    );
};

const SubscriptionPlans = () => {
    const canvasRef = useRef(null);
    const [activeTab, setActiveTab] = useState('home');
    const [accountMode, setAccountMode] = useState('no_subscription');
    const [selectedStyle, setSelectedStyle] = useState(characterStyles[0]);
    const [isLoading, setIsLoading] = useState(false);
    const { scrollYProgress } = useScroll();
    const emberParallax = useTransform(scrollYProgress, [0, 1], [-30, 80]);

    const accessState = useMemo(() => getAccessState(accountMode), [accountMode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 5;

        const torus = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.8, 0.25, 100, 16),
            new THREE.MeshStandardMaterial({ color: '#a855f7', emissive: '#4c1d95', metalness: 0.6, roughness: 0.2 })
        );
        torus.position.set(-1.2, 0.6, 0);

        const orb = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.7, 1),
            new THREE.MeshStandardMaterial({ color: '#f97316', emissive: '#7c2d12', wireframe: true })
        );
        orb.position.set(1.5, -0.4, -0.5);

        const lightA = new THREE.PointLight('#f97316', 1.5, 20);
        lightA.position.set(3, 2, 2);
        const lightB = new THREE.PointLight('#a855f7', 1.2, 20);
        lightB.position.set(-3, -2, 2);

        const particleCount = 300;
        const particles = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
            particles[i] = (Math.random() - 0.5) * 10;
            particles[i + 1] = (Math.random() - 0.5) * 8;
            particles[i + 2] = (Math.random() - 0.5) * 10;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
        const particleMaterial = new THREE.PointsMaterial({ color: '#fb923c', size: 0.04, transparent: true, opacity: 0.8 });
        const particleCloud = new THREE.Points(particleGeometry, particleMaterial);

        scene.add(torus, orb, lightA, lightB, particleCloud);

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            torus.rotation.x += 0.004;
            torus.rotation.y += 0.006;
            orb.rotation.x -= 0.003;
            orb.rotation.y += 0.005;
            particleCloud.rotation.y += 0.0009;
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
            particleGeometry.dispose();
            particleMaterial.dispose();
            torus.geometry.dispose();
            torus.material.dispose();
            orb.geometry.dispose();
            orb.material.dispose();
            renderer.dispose();
        };
    }, []);

    const handleTabChange = (tabId) => {
        if (tabId === activeTab) return;
        setIsLoading(true);
        setActiveTab(tabId);
        setTimeout(() => setIsLoading(false), 350);
    };

    const renderSection = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            { label: 'Current Rank', value: '#148' },
                            { label: 'Amber Balance', value: '2,480' },
                            { label: 'Quest Streak', value: '18 days' }
                        ].map((item) => (
                            <motion.div key={item.label} whileHover={{ scale: 1.03 }} className="rounded-xl border border-fuchsia-500/40 bg-black/50 p-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                                <p className="text-sm text-purple-200/80">{item.label}</p>
                                <p className="mt-2 text-2xl font-bold text-fuchsia-200">{item.value}</p>
                            </motion.div>
                        ))}
                    </div>
                );
            case 'leaderboard':
                return (
                    <AccessGate accessState={accessState}>
                        <div className="overflow-hidden rounded-xl border border-fuchsia-500/30 bg-black/50">
                            {leaderboardRows.map((row) => (
                                <div key={row.rank} className="flex items-center justify-between border-b border-purple-800/40 px-4 py-3 last:border-b-0">
                                    <p className="font-semibold text-fuchsia-200">#{row.rank} {row.name}</p>
                                    <p className="text-purple-100">{row.score.toLocaleString()} pts</p>
                                </div>
                            ))}
                        </div>
                    </AccessGate>
                );
            case 'stats':
                return (
                    <AccessGate accessState={accessState}>
                        <div className="space-y-4 rounded-xl border border-cyan-500/30 bg-black/50 p-4">
                            {statRows.map((stat) => (
                                <div key={stat.label}>
                                    <div className="mb-1 flex items-center justify-between text-sm text-purple-100">
                                        <span>{stat.label}</span>
                                        <span>{stat.value}%</span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-purple-950/70">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.value}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-400"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccessGate>
                );
            case 'shop':
                return (
                    <AccessGate accessState={accessState}>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {shopItems.map((item) => (
                                <motion.div key={item.name} whileHover={{ y: -5 }} className="rounded-xl border border-amber-500/40 bg-black/50 p-4 shadow-[0_0_18px_rgba(251,146,60,0.2)]">
                                    <p className="font-semibold text-orange-200">{item.name}</p>
                                    <p className="mt-2 text-sm text-purple-100">{item.price} Amber</p>
                                </motion.div>
                            ))}
                        </div>
                    </AccessGate>
                );
            case 'customize':
                return (
                    <AccessGate accessState={accessState}>
                        <div className="grid gap-4 lg:grid-cols-2">
                            <div className="rounded-xl border border-fuchsia-500/30 bg-black/50 p-4">
                                <p className="font-semibold text-fuchsia-200">Character Preview</p>
                                <motion.div
                                    animate={{ rotate: [0, 2, -2, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="mt-4 flex h-44 items-center justify-center rounded-lg border border-purple-700/50 bg-gradient-to-b from-purple-950 to-black text-xl text-purple-100"
                                >
                                    {selectedStyle}
                                </motion.div>
                            </div>
                            <div className="rounded-xl border border-fuchsia-500/30 bg-black/50 p-4">
                                <p className="font-semibold text-fuchsia-200">Styles</p>
                                <div className="mt-3 space-y-2">
                                    {characterStyles.map((style) => (
                                        <button
                                            key={style}
                                            onClick={() => setSelectedStyle(style)}
                                            className={`w-full rounded-md border px-3 py-2 text-left transition ${selectedStyle === style ? 'border-fuchsia-300 bg-fuchsia-500/20' : 'border-purple-700/60 hover:border-fuchsia-400/60'}`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </AccessGate>
                );
            case 'quests':
                return (
                    <AccessGate accessState={accessState}>
                        <div className="space-y-4">
                            <div>
                                <h3 className="mb-2 text-lg font-semibold text-orange-200">Daily Quests (refreshes at midnight — timer integration pending)</h3>
                                <div className="grid gap-3 md:grid-cols-3">
                                    {dailyQuests.map((quest) => (
                                        <div key={quest.title} className="rounded-xl border border-orange-500/40 bg-black/50 p-4">
                                            <p className="font-medium">{quest.title}</p>
                                            <p className="mt-1 text-xs text-orange-200">Reward: {quest.reward} Amber</p>
                                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-purple-950/70">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${quest.progress}%` }} className="h-full bg-orange-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-2 text-lg font-semibold text-cyan-200">Weekly Quests (resets every Monday — timer integration pending)</h3>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {weeklyQuests.map((quest) => (
                                        <div key={quest.title} className="rounded-xl border border-cyan-500/40 bg-black/50 p-4">
                                            <p className="font-medium">{quest.title}</p>
                                            <p className="mt-1 text-xs text-cyan-200">Reward: {quest.reward} Amber</p>
                                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-purple-950/70">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${quest.progress}%` }} className="h-full bg-cyan-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </AccessGate>
                );
            case 'account':
                return (
                    <div className="space-y-4 rounded-xl border border-purple-600/50 bg-black/50 p-4">
                        <h3 className="text-lg font-semibold text-fuchsia-200">Access Simulator</h3>
                        <p className="text-sm text-purple-100/80">Use this to test logged-in/subscription states and view gate behavior.</p>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { id: 'logged_out', label: 'Logged Out' },
                                { id: 'no_subscription', label: 'Logged In, No Subscription' },
                                { id: 'expired', label: 'Subscription Expired' },
                                { id: 'active', label: 'Subscription Active' }
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setAccountMode(mode.id)}
                                    className={`rounded-md border px-3 py-2 text-sm transition ${accountMode === mode.id ? 'border-fuchsia-300 bg-fuchsia-500/20' : 'border-purple-700/60 hover:border-fuchsia-400/60'}`}
                                >
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-cyan-200">Current access: <span className="font-semibold uppercase">{accessState}</span></p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-purple-950 to-black text-white">
            <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-90" />
            <motion.div style={{ y: emberParallax }} className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(192,132,252,0.22),transparent_45%),radial-gradient(circle_at_40%_80%,rgba(244,63,94,0.14),transparent_40%)]" />

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-6">
                <header className="mb-6 rounded-2xl border border-fuchsia-500/40 bg-black/55 p-4 shadow-[0_0_30px_rgba(168,85,247,0.25)] backdrop-blur">
                    <h1 className="text-2xl font-black tracking-wide text-fuchsia-200 sm:text-3xl">StatVault: CinderLog</h1>
                    <p className="mt-1 text-sm text-purple-100/80">Dark fantasy command center for gaming, music, and ember-forged progression.</p>
                    <div className="mt-4 overflow-x-auto">
                        <nav className="flex min-w-max gap-2">
                            {NAV_TABS.map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`rounded-full border px-3 py-2 text-sm transition ${activeTab === tab.id ? 'border-fuchsia-200 bg-fuchsia-500/30 text-white shadow-[0_0_18px_rgba(217,70,239,0.45)]' : 'border-purple-700/70 bg-black/40 text-purple-100 hover:border-fuchsia-400/70'}`}
                                >
                                    {tab.label}
                                </motion.button>
                            ))}
                        </nav>
                    </div>
                </header>

                <motion.section whileHover={{ scale: 1.01 }} className="mb-6 rounded-2xl border border-cyan-400/40 bg-black/45 p-4 shadow-[0_0_24px_rgba(34,211,238,0.2)]">
                    <p className="text-xs uppercase tracking-widest text-cyan-200">Premium Access</p>
                    <p className="mt-1 text-sm text-purple-100/90">Unlock all sections with CinderLog Premium — {PAYWALL_PRICING.monthly} or {PAYWALL_PRICING.yearly}.</p>
                </motion.section>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex h-56 items-center justify-center"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
                                className="h-12 w-12 rounded-full border-2 border-fuchsia-300 border-t-transparent"
                            />
                        </motion.div>
                    ) : (
                        <motion.main
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.28 }}
                            className="rounded-2xl border border-purple-700/50 bg-black/45 p-4 shadow-[0_0_26px_rgba(126,34,206,0.2)] backdrop-blur"
                        >
                            {renderSection()}
                        </motion.main>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SubscriptionPlans;
