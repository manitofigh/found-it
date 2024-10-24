import React from 'react';
import { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { PlusIcon } from 'react-native-heroicons/outline';
import SearchBar from '../../components/common/SearchBar';
import ItemCard from '../../components/cards/ItemCard';
import FilterModal from '../../components/common/FilterModal';
import { MOCK_ITEMS } from '../../components/data/MockData';

export default function Home() {

    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        sortBy: 'newest' as const,
        status: 'all' as const
    });

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    const handleFilterPress = () => {
        setIsFilterModalVisible(true);
    };

    const handleApplyFilters = (newFilters: typeof filters) => {
        setFilters(newFilters);
        // Will implement filter logic later
        console.log('Applied filters:', newFilters);
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

            <FilterModal
                isVisible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
                filters={filters}
                onApplyFilters={handleApplyFilters}
            />
        </View>
    );
}
