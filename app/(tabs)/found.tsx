import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { PlusIcon } from 'react-native-heroicons/outline';
import SearchBar from '../../components/common/SearchBar';
import ItemCard from '../../components/cards/ItemCard';
import { Colors } from '../../constants/Colors';

// Temporary mock data for found items
const MOCK_FOUND_ITEMS = [
    {
        id: '1',
        title: 'Silver iPhone',
        description: 'Found on bench outside library. No password lock.',
        category: 'electronics',
        location: 'Library Front',
        date: new Date(),
        status: 'found',
        userId: '1',
        isAnonymous: false
    },
    {
        id: '2',
        title: 'House Keys',
        description: 'Found in Cafeteria during lunch hour. Has a red keychain.',
        category: 'keys',
        location: 'Student Center',
        date: new Date(Date.now() - 86400000),
        status: 'found',
        userId: '2',
        isAnonymous: true
    },
] as const;

export default function FoundItems() {
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
            
            <Link href="/create/found" asChild>
                <TouchableOpacity 
                    className="mx-4 mt-3 mb-2 bg-green-500 rounded-lg py-3 flex-row justify-center items-center"
                >
                    <PlusIcon size={20} color="white" strokeWidth={2} />
                    <Text className="text-white font-semibold ml-2">
                        Report Found Item
                    </Text>
                </TouchableOpacity>
            </Link>

            <ScrollView className="flex-1">
                {MOCK_FOUND_ITEMS.map((item) => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </View>
    );
}
