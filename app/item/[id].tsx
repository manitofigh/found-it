import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    ActivityIndicator,
    Platform 
} from 'react-native';
import { Image } from 'expo-image';  // Use expo-image instead of react-native Image
import { useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { MapPinIcon, CalendarIcon } from 'react-native-heroicons/outline';
import StatusBadge from '../../components/common/StatusBadge';
import { Colors } from '../../constants/Colors';
import { itemsService } from '../../services/itemsService';
import { Item } from '../../types';

export default function ItemDetail() {
    const { id } = useLocalSearchParams();
    const [item, setItem] = useState<Item | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const data = await itemsService.getItemById(id as string);
                console.log('Fetched item data:', data);
                setItem(data);
            } catch (error) {
                console.error('Error fetching item:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
            </View>
        );
    }

    if (!item) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">Item not found</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {item.images && item.images.length > 0 ? (
                <View className="w-full h-64 bg-gray-100">
                    {imageLoading && (
                        <View className="absolute inset-0 items-center justify-center">
                            <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
                        </View>
                    )}
                    <Image
                        source={item.images[0]}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        transition={200}
                        onLoadStart={() => setImageLoading(true)}
                        onLoadEnd={() => setImageLoading(false)}
                    />
                </View>
            ) : (
                <View className="w-full h-64 bg-gray-200 items-center justify-center">
                    <Text className="text-gray-500">No image available</Text>
                </View>
            )}

            <View className="p-4">
                <View className="flex-row justify-between items-start">
                    <Text className="text-2xl font-bold text-gray-900 flex-1">
                        {item.title}
                    </Text>
                    <StatusBadge status={item.status} />
                </View>

                <View className="mt-4 space-y-2">
                    <View className="flex-row items-center">
                        <MapPinIcon size={20} color={Colors.text.secondary} strokeWidth={2} />
                        <Text className="ml-2 text-gray-600">{item.location}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <CalendarIcon size={20} color={Colors.text.secondary} strokeWidth={2} />
                        <Text className="ml-2 text-gray-600">
                            {format(new Date(item.date), 'MMM d, yyyy • h:mm a')}
                        </Text>
                    </View>
                </View>

                <View className="mt-6">
                    <Text className="text-lg font-semibold mb-2">Description</Text>
                    <Text className="text-gray-600 leading-6">{item.description}</Text>
                </View>
            </View>
        </ScrollView>
    );
}
