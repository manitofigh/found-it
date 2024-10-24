import React, { useState, useEffect } from 'react';
import { 
    View, 
    ScrollView, 
    Text, 
    TouchableOpacity, 
    ActivityIndicator,
    RefreshControl 
} from 'react-native';
import { Link } from 'expo-router';
import { PlusIcon } from 'react-native-heroicons/outline';
import SearchBar from '../../components/common/SearchBar';
import InlineFilters from '../../components/common/InlineFilters';
import ItemCard from '../../components/cards/ItemCard';
import { itemsService } from '../../services/itemsService';
import { Colors } from '../../constants/Colors';
import { Item } from '../../types';

export default function FoundItems() {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        sortBy: 'newest' as const,
    });
    const [searchQuery, setSearchQuery] = useState('');

    const fetchItems = async (showLoadingState = true) => {
        try {
            if (showLoadingState) setIsLoading(true);
            const data = await itemsService.getItems(0, {
                ...filters,
                status: 'found'
            });
            
            // Apply search filter if exists
            let filteredData = data;
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                filteredData = data.filter(item => 
                    item.title.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query) ||
                    item.location.toLowerCase().includes(query)
                );
            }
            
            setItems(filteredData);
        } catch (error) {
            console.error('Failed to fetch found items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchItems(false);
        setIsRefreshing(false);
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    useEffect(() => {
        fetchItems();
    }, [filters, searchQuery]);

    return (
        <View className="flex-1 bg-gray-50">
            <SearchBar 
                onSearch={handleSearch} 
                onFilterPress={() => setShowFilters(!showFilters)} 
            />
            
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
                pageType="found"
            />

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

            <ScrollView 
                className="flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={Colors.primary.DEFAULT}
                    />
                }
            >
                <Text className="px-4 py-2 text-lg font-semibold text-gray-900">
                    Found Items ({items.length})
                </Text>
                
                {isLoading ? (
                    <View className="flex-1 items-center justify-center py-8">
                        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
                    </View>
                ) : items.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-8">
                        <Text className="text-gray-500">No found items reported</Text>
                    </View>
                ) : (
                    items.map((item) => (
                        <ItemCard key={item.id} item={item} />
                    ))
                )}
            </ScrollView>
        </View>
    );
}
