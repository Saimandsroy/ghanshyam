import React from 'react';
import { MessageCircle, Clock } from 'lucide-react';

export function Threads() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <MessageCircle className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
          Threads
        </h2>
      </div>

      {/* Coming Soon Card */}
      <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(107, 240, 255, 0.1)' }}>
          <Clock className="h-8 w-8" style={{ color: 'var(--primary-cyan)' }} />
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Coming Soon</h3>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
          The messaging/threads feature is under development. You'll be able to communicate with managers and other team members directly from here.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(107, 240, 255, 0.1)', color: 'var(--primary-cyan)' }}>
            📩 Messaging
          </span>
          <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: 'var(--medium-purple)' }}>
            📋 Task Discussions
          </span>
          <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            🔔 Notifications
          </span>
        </div>
      </div>
    </div>
  );
}

export default Threads;
