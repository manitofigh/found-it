'use server';

import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { View, Text } from 'react-native';

interface Item {
    id: string;
    title: string;
    description: string | null;
    date: string;
    location: string;
    status: string;
    submitter_name: string | null;
    submitter_email: string;
    deleted: boolean;
}

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getItems({ status, userEmail }: {
    status?: string;
    userEmail?: string;
}) {
    try {
        let query = supabase
            .from('items')
            .select('*')
            .eq('deleted', false)
            .order('date', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        if (userEmail) {
            query = query.eq('submitter_email', userEmail);
        }

        const { data: items, error } = await query;

        if (error) {
            throw error;
        }

        // Return the items wrapped in a component for RSC
        return (
            <View>
                {items.map((item: Item) => (
                    <Text key={item.id}>{item.title}</Text>
                ))}
            </View>
        );
    } catch (error) {
        console.error('Error fetching items:', error);
        return (
            <View>
                <Text>Error loading items. Please try again later.</Text>
            </View>
        );
    }
}

export async function getItemById(id: string) {
    try {
        const { data: item, error } = await supabase
            .from('items')
            .select('*')
            .eq('id', id)
            .eq('deleted', false)
            .single();

        if (error) {
            throw error;
        }

        if (!item) {
            return (
                <View>
                    <Text>Item not found</Text>
                </View>
            );
        }

        // Return the item data wrapped in a component
        return (
            <View>
                <Text>{item.title}</Text>
                <Text>{item.description}</Text>
                <Text>Location: {item.location}</Text>
                <Text>Status: {item.status}</Text>
            </View>
        );
    } catch (error) {
        console.error('Error fetching item:', error);
        return (
            <View>
                <Text>Error loading item. Please try again later.</Text>
            </View>
        );
    }
}
