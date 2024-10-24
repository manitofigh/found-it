export const Categories = [
    { id: 'electronics', label: 'Electronics', icon: '📱' },
    { id: 'student-id', label: 'Student ID', icon: '🪪' },
    { id: 'clothing', label: 'Clothing & Accessories', icon: '👕' },
    { id: 'books', label: 'Books & Documents', icon: '📚' },
    { id: 'keys', label: 'Keys', icon: '🔑' },
    { id: 'wallet', label: 'Wallet & Cards', icon: '👛' },
    { id: 'bag', label: 'Bags & Luggage', icon: '🎒' },
    { id: 'jewelry', label: 'Jewelry', icon: '💍' },
    { id: 'other', label: 'Other', icon: '📦' }
] as const;

export type CategoryId = typeof Categories[number]['id'];
