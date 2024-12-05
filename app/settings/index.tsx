import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { UserIcon, ShieldCheckIcon } from 'react-native-heroicons/outline';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

const SettingItem = ({ icon: Icon, title, href }) => (
    <Link href={href} asChild>
        <TouchableOpacity className="flex-row items-center p-4 border-t border-gray-200">
            <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center mr-4">
                <Icon size={24} color="#3b82f6" />
            </View>
            <Text className="text-base text-gray-800">{title}</Text>
        </TouchableOpacity>
    </Link>
);

export default function Settings() {
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        async function getUserEmail() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserEmail(user.email);
        }
        getUserEmail();
    }, []);

    return (
        <ScrollView className="flex-1 bg-gray-100">
            <View className="p-6 bg-blue-800">
                <Text className="text-2xl font-bold text-white mb-1">Settings</Text>
                <Text className="text-base text-white opacity-80">{userEmail}</Text>
            </View>

            <View className="mt-6 bg-white rounded-xl overflow-hidden">
                <Text className="text-lg font-bold text-gray-800 p-4">Account</Text>
                <SettingItem
                    icon={UserIcon}
                    title="Edit Profile"
                    href="/settings/edit-profile"
                />
                <SettingItem
                    icon={ShieldCheckIcon}
                    title="Change Password"
                    href="/settings/change-password"
                />
            </View>
        </ScrollView>
    );
}
