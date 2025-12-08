import React from 'react';

/**
 * LoadingSkeleton - Reusable loading placeholder component
 * @param {string} variant - Type of skeleton: 'text', 'card', 'table', 'avatar', 'button'
 * @param {number} count - Number of skeleton items to render
 * @param {string} className - Additional CSS classes
 */
export function LoadingSkeleton({ variant = 'text', count = 1, className = '' }) {
    const renderSkeleton = () => {
        switch (variant) {
            case 'avatar':
                return (
                    <div
                        className={`w-10 h-10 rounded-full animate-pulse ${className}`}
                        style={{ backgroundColor: 'var(--border)' }}
                    />
                );

            case 'button':
                return (
                    <div
                        className={`h-10 w-24 rounded-lg animate-pulse ${className}`}
                        style={{ backgroundColor: 'var(--border)' }}
                    />
                );

            case 'card':
                return (
                    <div
                        className={`rounded-2xl p-6 animate-pulse ${className}`}
                        style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: 'var(--border)' }} />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--border)' }} />
                                <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--border)' }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 rounded" style={{ backgroundColor: 'var(--border)' }} />
                            <div className="h-3 rounded w-5/6" style={{ backgroundColor: 'var(--border)' }} />
                        </div>
                    </div>
                );

            case 'table':
                return (
                    <div
                        className={`rounded-2xl overflow-hidden ${className}`}
                        style={{ border: '1px solid var(--border)' }}
                    >
                        {/* Header */}
                        <div className="flex gap-4 p-4" style={{ backgroundColor: 'var(--background-dark)' }}>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-4 rounded flex-1 animate-pulse" style={{ backgroundColor: 'var(--border)' }} />
                            ))}
                        </div>
                        {/* Rows */}
                        {[1, 2, 3, 4, 5].map((row) => (
                            <div
                                key={row}
                                className="flex gap-4 p-4 animate-pulse"
                                style={{ borderBottom: '1px solid var(--border)' }}
                            >
                                {[1, 2, 3, 4].map((col) => (
                                    <div key={col} className="h-4 rounded flex-1" style={{ backgroundColor: 'var(--border)' }} />
                                ))}
                            </div>
                        ))}
                    </div>
                );

            case 'stats':
                return (
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="rounded-2xl p-6 animate-pulse"
                                style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="h-4 w-20 rounded" style={{ backgroundColor: 'var(--border)' }} />
                                    <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: 'var(--border)' }} />
                                </div>
                                <div className="h-8 w-24 rounded" style={{ backgroundColor: 'var(--border)' }} />
                            </div>
                        ))}
                    </div>
                );

            case 'text':
            default:
                return (
                    <div
                        className={`h-4 rounded animate-pulse ${className}`}
                        style={{ backgroundColor: 'var(--border)' }}
                    />
                );
        }
    };

    if (count === 1) {
        return renderSkeleton();
    }

    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
            ))}
        </div>
    );
}

/**
 * TableSkeleton - Specialized skeleton for data tables
 */
export function TableSkeleton({ rows = 5, columns = 4 }) {
    return (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {/* Header */}
            <div className="flex gap-4 p-4" style={{ backgroundColor: 'var(--background-dark)' }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} className="h-4 rounded flex-1 animate-pulse" style={{ backgroundColor: 'var(--border)' }} />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, row) => (
                <div
                    key={row}
                    className="flex gap-4 p-4 animate-pulse"
                    style={{ borderBottom: row < rows - 1 ? '1px solid var(--border)' : 'none' }}
                >
                    {Array.from({ length: columns }).map((_, col) => (
                        <div
                            key={col}
                            className="h-4 rounded flex-1"
                            style={{
                                backgroundColor: 'var(--border)',
                                width: col === 0 ? '80px' : 'auto'
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

/**
 * CardSkeleton - Specialized skeleton for stat cards
 */
export function CardSkeleton({ count = 4 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-2xl p-6 animate-pulse"
                    style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-4 w-20 rounded" style={{ backgroundColor: 'var(--border)' }} />
                        <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: 'var(--border)' }} />
                    </div>
                    <div className="h-8 w-24 rounded" style={{ backgroundColor: 'var(--border)' }} />
                </div>
            ))}
        </div>
    );
}
