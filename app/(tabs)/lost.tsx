import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { PlusIcon } from 'react-native-heroicons/outline';
import SearchBar from '../../components/common/SearchBar';
import ItemCard from '../../components/cards/ItemCard';
import { Colors } from '../../constants/Colors';

// Temporary mock data for lost items
const MOCK_LOST_ITEMS = [
    {
        id: '1',
        title: 'Black Laptop Bag',
        description: 'Lost near the Engineering building. Contains laptop and notebooks.',
        category: 'accessories',
        location: 'Engineering Building',
        date: new Date(),
        status: 'lost',
        userId: '1',
        isAnonymous: false
    },
    {
        id: '2',
        title: 'Blue Water Bottle',
        description: 'Left in Physics Lab 101 during morning class.',
        category: 'other',
        location: 'Physics Building',
        date: new Date(Date.now() - 86400000),
        status: 'lost',
        userId: '2',
        isAnonymous: true
    },
] as const;

export default function LostItems() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        // Will implement search functionality later
    };

    const handleFilterPress = () => {
        // Will implement filter modal later
    };

    return (
        <View className="flex-1 bg-gray-50">
            <SearchBar onSearch={handleSearch} onFilterPress={handleFilterPress} />
            
            <Link href="/create/lost" asChild>
                <TouchableOpacity 
                    className="mx-4 mt-3 mb-2 bg-red-500 rounded-lg py-3 flex-row justify-center items-center"
                >
                    <PlusIcon size={20} color="white" strokeWidth={2} />
                    <Text className="text-white font-semibold ml-2">
                        Report Lost Item
                    </Text>
                </TouchableOpacity>
            </Link>

            <ScrollView className="flex-1">
                {MOCK_LOST_ITEMS.map((item) => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </View>
    );
}
