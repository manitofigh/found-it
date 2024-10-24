import { create } from 'zustand';
import { Item } from '../types';

interface FiltersState {
    category: string;
    sortBy: 'newest' | 'oldest';
    status: 'all' | 'lost' | 'found';
    search: string;
}

interface ItemsState {
    items: Item[];
    isLoading: boolean;
    filters: FiltersState;
    setItems: (items: Item[]) => void;
    addItem: (item: Item) => void;
    setFilters: (filters: Partial<FiltersState>) => void;
    resetFilters: () => void;
}

const initialFilters: FiltersState = {
    category: '',
    sortBy: 'newest',
    status: 'all',
    search: ''
};

export const useItemsStore = create<ItemsState>((set) => ({
    items: [],
    isLoading: false,
    filters: initialFilters,
    
    setItems: (items) => set({ items }),
    
    addItem: (newItem) => set((state) => ({
        items: [newItem, ...state.items]
    })),
    
    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),
    
    resetFilters: () => set({
        filters: initialFilters
    })
}));

// selectors for optimized rerenders
export const useFilteredItems = () => {
    const { items, filters } = useItemsStore();
    
    return items.filter(item => {
        // status filter
        if (filters.status !== 'all' && item.status !== filters.status) {
            return false;
        }
        
        // category
        if (filters.category && item.category !== filters.category) {
            return false;
        }
        
        // search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                item.title.toLowerCase().includes(searchLower) ||
                item.description.toLowerCase().includes(searchLower) ||
                item.location.toLowerCase().includes(searchLower)
            );
        }
        
        return true;
    }).sort((a, b) => {
        // sortttt
        if (filters.sortBy === 'newest') {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
    });
};
