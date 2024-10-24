import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { 
    UserCircleIcon,
    StarIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
} from 'react-native-heroicons/outline';
import { MOCK_USER } from '@/components/data/MockData';

const ProfileOption = ({ icon: Icon, title, path }: { 
    icon: any, 
    title: string, 
    path?: string 
}) => {
    const content = (
        <TouchableOpacity className="flex-row items-center bg-white p-4 mb-2 rounded-xl shadow-sm">
            <Icon size={24} color="#3b82f6" strokeWidth={2} />
            <Text className="ml-4 text-base text-gray-800">{title}</Text>
        </TouchableOpacity>
    );

    if (path) {
        return (
            <Link href={path} asChild>
                {content}
            </Link>
        );
    }

    return content;
};

const StatCard = ({ title, value }: { title: string, value: number }) => (
    <View className="bg-white bg-opacity-90 rounded-xl p-4 items-center w-[30%]">
        <Text className="text-xl font-bold text-blue-500">{value}</Text>
        <Text className="text-gray-600 mt-1">{title}</Text>
    </View>
);

export default function Component() {
    return (
        <ScrollView className="flex-1 bg-gray-100">
            <View className="p-6 pt-12 items-center bg-blue-800">
                <UserCircleIcon size={80} color="white" strokeWidth={2} />
                <Text className="mt-4 text-2xl font-bold text-white">{MOCK_USER.name}</Text>
                <Text className="text-white text-opacity-80">{MOCK_USER.email}</Text>
                
                <View className="flex-row justify-between w-full mt-6">
                    <StatCard title="Points" value={MOCK_USER.rewardPoints} />
                    <StatCard title="Posted" value={MOCK_USER.itemsPosted} />
                    <StatCard title="Returned" value={MOCK_USER.itemsReturned} />
                </View>
            </View>

            <View className="p-4 mt-4">
                <ProfileOption 
                    icon={StarIcon}
                    title="My Items"
                />
                <ProfileOption 
                    icon={ChatBubbleLeftRightIcon}
                    title="Messages"
                    path="/messages"
                />
                <ProfileOption 
                    icon={Cog6ToothIcon}
                    title="Settings"
                    path="/settings"
                />
            </View>
        </ScrollView>
    );
}
