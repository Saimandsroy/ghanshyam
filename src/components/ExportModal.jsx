import React, { useState } from 'react';
import { X, Download, FileText, Table } from 'lucide-react';

export function ExportModal({ isOpen, onClose, onExport, selectedCount }) {
    const [filename, setFilename] = useState('');
    const [format, setFormat] = useState('csv'); // 'csv', 'xls', 'xlsx'

    if (!isOpen) return null;

    const handleExport = () => {
        onExport({ filename: filename.trim(), format });
        onClose();
        // Reset states after export
        setFilename('');
        setFormat('csv');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-[var(--card-background)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--background-dark)]">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--text-primary)]">
                        <Download className="h-5 w-5 text-[var(--primary-cyan)]" />
                        Export Data
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[var(--text-muted)] hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="bg-[var(--primary-cyan)]/10 border border-[var(--primary-cyan)]/20 text-[var(--primary-cyan)] px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                        <Table className="h-4 w-4" />
                        You are about to export {selectedCount} selected row{selectedCount !== 1 ? 's' : ''}.
                    </div>

                    <div className="space-y-4">
                        {/* Filename Input */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[var(--text-secondary)]">
                                File Name <span className="text-xs font-normal text-[var(--text-muted)]">(optional)</span>
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="e.g. export_data"
                                    value={filename}
                                    onChange={(e) => setFilename(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--primary-cyan)]/50 transition-all premium-input"
                                    style={{ 
                                        backgroundColor: 'var(--background-dark)', 
                                        border: '1px solid var(--border)', 
                                        color: 'var(--text-primary)' 
                                    }}
                                />
                            </div>
                        </div>

                        {/* Format Selection Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[var(--text-secondary)]">
                                Format
                            </label>
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--primary-cyan)]/50 transition-all premium-input appearance-none cursor-pointer"
                                style={{ 
                                    backgroundColor: 'var(--background-dark)', 
                                    border: '1px solid var(--border)', 
                                    color: 'var(--text-primary)' 
                                }}
                            >
                                <option value="csv">CSV (.csv)</option>
                                <option value="xlsx">Excel (.xlsx)</option>
                                <option value="xls">Excel Legacy (.xls)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--border)] bg-[var(--background-dark)] flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-white/5 transition-colors text-[var(--text-muted)] hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={selectedCount === 0}
                        className="px-6 py-2 bg-[var(--primary-cyan)] text-black text-sm font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ExportModal;
