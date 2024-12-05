import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { format } from 'date-fns';
import { TrashIcon } from 'react-native-heroicons/outline';
import StatusBadge from '../common/StatusBadge';
import { Item } from '../../types';
import { supabase } from '@/lib/supabase';

interface ItemCardProps {
    item: Item;
    refreshItems?: () => void; // Optional callback to refresh items list
}

export default function ItemCard({ item, refreshItems }: ItemCardProps) {
    const [currentUserEmail, setCurrentUserEmail] = React.useState<string | null>(null);

    React.useEffect(() => {
        async function getUserEmail() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUserEmail(user.email);
            }
        }
        getUserEmail();
    }, []);

    const handleDelete = async () => {
        Alert.alert(
            'Delete Posting',
            'Are you sure you want to delete this posting?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('items')
                                .update({ deleted: true })
                                .eq('id', item.id);

                            if (error) throw error;

                            if (refreshItems) {
                                refreshItems();
                            } else {
                                // If we're not given a refresh function, navigate back
                                // router.back();
                            }
                        } catch (error) {
                            console.error('Error deleting item:', error);
                            Alert.alert('Error', 'Failed to delete the posting');
                        }
                    }
                }
            ]
        );
    };

    return (
        <Link href={`/item/${item.id}`} asChild>
            <TouchableOpacity 
                className="bg-white rounded-lg shadow-sm mb-3 mx-4"
                activeOpacity={0.7}
            >
                <View className="p-4">
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-gray-900">
                                {item.title}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">
                                Date: {format(new Date(item.date), 'MMM d, yyyy • h:mm a')}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">
                                Location: {item.location}
                            </Text>
                            {item.submitter_name && (
                                <Text className="text-sm text-gray-500 mt-1">
                                    Found By: {item.submitter_name}
                                </Text>
                            )}
                        </View>
                        <View className="flex-row items-center">
                            <StatusBadge status={item.status} />
                            {currentUserEmail === item.submitter_email && (
                                <TouchableOpacity 
                                    onPress={(e) => {
                                        e.preventDefault(); // Prevent navigation
                                        handleDelete();
                                    }}
                                    className="ml-2"
                                >
                                    <TrashIcon size={20} color="#ef4444" strokeWidth={2} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {item.description && (
                        <Text 
                            className="text-gray-600 mt-2"
                            numberOfLines={2}
                        >
                            Description: {item.description.length > 15
                                ? `${item.description.substring(0, 15)}... (Click to see more)` 
                                : item.description}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </Link>
    );
}
