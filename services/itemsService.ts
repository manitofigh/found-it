import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Item } from '../types';

interface PostgresChanges {
    new: Item;
    old: Item;
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}

const ITEMS_PER_PAGE = 20;

export const itemsService = {

    async createItem(item: Omit<Item, 'id'>) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Get user's name from profiles table
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, items_posted')
                .eq('id', user.id)
                .single();

            const { data, error } = await supabase
                .from('items')
                .insert([{
                    ...item,
                    user_id: user.id,
                    submitter_name: profile.full_name
                }])
                .select()
                .single();

            if (error) throw error;

            // Increment items_posted count in profiles
            await supabase
            .from('profiles')
            .update({ items_posted: profile.items_posted + 1 })
            .eq('id', user.id);

            return data;
        } catch (error) {
            console.error('Error in createItem:', error);
            throw error;
        }
    },

    async getItems(page = 0, filters?: {
        status?: 'lost' | 'found',
        category?: string,
        sortBy?: 'newest' | 'oldest'
    }) {
        try {
            console.log('Fetching items with filters:', filters);
            let query = supabase
            .from('items')
            .select('*');

            // Apply filters
            if (filters?.status && filters.status !== 'all') {
                query = query.eq('status', filters.status);
            }

            if (filters?.category) {
                query = query.eq('category', filters.category);
            }

            // Apply sorting
            query = query.order('date', { 
                ascending: filters?.sortBy === 'oldest' 
            });

            // Apply pagination
            query = query.range(
                page * ITEMS_PER_PAGE, 
                (page + 1) * ITEMS_PER_PAGE - 1
            );

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching items:', error);
                throw error;
            }

            console.log('Fetched items:', data);
            return data;
        } catch (error) {
            console.error('Error in getItems:', error);
            throw error;
        }
    },

    async getItemById(id: string) {
        try {
            console.log('Fetching item by id:', id);
            const { data, error } = await supabase
                .from('items')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching item by id:', error);
                throw error;
            }

            console.log('Fetched item:', data);
            return data;
        } catch (error) {
            console.error('Error in getItemById:', error);
            throw error;
        }
    },

    subscribeToItems(callback: (item: Item) => void) {
        try {
            console.log('Setting up real-time subscription');
            const subscription = supabase
            .channel('public:items')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'items'
                },
                (payload: RealtimePostgresChangesPayload<PostgresChanges>) => {
                    console.log('Received real-time update:', payload);
                    if (payload.new) {
                        callback(payload.new);
                    }
                }
            )
            .subscribe(status => {
                console.log('Subscription status:', status);
            });

            return () => {
                console.log('Unsubscribing from real-time updates');
                subscription.unsubscribe();
            };
        } catch (error) {
            console.error('Error in subscribeToItems:', error);
            throw error;
        }
    }
};
