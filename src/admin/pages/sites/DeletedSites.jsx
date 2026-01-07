import React from 'react';
import { Trash2 } from 'lucide-react';

export function DeletedSites() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Trash2 size={28} style={{ color: 'var(--error)' }} />
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Deleted Sites</h2>
            </div>

            <div className="card p-6" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>View and manage deleted sites. You can restore or permanently delete them.</p>
                <div className="mt-6">
                    <p style={{ color: 'var(--text-muted)' }}>No deleted sites found.</p>
                </div>
            </div>
        </div>
    );
}
