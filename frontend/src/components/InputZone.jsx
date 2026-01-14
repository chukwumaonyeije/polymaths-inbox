import React, { useState, useRef } from 'react';

const InputZone = ({ onInputSubmit, onFileUpload }) => {
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const startListening = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setText((prev) => prev + ' ' + transcript);
            };

            recognition.start();
        } else {
            alert("Web Speech API not supported in this browser.");
        }
    };

    const handleDeepThink = async () => {
        if (!text) return;
        setIsLoading(true);
        // Detect if URL
        const type = text.startsWith('http') ? 'url' : 'text';
        await onInputSubmit(text, type);
        setText('');
        setIsLoading(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setIsLoading(true);
            await onFileUpload(e.dataTransfer.files[0]);
            setIsLoading(false);
        }
    };

    return (
        <div
            className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 mb-8 shadow-2xl relative overflow-hidden group"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex flex-col gap-4 relative z-10">
                <label className="text-zinc-400 text-sm font-medium tracking-wide uppercase">Deep Think Input</label>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste a URL, type a thought, or drag a PDF here..."
                    className="w-full bg-zinc-800/50 text-zinc-100 p-4 rounded-lg outline-none border border-zinc-700 focus:border-blue-500 transition-all font-mono text-sm leading-relaxed min-h-[120px]"
                />

                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            onClick={startListening}
                            className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse border-red-500/50' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700'}`}
                            title="Dictate"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 1.5a3 3 0 013 3v1.5a3 3 0 01-6 0v-1.5a3 3 0 013-3z" />
                            </svg>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => e.target.files[0] && onFileUpload(e.target.files[0])}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-all"
                            title="Upload File"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 6.105l-5.148 5.147a1.5 1.5 0 01-2.122-2.122l4.304-4.303" />
                            </svg>
                        </button>
                    </div>

                    <button
                        onClick={handleDeepThink}
                        disabled={isLoading || !text}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20"
                    >
                        {isLoading ? (
                            <>Processing...</>
                        ) : (
                            <>
                                Deep Think <span className="text-blue-200">→</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputZone;
