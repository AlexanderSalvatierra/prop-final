export const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Fecha pendiente';

    try {
        // 1. Handle ISO string (e.g., 2025-12-03T00:00:00 or 2025-12-03T00:00:00+00:00)
        // We only care about the date part YYYY-MM-DD
        let cleanDateString = dateString;
        if (typeof dateString === 'string' && dateString.includes('T')) {
            cleanDateString = dateString.split('T')[0];
        }

        // 2. Handle YYYY-MM-DD manually to avoid timezone shifts
        if (typeof cleanDateString === 'string' && cleanDateString.includes('-')) {
            const parts = cleanDateString.split('-');
            if (parts.length === 3) {
                const [year, month, day] = parts.map(Number);

                // Validate parts
                if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                    // Create date in local time (months are 0-indexed)
                    const date = new Date(year, month - 1, day);

                    if (!isNaN(date.getTime())) {
                        return date.toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    }
                }
            }
        }

        // 3. Fallback for other formats (standard Date parsing)
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        return 'Fecha inválida';
    } catch (e) {
        console.error('Error formatting date:', e);
        return 'Fecha inválida';
    }
};
