import React, { useEffect, useState } from 'react';
import Card from './Card';

const Dashboard = ({ items, onRefresh, apiUrl }) => {
    const [showArchived, setShowArchived] = useState(false);

    // Filter items based on status
    const activeItems = items.filter(i => i.status !== 'archived' && i.status !== 'deleted');
    const archivedItems = items.filter(i => i.status === 'archived');

    const tasks = activeItems.filter(i => i.tags.toLowerCase().includes('action') || i.tags.toLowerCase().includes('todo'));
    const knowledge = activeItems.filter(i => !i.tags.toLowerCase().includes('action') && !i.tags.toLowerCase().includes('todo'));

    return (
        <div>
            {/* View Toggle */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowArchived(!showArchived)}
                    className={`text-xs font-medium px-4 py-2 rounded-lg border transition-all flex items-center gap-2
            ${showArchived ? 'bg-zinc-800 text-zinc-200 border-zinc-600' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-700'}`}
                >
                    {showArchived ? 'Hide Archived' : 'Show Archived Items'}
                    {showArchived && <span className="bg-zinc-700 px-1.5 rounded-full text-[10px]">{archivedItems.length}</span>}
                </button>
            </div>

            {!showArchived ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Actionable Tasks Column */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Actionable Tasks</h2>
                            <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full text-xs">{tasks.length}</span>
                        </div>

                        <div className="space-y-4">
                            {tasks.map((item) => (
                                <Card key={item.id} item={item} onRefresh={onRefresh} apiUrl={apiUrl} />
                            ))}
                            {tasks.length === 0 && (
                                <div className="text-zinc-600 italic text-center py-10 border border-dashed border-zinc-800 rounded-lg">
                                    No pending tasks.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Knowledge Grains Column */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
                            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Knowledge Grains</h2>
                            <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full text-xs">{knowledge.length}</span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {knowledge.map((item) => (
                                <Card key={item.id} item={item} onRefresh={onRefresh} apiUrl={apiUrl} />
                            ))}
                            {knowledge.length === 0 && (
                                <div className="text-zinc-600 italic text-center py-10 border border-dashed border-zinc-800 rounded-lg">
                                    Feed is empty.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            ) : (
                /* Archived View */
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1 bg-zinc-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-zinc-400 tracking-tight">Archived Items</h2>
                        <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full text-xs">{archivedItems.length}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
                        {archivedItems.map((item) => (
                            <Card key={item.id} item={item} onRefresh={onRefresh} apiUrl={apiUrl} />
                        ))}
                        {archivedItems.length === 0 && (
                            <div className="col-span-full text-zinc-600 italic text-center py-12 border border-dashed border-zinc-800 rounded-lg">
                                No archived items.
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Dashboard;
