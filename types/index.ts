export interface Item {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    date: Date;
    status: 'lost' | 'found' | 'claimed';
    images?: string[];
    userId: string;
    isAnonymous: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    rewardPoints: number;
    items: Item[];
}
