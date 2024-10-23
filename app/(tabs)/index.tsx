import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { PlusIcon } from 'react-native-heroicons/outline';
import SearchBar from '../../components/common/SearchBar';
import ItemCard from '../../components/cards/ItemCard';
import { Colors } from '../../constants/Colors';

// Temporary mock data
const MOCK_ITEMS = [
    {
        id: '1',
        title: 'MacBook Pro',
        description: 'Found in the library, second floor near the study rooms.',
        category: 'electronics',
        location: 'University Library',
        date: new Date(),
        status: 'found',
        userId: '1',
        isAnonymous: false
    },
    {
        id: '2',
        title: 'Student ID Card',
        description: 'Lost somewhere between the cafeteria and science building.',
        category: 'documents',
        location: 'Science Building',
        date: new Date(Date.now() - 86400000), // Yesterday
        status: 'lost',
        userId: '2',
        isAnonymous: false
    },
] as const;

export default function Home() {
    const handleSearch = (text: string) => {
        // Will implement later with backend
        console.log('Searching:', text);
    };

    const handleFilterPress = () => {
        // Will implement filter modal later
        console.log('Filter pressed');
    };

    return (
        <View className="flex-1 bg-gray-50">
            <SearchBar onSearch={handleSearch} onFilterPress={handleFilterPress} />
            
            <View className="flex-row justify-between px-4 py-3">
                <Link href="/create/lost" asChild>
                    <TouchableOpacity 
                        className="flex-1 mr-2 bg-red-500 rounded-lg py-3 flex-row justify-center items-center"
                    >
                        <PlusIcon size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">
                            Report Lost
                        </Text>
                    </TouchableOpacity>
                </Link>
                
                <Link href="/create/found" asChild>
                    <TouchableOpacity 
                        className="flex-1 ml-2 bg-green-500 rounded-lg py-3 flex-row justify-center items-center"
                    >
                        <PlusIcon size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">
                            Report Found
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>

            <ScrollView className="flex-1">
                <Text className="px-4 py-2 text-lg font-semibold text-gray-900">
                    Recent Items
                </Text>
                {MOCK_ITEMS.map((item) => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </View>
    );
}
