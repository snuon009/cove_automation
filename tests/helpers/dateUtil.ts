// tests/utils/dateUtils.ts

/**
 * Returns today's date formatted as YYYY-MM-DD by default.
 * 
 * @param format Optional format type: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM-DD-YYYY'
 * @returns Formatted current date string
 */
export function getTodayDate(format: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'YYYY/MM/DD' | 'MM-DD-YYYY' = 'YYYY-MM-DD'): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    switch (format) {
        case 'DD/MM/YYYY':
            return `${dd}/${mm}/${yyyy}`;
        case 'MM-DD-YYYY':
            return `${mm}-${dd}-${yyyy}`;
        case 'YYYY/MM/DD':
            return `${yyyy}/${mm}/${dd}`;
        default:
            return `${yyyy}-${mm}-${dd}`;
    }
}