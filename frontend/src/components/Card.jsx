import React, { useState } from 'react';

const Card = ({ item, onRefresh, apiUrl }) => {
    const isMedical = item.tags.includes('Medical');
    const isTheology = item.tags.includes('Theology');
    const isTask = item.tags.toLowerCase().includes('action') || item.tags.toLowerCase().includes('todo');

    const [showConvertMenu, setShowConvertMenu] = useState(false);

    const accentColor = isMedical
        ? 'border-emerald-500/50 bg-emerald-500/5'
        : isTheology
            ? 'border-purple-500/50 bg-purple-500/5'
            : 'border-zinc-700 bg-zinc-800/50';

    const handleStatusUpdate = async (status) => {
        try {
            await fetch(`${apiUrl}/items/${item.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            onRefresh();
        } catch (e) {
            console.error(e);
            alert("API Error: Check connection settings.");
        }
    };

    const handleConvert = async (taskContent) => {
        try {
            await fetch(`${apiUrl}/items/${item.id}/convert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_content: taskContent })
            });
            onRefresh();
        } catch (e) {
            console.error(e);
            alert("API Error: Check connection settings.");
        }
    };

    const handleGoogleDoc = () => {
        const content = `${item.summary}\n\n${item.content || ''}\n\nSource: The Polymath's Inbox`;
        navigator.clipboard.writeText(content);
        window.open('https://docs.google.com/document/create', '_blank');
        alert("Draft content copied to clipboard! Paste it into the new Google Doc.");
    };

    const recommendations = [
        `Draft a Tweet Thread about: ${item.summary ? item.summary.slice(0, 30) : 'this topic'}...`,
        `Write a Blog Post: "Reflections on ${item.tags.split(',')[0]}..."`,
        `Create Task: Follow up on this research`
    ];

    return (
        <div className={`rounded-lg border p-5 transition-all hover:scale-[1.02] hover:shadow-xl ${accentColor} flex flex-col gap-3 group relative`}>
            <div className="flex justify-between items-start">
                <div className="flex gap-2 flex-wrap">
                    {item.tags.split(', ').map(tag => (
                        <span key={tag} className={`text-xs px-2 py-1 rounded-md font-medium border
              ${tag.includes('Medical') ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' :
                                tag.includes('Theology') ? 'bg-purple-900/30 text-purple-400 border-purple-800' :
                                    'bg-blue-900/30 text-blue-400 border-blue-800'}`}>
                            {tag}
                        </span>
                    ))}
                    {item.status === 'archived' && (
                        <span className="text-xs px-2 py-1 rounded-md font-medium border bg-zinc-800 text-zinc-500 border-zinc-700">Archived</span>
                    )}
                </div>
                <span className="text-zinc-500 text-xs font-mono">
                    {new Date(item.created_at + 'Z').toLocaleDateString()}
                </span>
            </div>

            <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-zinc-100 leading-tight">
                    {item.summary || "Processing..."}
                </h3>

                {isTask && item.content && item.content !== item.summary && (
                    <div className="text-sm text-zinc-400 mt-2 whitespace-pre-wrap font-mono bg-zinc-900/50 p-3 rounded border border-zinc-800">
                        {item.content}
                    </div>
                )}

                {item.type === 'url' && (
                    <a href={item.content} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline flex items-center gap-1 mt-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        Original Link
                    </a>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-700/50 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {isTask ? (
                    <button onClick={handleGoogleDoc} className="flex items-center gap-1 text-xs font-medium text-blue-300 hover:text-white bg-blue-900/20 hover:bg-blue-800 px-3 py-1.5 rounded-full border border-blue-800 transition-colors w-full justify-center">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Draft in Google Docs (+Suggestions)
                    </button>
                ) : (
                    <a href="https://www.notion.so" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white uppercase tracking-wider mr-auto">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        Open Notion
                    </a>
                )}

                {!isTask && item.status !== 'archived' && (
                    <>
                        {showConvertMenu ? (
                            <div className="w-full space-y-2 bg-zinc-900 p-3 rounded-lg border border-zinc-700 z-20 relative">
                                <p className="text-xs text-zinc-400 uppercase font-bold">Recommended Actions:</p>
                                {recommendations.map((rec, i) => (
                                    <button key={i} onClick={() => handleConvert(rec)} className="w-full text-left text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 p-2 rounded transition-colors truncate">
                                        → {rec}
                                    </button>
                                ))}
                                <button onClick={() => setShowConvertMenu(false)} className="text-xs text-red-400 hover:text-red-300 mt-2">Cancel</button>
                            </div>
                        ) : (
                            <>
                                <button onClick={() => handleStatusUpdate('archived')} className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 hover:bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-700 transition-colors">
                                    Archive
                                </button>
                                <button onClick={() => setShowConvertMenu(true)} className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 px-3 py-1.5 rounded-full border border-blue-800 transition-colors">
                                    Create Action
                                </button>
                                <button onClick={() => handleStatusUpdate('deleted')} className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-400 bg-red-900/10 hover:bg-red-900/20 px-3 py-1.5 rounded-full border border-red-900/30 transition-colors ml-auto">
                                    Discard
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Card;
