'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Terminal, LogOut } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    description: string;
}

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get('/tasks/');
                setTasks(res.data);
            } catch (err) {
                // Assume 401 means unauthorized, redirect
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [router]);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle) return;
        try {
            const res = await api.post('/tasks/', {
                title: newTaskTitle,
                description: newTaskDesc
            });
            setTasks([...tasks, res.data]);
            setNewTaskTitle('');
            setNewTaskDesc('');
        } catch (err) {
            console.error("Failed to create task", err);
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-emerald-500 font-mono">LOADING SYSTEM...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono selection:bg-emerald-500/30">
            <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-emerald-500" />
                        <span className="font-bold tracking-wider text-lg">TASK_OS_v1</span>
                    </div>
                    <Button variant="ghost" onClick={handleLogout} className="text-zinc-400 hover:text-red-400 hover:bg-red-900/10">
                        <LogOut className="h-4 w-4 mr-2" />
                        TERMINATE SESSION
                    </Button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Create Task Section */}
                <section className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-6 relative overflow-hidden group hover:border-zinc-700 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Plus className="w-32 h-32 text-emerald-500" />
                    </div>
                    <h2 className="text-lg font-bold text-emerald-400 mb-4 tracking-wide uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Inject New Protocol
                    </h2>
                    <form onSubmit={handleCreateTask} className="flex gap-4 items-end relative z-10">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs text-zinc-500 uppercase">Task Identifier</label>
                            <Input
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Enter task name..."
                                className="bg-zinc-950 border-zinc-700 text-zinc-200 focus:border-emerald-500 transition-all"
                                required
                            />
                        </div>
                        <div className="flex-[2] space-y-1">
                            <label className="text-xs text-zinc-500 uppercase">Operational Details</label>
                            <Input
                                value={newTaskDesc}
                                onChange={(e) => setNewTaskDesc(e.target.value)}
                                placeholder="Description..."
                                className="bg-zinc-950 border-zinc-700 text-zinc-200 focus:border-emerald-500 transition-all"
                            />
                        </div>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold">
                            <Plus className="h-4 w-4 mr-2" />
                            EXECUTE
                        </Button>
                    </form>
                </section>

                {/* Task Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-5 hover:border-emerald-500/30 hover:bg-zinc-900/60 transition-all group relative">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="text-zinc-500 hover:text-red-400 hover:bg-transparent">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{task.title}</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed font-sans">{task.description}</p>
                                <div className="pt-4 flex items-center gap-2">
                                    <div className="h-[1px] flex-1 bg-zinc-800 group-hover:bg-emerald-500/20 transition-colors"></div>
                                    <span className="text-[10px] text-zinc-600 font-mono">ID: {task.id.toString().padStart(4, '0')}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {tasks.length === 0 && (
                        <div className="col-span-full py-12 text-center text-zinc-600 border border-dashed border-zinc-800 rounded-lg">
                            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            NO ACTIVE PROTOCOLS FOUND
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
