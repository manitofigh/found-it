import React, { useState, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { PlusIcon } from 'react-native-heroicons/outline';
import SearchBar from '../../components/common/SearchBar';
import InlineFilters from '../../components/common/InlineFilters';
import ItemCard from '../../components/cards/ItemCard';
import { MOCK_ITEMS } from '../../components/data/MockData';

export default function LostItems() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        sortBy: 'newest',
    });

    const filteredItems = useMemo(() => {
        let items = MOCK_ITEMS.filter(item => item.status === 'lost');

        if (filters.category) {
            items = items.filter(item => item.category === filters.category);
        }

        items = [...items].sort((a, b) => {
            if (filters.sortBy === 'newest') {
                return b.date.getTime() - a.date.getTime();
            } else {
                return a.date.getTime() - b.date.getTime();
            }
        });

        return items;
    }, [filters]);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    const handleFilterPress = () => {
        setShowFilters(!showFilters);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <SearchBar onSearch={handleSearch} onFilterPress={handleFilterPress} />
            
            <InlineFilters
                visible={showFilters}
                selectedCategory={filters.category}
                selectedSort={filters.sortBy}
                onSelectCategory={(category) => 
                    setFilters(prev => ({ ...prev, category }))
                }
                onSelectSort={(sortBy) => 
                    setFilters(prev => ({ ...prev, sortBy }))
                }
                pageType="lost"
            />

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
                <Text className="px-4 py-2 text-lg font-semibold text-gray-900">
                    Lost Items ({filteredItems.length})
                </Text>
                {filteredItems.map((item) => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </View>
    );
}
