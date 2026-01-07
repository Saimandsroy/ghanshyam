import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, Download, CheckCircle, FileSpreadsheet } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function AddExcel() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [importResult, setImportResult] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const ext = file.name.split('.').pop().toLowerCase();
            if (ext !== 'xlsx' && ext !== 'xls') {
                toast.error('Only Excel files (.xlsx, .xls) are allowed');
                e.target.value = '';
                return;
            }
            setSelectedFile(file);
            setImportResult(null);
        }
    };

    const handleDownloadFormat = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast.error('Please login first');
            return;
        }
        window.location.href = `${API_BASE_URL}/admin/sites/download-format?token=${token}`;
    };

    const handleImport = async () => {
        if (!selectedFile) {
            toast.error('Please select an Excel file first');
            return;
        }

        setUploading(true);
        setImportResult(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/admin/sites/upload-excel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            // Show success toast in top right
            toast.success(`Successfully imported ${data.inserted} sites!`, {
                duration: 5000,
                position: 'top-right',
                style: {
                    background: '#22c55e',
                    color: '#fff',
                    fontWeight: '500'
                },
                icon: '✅'
            });

            // Set result for display
            setImportResult({
                success: true,
                inserted: data.inserted,
                total: data.total_rows,
                errors: data.errors || []
            });

            if (data.errors && data.errors.length > 0) {
                toast.error(`${data.errors.length} rows had errors`, {
                    position: 'top-right'
                });
            }

            // Reset form
            setSelectedFile(null);
            document.querySelector('input[type="file"]').value = '';
        } catch (error) {
            toast.error(error.message || 'Failed to import Excel file', {
                position: 'top-right'
            });
            setImportResult({
                success: false,
                error: error.message
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: 'var(--text-primary, #fff)'
            }}>
                Add Excel File
            </h2>

            <div style={{
                backgroundColor: 'var(--card-background, #1a1a2e)',
                border: '1px solid var(--border, #2a2a4a)',
                borderRadius: '8px',
                padding: '24px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px',
                            color: 'var(--text-secondary, #aaa)',
                            fontSize: '14px'
                        }}>
                            <FileSpreadsheet size={18} />
                            Upload Excel File
                        </label>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            style={{
                                marginBottom: '16px',
                                color: 'var(--text-primary, #fff)'
                            }}
                        />
                        {selectedFile && (
                            <div style={{
                                marginBottom: '12px',
                                padding: '8px 12px',
                                backgroundColor: 'var(--background, #0f0f1a)',
                                borderRadius: '4px',
                                color: 'var(--text-secondary, #aaa)',
                                fontSize: '13px'
                            }}>
                                Selected: <strong style={{ color: 'var(--primary-cyan, #00bcd4)' }}>{selectedFile.name}</strong>
                            </div>
                        )}
                        <div>
                            <button
                                onClick={handleImport}
                                disabled={uploading || !selectedFile}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    backgroundColor: uploading ? '#444' : '#22c55e',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '6px',
                                    cursor: uploading || !selectedFile ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    opacity: !selectedFile ? 0.5 : 1
                                }}
                            >
                                <Upload size={18} />
                                {uploading ? 'Importing...' : 'Import Excel File'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleDownloadFormat}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--primary-cyan, #00bcd4)',
                                color: 'var(--primary-cyan, #00bcd4)',
                                padding: '10px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            <Download size={16} />
                            Download Formatted Excel File
                        </button>
                    </div>
                </div>

                {/* Success Result Banner */}
                {importResult && importResult.success && (
                    <div style={{
                        marginTop: '20px',
                        padding: '16px',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid #22c55e',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <CheckCircle size={24} style={{ color: '#22c55e' }} />
                        <div>
                            <div style={{ color: '#22c55e', fontWeight: '600', marginBottom: '4px' }}>
                                Import Successful!
                            </div>
                            <div style={{ color: 'var(--text-secondary, #aaa)', fontSize: '14px' }}>
                                Imported <strong style={{ color: '#22c55e' }}>{importResult.inserted}</strong> of {importResult.total} rows.
                                {importResult.errors.length > 0 && (
                                    <span style={{ color: '#f59e0b' }}> ({importResult.errors.length} rows had errors)</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Result Banner */}
                {importResult && !importResult.success && (
                    <div style={{
                        marginTop: '20px',
                        padding: '16px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        borderRadius: '8px',
                        color: '#ef4444'
                    }}>
                        <strong>Import Failed:</strong> {importResult.error}
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: 'var(--card-background, #1a1a2e)',
                border: '1px solid var(--border, #2a2a4a)',
                borderRadius: '8px'
            }}>
                <h4 style={{ color: 'var(--text-primary, #fff)', marginBottom: '12px' }}>Instructions:</h4>
                <ul style={{ color: 'var(--text-secondary, #aaa)', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
                    <li>Download the formatted Excel template first</li>
                    <li>Fill in site details (Root Domain, DA, DR, Traffic, Prices, Email, etc.)</li>
                    <li>Upload multiple Excel files - each import adds to the database</li>
                    <li>After importing, go to <strong style={{ color: 'var(--primary-cyan, #00bcd4)' }}>Create Account</strong> to create blogger accounts from emails</li>
                </ul>
            </div>
        </div>
    );
}
