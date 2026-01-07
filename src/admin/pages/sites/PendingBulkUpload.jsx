import React from 'react';
import { Clock } from 'lucide-react';

export function PendingBulkUpload() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Clock size={28} style={{ color: 'var(--warning)' }} />
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Pending Bulk Upload Requests</h2>
            </div>

            <div className="card p-6" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Review and approve pending bulk upload requests from bloggers.</p>
                <div className="mt-6">
                    <p style={{ color: 'var(--text-muted)' }}>No pending bulk upload requests.</p>
                </div>
            </div>
        </div>
    );
}
