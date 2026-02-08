import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useAutoSave - Custom hook for auto-saving textarea content to localStorage
 * 
 * Features:
 * - Automatically saves while typing (debounced)
 * - Restores data on page load
 * - Survives browser close, power outage, etc.
 * - Clears data after successful form submission
 * 
 * Usage:
 *   const { value, setValue, clearSaved } = useAutoSave('form-field-name', initialValue);
 * 
 *   // In your textarea:
 *   <textarea value={value} onChange={(e) => setValue(e.target.value)} />
 * 
 *   // After successful form submission:
 *   clearSaved();
 * 
 * @param {string} key - Unique key for localStorage (e.g., 'create-order-notes')
 * @param {string} initialValue - Default value if nothing is saved
 * @param {number} debounceMs - Debounce delay in ms (default: 400)
 * @returns {{ value: string, setValue: function, clearSaved: function, isSaved: boolean }}
 */
export function useAutoSave(key, initialValue = '', debounceMs = 400) {
    const storageKey = `autosave_${key}`;

    // Initialize state from localStorage or use initial value
    const [value, setValue] = useState(() => {
        if (typeof window === 'undefined') return initialValue;

        try {
            const saved = localStorage.getItem(storageKey);
            if (saved !== null) {
                const parsed = JSON.parse(saved);
                // Check if data is not too old (max 7 days)
                if (parsed.timestamp && Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
                    return parsed.value || initialValue;
                }
            }
        } catch (e) {
            console.warn('Failed to restore auto-saved data:', e);
        }
        return initialValue;
    });

    const [isSaved, setIsSaved] = useState(false);
    const debounceTimer = useRef(null);

    // Save to localStorage with debounce
    const saveToStorage = useCallback((newValue) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                value: newValue,
                timestamp: Date.now()
            }));
            setIsSaved(true);

            // Reset saved indicator after 2 seconds
            setTimeout(() => setIsSaved(false), 2000);
        } catch (e) {
            console.warn('Failed to auto-save:', e);
        }
    }, [storageKey]);

    // Debounced save effect
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            saveToStorage(value);
        }, debounceMs);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [value, debounceMs, saveToStorage]);

    // Clear saved data (call after successful form submission)
    const clearSaved = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
        } catch (e) {
            console.warn('Failed to clear auto-saved data:', e);
        }
    }, [storageKey]);

    // Also save on beforeunload for safety
    useEffect(() => {
        const handleBeforeUnload = () => {
            saveToStorage(value);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [value, saveToStorage]);

    return { value, setValue, clearSaved, isSaved };
}

/**
 * useAutoSaveForm - Hook for auto-saving entire form state
 * 
 * Usage:
 *   const { formData, setField, clearAllSaved } = useAutoSaveForm('create-order', {
 *     title: '',
 *     notes: '',
 *     description: ''
 *   });
 * 
 * @param {string} formKey - Unique key for the form
 * @param {object} initialValues - Initial form values
 * @param {number} debounceMs - Debounce delay in ms
 */
export function useAutoSaveForm(formKey, initialValues = {}, debounceMs = 400) {
    const storageKey = `autosave_form_${formKey}`;

    // Initialize from localStorage
    const [formData, setFormData] = useState(() => {
        if (typeof window === 'undefined') return initialValues;

        try {
            const saved = localStorage.getItem(storageKey);
            if (saved !== null) {
                const parsed = JSON.parse(saved);
                if (parsed.timestamp && Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
                    return { ...initialValues, ...parsed.values };
                }
            }
        } catch (e) {
            console.warn('Failed to restore form data:', e);
        }
        return initialValues;
    });

    const [isSaved, setIsSaved] = useState(false);
    const debounceTimer = useRef(null);

    // Save to localStorage
    const saveToStorage = useCallback((data) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                values: data,
                timestamp: Date.now()
            }));
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (e) {
            console.warn('Failed to auto-save form:', e);
        }
    }, [storageKey]);

    // Debounced save
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            saveToStorage(formData);
        }, debounceMs);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [formData, debounceMs, saveToStorage]);

    // Set a single field
    const setField = useCallback((fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    }, []);

    // Clear all saved form data
    const clearAllSaved = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
        } catch (e) {
            console.warn('Failed to clear form data:', e);
        }
    }, [storageKey]);

    // Reset entire form
    const resetForm = useCallback(() => {
        setFormData(initialValues);
        clearAllSaved();
    }, [initialValues, clearAllSaved]);

    // Save on beforeunload
    useEffect(() => {
        const handleBeforeUnload = () => {
            saveToStorage(formData);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [formData, saveToStorage]);

    return { formData, setFormData, setField, clearAllSaved, resetForm, isSaved };
}

/**
 * AutoSaveIndicator - Visual indicator component for auto-save status
 * 
 * Usage:
 *   <AutoSaveIndicator isSaved={isSaved} />
 */
export function AutoSaveIndicator({ isSaved }) {
    if (!isSaved) return null;

    return (
        <span
            style={{
                fontSize: '12px',
                color: 'var(--success, #10b981)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                animation: 'fadeIn 0.2s ease-in'
            }}
        >
            <span style={{ fontSize: '10px' }}>✓</span>
            Saved
        </span>
    );
}

/**
 * clearAllAutoSave - Utility to clear all auto-saved data
 * Useful for logout or clearing browser data
 */
export function clearAllAutoSave() {
    if (typeof window === 'undefined') return;

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('autosave_')) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
}

export default useAutoSave;
