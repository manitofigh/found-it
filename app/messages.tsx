import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { MOCK_MESSAGES } from '../components/data/MockData';
import { ChatBubbleLeftRightIcon } from 'react-native-heroicons/outline';

const MessageItem = ({ item }) => (
    <Link href={`/message/${item.id}`} asChild>
        <TouchableOpacity className="flex-row items-center bg-white rounded-xl p-4 mb-3 shadow-sm">
            <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-3">
                <ChatBubbleLeftRightIcon size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
                <View className="flex-row justify-between mb-1">
                    <Text className="text-base font-bold text-gray-800">{item.sender}</Text>
                    <Text className="text-xs text-gray-500">
                        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <Text className="text-sm text-gray-600" numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>
            {item.unread && <View className="w-2 h-2 rounded-full bg-blue-500 ml-2" />}
        </TouchableOpacity>
    </Link>
);

export default function Messages() {
    return (
        <View className="flex-1 bg-gray-100">
            <FlatList
                data={MOCK_MESSAGES}
                renderItem={({ item }) => <MessageItem item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerClassName="p-4"
            />
        </View>
    );
}
