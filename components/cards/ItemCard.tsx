import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { format } from 'date-fns';
import StatusBadge from '../common/StatusBadge';
import { Item } from '../../types';

interface ItemCardProps {
    item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
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
                                {format(new Date(item.date), 'MMM d, yyyy')} • {item.location}
                            </Text>
                        </View>
                        <StatusBadge status={item.status} />
                    </View>
                    
                    {item.description && (
                        <Text 
                            className="text-gray-600 mt-2"
                            numberOfLines={2}
                        >
                            {item.description}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </Link>
    );
}
