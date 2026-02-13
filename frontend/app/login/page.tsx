'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const res = await api.post('/auth/access-token', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            localStorage.setItem('token', res.data.access_token);
            router.push('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-100 font-mono selection:bg-emerald-500/30">
            <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900/50 border border-zinc-800 rounded-lg shadow-2xl backdrop-blur-sm">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter text-emerald-400">SYSTEM ACCESS</h1>
                    <p className="text-zinc-500 text-sm tracking-widest">SECURE LOGIN REQUIRED</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-400 bg-red-900/10 border border-red-900/50 rounded flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-500">Email Identifier</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                            <Input
                                type="email"
                                placeholder="user@system.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-300 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 transition-all placeholder:text-zinc-700"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-500">Password Key</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-300 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 transition-all placeholder:text-zinc-700"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold tracking-wide transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.5)]">
                        AUTHENTICATE
                    </Button>
                </form>

                <div className="text-center text-sm text-zinc-600">
                    No access credentials?{' '}
                    <Link href="/register" className="text-emerald-500 hover:text-emerald-400 underline underline-offset-4 decoration-emerald-500/30">
                        Request Registration
                    </Link>
                </div>
            </div>
        </div>
    );
}
