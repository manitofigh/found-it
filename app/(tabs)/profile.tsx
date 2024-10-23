import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { 
    UserCircleIcon,
    StarIcon,
    ChatBubbleLeftRightIcon,
    BellIcon,
    Cog6ToothIcon 
} from 'react-native-heroicons/outline';
import { Colors } from '../../constants/Colors';

// Mock user data
const MOCK_USER = {
    name: 'Mani Tofigh',
    email: 'mtofigh1@pride.hofstra.edu',
    rewardPoints: 150,
    itemsPosted: 5,
    itemsReturned: 3
};

const ProfileOption = ({ icon: Icon, title, onPress }: { 
    icon: any, 
    title: string, 
    onPress: () => void 
}) => (
    <TouchableOpacity 
        className="flex-row items-center px-4 py-3 bg-white"
        onPress={onPress}
    >
        <Icon size={24} color={Colors.primary.DEFAULT} strokeWidth={2} />
        <Text className="ml-3 text-gray-800 text-lg">{title}</Text>
    </TouchableOpacity>
);

export default function Profile() {
    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="bg-primary p-6 items-center">
                <UserCircleIcon size={80} color={Colors.secondary.DEFAULT} strokeWidth={2} />
                <Text className="mt-4 text-xl font-bold text-blue-700">{MOCK_USER.name}</Text>
                <Text className="text-blue-700 opacity-80">{MOCK_USER.email}</Text>
                
                <View className="flex-row justify-around w-full mt-6">
                    <View className="items-center">
                        <Text className="text-yellow-600 text-lg font-bold">{MOCK_USER.rewardPoints}</Text>
                        <Text className="text-blue-700 opacity-80">Points</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-yellow-600 text-lg font-bold">{MOCK_USER.itemsPosted}</Text>
                        <Text className="text-blue-700 opacity-80">Posted</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-yellow-600 text-lg font-bold">{MOCK_USER.itemsReturned}</Text>
                        <Text className="text-blue-700 opacity-80">Returned</Text>
                    </View>
                </View>
            </View>

            <View className="mt-4">
                <ProfileOption 
                    icon={StarIcon}
                    title="My Items"
                    onPress={() => {/* laterrrr */}}
                />
                <ProfileOption 
                    icon={ChatBubbleLeftRightIcon}
                    title="Messages"
                    onPress={() => {/* laterrrr */}}
                />
                <ProfileOption 
                    icon={BellIcon}
                    title="Notifications"
                    onPress={() => {/* laterrrr */}}
                />
                <ProfileOption 
                    icon={Cog6ToothIcon}
                    title="Settings"
                    onPress={() => {/* laterrrr */}}
                />
            </View>
        </ScrollView>
    );
}
