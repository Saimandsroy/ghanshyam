import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Validates and sanitizes the filename
 */
const getFileName = (filename, extension) => {
    const name = filename?.trim() ? filename.trim() : 'export';
    return `${name}.${extension}`;
};

/**
 * Export array of objects to CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Base name of the file
 */
export const exportToCSV = (data, filename = 'export') => {
    if (!data || !data.length) return;

    // Handle nested or empty fields gracefully
    const processedData = data.map(item => 
        Object.keys(item).reduce((acc, key) => {
            acc[key] = item[key] === null || item[key] === undefined ? '' : String(item[key]);
            return acc;
        }, {})
    );

    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, getFileName(filename, 'csv'));
};

/**
 * Export array of objects to Excel (XLS or XLSX)
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Base name of the file
 * @param {boolean} isXlsx - True for .xlsx, false for .xls
 */
export const exportToExcel = (data, filename = 'export', isXlsx = true) => {
    if (!data || !data.length) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const extension = isXlsx ? 'xlsx' : 'xls';
    const bookType = isXlsx ? 'xlsx' : 'biff8'; // biff8 is standard for .xls

    const excelBuffer = XLSX.write(workbook, { bookType, type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    
    saveAs(dataBlob, getFileName(filename, extension));
};
