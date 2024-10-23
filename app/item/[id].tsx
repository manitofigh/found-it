import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { 
    MapPinIcon, 
    CalendarIcon, 
    ChatBubbleLeftRightIcon 
} from 'react-native-heroicons/outline';
import { format } from 'date-fns';
import StatusBadge from '../../components/common/StatusBadge';
import { Colors } from '../../constants/Colors';

// Mock item data - in real app, fetch based on ID
const MOCK_ITEM = {
    id: '1',
    title: 'MacBook Pro',
    description: 'Space Gray MacBook Pro 13" found in the library second floor near the study rooms. It was left unattended for several hours. Currently being held at the library lost and found desk.',
    category: 'electronics',
    location: 'Axinn Library - Second Floor',
    date: new Date(),
    status: 'found',
    images: ['https://placeholder.com/350x250'],
    userId: '1',
    isAnonymous: false,
    user: {
        name: 'Jane Smith',
        rewardPoints: 120
    }
} as const;

export default function ItemDetail() {
    const { id } = useLocalSearchParams();
    const item = MOCK_ITEM; // In real app, fetch item by id

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {item.images && item.images.length > 0 && (
                <Image
                    source={{ uri: item.images[0] }}
                    className="w-full h-64"
                    resizeMode="cover"
                />
            )}

            <View className="p-4">
                <View className="flex-row justify-between items-start">
                    <Text className="text-2xl font-bold text-gray-900 flex-1">
                        {item.title}
                    </Text>
                    <StatusBadge status={item.status as any} />
                </View>

                <View className="mt-4 space-y-2">
                    <View className="flex-row items-center">
                        <MapPinIcon size={20} color={Colors.text.secondary} strokeWidth={2} />
                        <Text className="ml-2 text-gray-600">{item.location}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <CalendarIcon size={20} color={Colors.text.secondary} strokeWidth={2} />
                        <Text className="ml-2 text-gray-600">
                            {format(item.date, 'MMM d, yyyy')}
                        </Text>
                    </View>
                </View>

                <View className="mt-6">
                    <Text className="text-lg font-semibold mb-2">Description</Text>
                    <Text className="text-gray-600 leading-6">{item.description}</Text>
                </View>

                {!item.isAnonymous && (
                    <View className="mt-6 bg-white p-4 rounded-lg">
                        <Text className="text-lg font-semibold mb-2">Posted by</Text>
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-gray-900">{item.user.name}</Text>
                                <Text className="text-gray-500">
                                    {item.user.rewardPoints} reward points
                                </Text>
                            </View>
                            <TouchableOpacity 
                                className="bg-primary px-4 py-2 rounded-lg flex-row items-center"
                                onPress={() => {/* Implement messaging later */}}
                            >
                                <ChatBubbleLeftRightIcon size={20} color="white" strokeWidth={2} />
                                <Text className="text-white ml-2">Message</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
