import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import { PlusIcon } from 'react-native-heroicons/outline';
import SearchBar from '../../components/common/SearchBar';
import InlineFilters from '../../components/common/InlineFilters';
import ItemCard from '../../components/cards/ItemCard';
import { itemsService } from '../../services/itemsService';
import { useItemsStore, useFilteredItems } from '../../stores/itemsStore';
import { Colors } from '../../constants/Colors';

export default function Home() {
    const [showFilters, setShowFilters] = useState(false);
    const { setItems, filters, setFilters } = useItemsStore();
    const filteredItems = useFilteredItems();
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchItems = async (showLoadingState = true) => {
        try {
            if (showLoadingState) setIsLoading(true);
            console.log('Fetching items with filters:', filters);
            const data = await itemsService.getItems(0, filters);
            console.log('Fetched data:', data);
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchItems(false);
        setIsRefreshing(false);
    };

    useEffect(() => {
        fetchItems();

        // Subscribe to real-time updates
        const unsubscribe = itemsService.subscribeToItems((newItem) => {
            setItems(prev => [newItem, ...prev]);
        });

        return () => {
            unsubscribe();
        };
    }, [filters]);

    return (
        <View className="flex-1 bg-gray-50">
            <SearchBar
                onSearch={(text) => setFilters({ search: text })}
                onFilterPress={() => setShowFilters(!showFilters)}
            />
            
            <InlineFilters
                visible={showFilters}
                selectedCategory={filters.category}
                selectedSort={filters.sortBy}
                selectedStatus={filters.status}
                onSelectCategory={(category) => setFilters({ category })}
                onSelectSort={(sortBy) => setFilters({ sortBy })}
                onSelectStatus={(status) => setFilters({ status })}
                pageType="home"
            />

            <View className="flex-row justify-between px-4 py-3">
                <Link href="/create/lost" asChild>
                    <TouchableOpacity 
                        className="flex-1 mr-2 bg-red-500 rounded-lg py-3 flex-row justify-center items-center"
                    >
                        <PlusIcon size={20} color="white" strokeWidth={2} />
                        <Text className="text-white font-semibold ml-2">
                            Report Lost
                        </Text>
                    </TouchableOpacity>
                </Link>
                
                <Link href="/create/found" asChild>
                    <TouchableOpacity 
                        className="flex-1 ml-2 bg-green-500 rounded-lg py-3 flex-row justify-center items-center"
                    >
                        <PlusIcon size={20} color="white" strokeWidth={2} />
                        <Text className="text-white font-semibold ml-2">
                            Report Found
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>

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
                    Recent Items {filteredItems.length > 0 && `(${filteredItems.length})`}
                </Text>
                
                {isLoading ? (
                    <View className="flex-1 items-center justify-center py-8">
                        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
                    </View>
                ) : filteredItems.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-8">
                        <Text className="text-gray-500">No items found</Text>
                    </View>
                ) : (
                    filteredItems.map((item) => (
                        <ItemCard 
                            key={item.id} 
                            item={item} 
                            refreshItems={handleRefresh}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
}
