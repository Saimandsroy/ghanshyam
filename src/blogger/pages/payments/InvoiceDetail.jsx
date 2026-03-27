import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, ExternalLink } from 'lucide-react';
import { bloggerAPI } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';

/**
 * InvoiceDetail Page - Displays detailed invoice matching the sample format
 * Route: /blogger/payments/invoices/:id
 */
export function InvoiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showError } = useToast();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const fetchInvoice = useCallback(async () => {
        try {
            setLoading(true);
            const response = await bloggerAPI.getInvoiceDetail(id);
            setData(response);
        } catch (err) {
            console.error('Error fetching invoice:', err);
            showError('Failed to load invoice details');
        } finally {
            setLoading(false);
        }
    }, [id, showError]);

    useEffect(() => {
        fetchInvoice();
    }, [fetchInvoice]);

    const handleDownloadPdf = async () => {
        try {
            setDownloading(true);
            const blob = await bloggerAPI.downloadInvoicePdf(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-LM${data?.invoice?.number || id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error downloading PDF:', err);
            showError('Failed to download PDF');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary-cyan)] border-t-transparent"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6 text-center">
                <p className="text-[var(--text-muted)]">Invoice not found</p>
                <button onClick={() => navigate(-1)} className="mt-4 premium-btn premium-btn-accent">
                    Go Back
                </button>
            </div>
        );
    }

    const { invoice, blogger, company, items, total, note } = data;

    return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/blogger/payments/invoices')}
                        className="p-2 rounded-xl hover:bg-[var(--card-background)] border border-transparent hover:border-[var(--border)] transition-all"
                    >
                        <ArrowLeft className="h-5 w-5 text-[var(--text-secondary)]" />
                    </button>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <FileText className="h-6 w-6 text-[var(--primary-cyan)]" />
                        Invoice Details
                    </h1>
                </div>
                <button
                    onClick={handleDownloadPdf}
                    disabled={downloading}
                    className="premium-btn premium-btn-accent flex items-center gap-2"
                >
                    <Download className={`h-4 w-4 ${downloading ? 'animate-pulse' : ''}`} />
                    {downloading ? 'Downloading...' : 'Download PDF'}
                </button>
            </div>

            {/* Invoice Card */}
            <div className="premium-card p-8 bg-white text-black" style={{ backgroundColor: '#fff', color: '#000' }}>
                {/* Top Section: Bill From + Invoice Info */}
                <div className="flex justify-between mb-8">
                    {/* Bill From - Company */}
                    <div>
                        <h2 className="text-lg font-bold mb-2">Bill From:</h2>
                        <p className="text-sm">Rank Me up Services</p>
                        <p className="text-sm text-gray-600"># Seo 105 Ranjeet Avenew B Block Amritsar</p>
                        <p className="text-sm text-gray-600">Punjab, India 143001</p>
                        <p className="text-sm text-gray-600">Email:- Contact@rankmeup.in</p>
                        <p className="text-sm text-gray-600">Phone no = 7087825869</p>
                    </div>

                    {/* Invoice Info */}
                    <div className="text-right">
                        <h1 className="text-3xl font-bold mb-3">INVOICE</h1>
                        <span className={`inline-block px-4 py-1 rounded text-white text-sm font-bold mb-2 ${invoice.status === 1 ? 'bg-green-500' : 'bg-amber-500'
                            }`}>
                            {invoice.statusText}
                        </span>
                        <p className="text-sm">Invoice #: LM {invoice.number}</p>
                        <p className="text-sm text-gray-600">Invoice date: {invoice.date}</p>
                        {invoice.paidDate && (
                            <p className="text-sm text-gray-600">Paid date: {invoice.paidDate}</p>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-200 mb-6" />

                {/* Bill To - Blogger */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold mb-2">Bill To:</h2>
                    <p className="text-sm">{blogger.name}</p>
                    {blogger.phone && <p className="text-sm text-gray-600">Phone: {blogger.phone}</p>}
                    <p className="text-sm text-gray-600">Email: {blogger.email}</p>
                    <p className="text-sm text-gray-600">Address: {blogger.country}</p>
                </div>

                {/* Items Table */}
                <table className="w-full mb-6 border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left py-3 px-4 text-sm font-semibold border-b border-gray-200">Link</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold border-b border-gray-200">Order Id</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold border-b border-gray-200">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={item.id || idx} className="border-b border-gray-100">
                                <td className="py-3 px-4 text-sm">
                                    {item.link ? (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline break-all flex items-center gap-1"
                                        >
                                            {item.link.length > 60 ? item.link.substring(0, 57) + '...' : item.link}
                                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-sm">{item.orderId}</td>
                                <td className="py-3 px-4 text-sm text-right">{item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-gray-300">
                            <td colSpan={2} className="py-3 px-4 text-right font-bold">Total</td>
                            <td className="py-3 px-4 text-right font-bold">{total}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Note */}
                {note && (
                    <div className="mt-6">
                        <h3 className="font-bold text-sm mb-1">Note:</h3>
                        <p className="text-sm text-gray-600">{note}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
