import React from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { MOCK_USER } from '../components/data/MockData';
import { Cog6ToothIcon, BellIcon, ShieldCheckIcon, UserIcon, QuestionMarkCircleIcon } from 'react-native-heroicons/outline';

const SettingItem = ({ icon: Icon, title, value, href, isSwitch = false }) => {
    const [switchValue, setSwitchValue] = React.useState(value);

    if (isSwitch) {
        return (
            <View className="flex-row items-center p-4 border-t border-gray-200">
                <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center mr-4">
                    <Icon size={24} color="#3b82f6" />
                </View>
                <View className="flex-1 flex-row justify-between items-center">
                    <Text className="text-base text-gray-800">{title}</Text>
                    <Switch value={switchValue} onValueChange={setSwitchValue} />
                </View>
            </View>
        );
    }

    return (
        <Link href={href} asChild>
            <TouchableOpacity className="flex-row items-center p-4 border-t border-gray-200">
                <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center mr-4">
                    <Icon size={24} color="#3b82f6" />
                </View>
                <View className="flex-1 flex-row justify-between items-center">
                    <Text className="text-base text-gray-800">{title}</Text>
                    <Text className="text-base text-gray-500">{value}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default function Settings() {
    return (
        <ScrollView className="flex-1 bg-gray-100">
            <View className="p-6 bg-blue-500">
                <Text className="text-2xl font-bold text-white mb-1">Settings</Text>
                <Text className="text-base text-white opacity-80">{MOCK_USER.email}</Text>
            </View>

            <View className="mt-6 bg-white rounded-xl overflow-hidden">
                <Text className="text-lg font-bold text-gray-800 p-4">Account</Text>
                <SettingItem
                    icon={UserIcon}
                    title="Edit Profile"
                    href=""
                />
                <SettingItem
                    icon={ShieldCheckIcon}
                    title="Change Password"
                    href=""
                />
            </View>

            <View className="mt-6 bg-white rounded-xl overflow-hidden">
                <Text className="text-lg font-bold text-gray-800 p-4">Preferences</Text>
                <SettingItem
                    icon={BellIcon}
                    title="Notifications"
                    value={true}
                    isSwitch
                />
                <SettingItem
                    icon={Cog6ToothIcon}
                    title="Dark Mode"
                    value={false}
                    isSwitch
                />
            </View>

            <View className ="m-6 bg-red-500 p-4 rounded-xl items-center">
                <Text className="text-white text-lg font-bold">Log Out</Text>
            </View>
        </ScrollView>
    );
}
