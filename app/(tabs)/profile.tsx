import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, RefreshControl } from 'react-native';
import { router, Link } from 'expo-router';
import { 
    StarIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
} from 'react-native-heroicons/outline';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';

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

export default function Component() {
    const [userDetails, setUserDetails] = useState<{
        full_name: string;
        email: string;
        items_posted: number;
    } | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUserDetails = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                // Get profile data
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    return;
                }

                // Get count of items posted by user
                const { count: itemsCount, error: itemsError } = await supabase
                    .from('items')
                    .select('*', { count: 'exact', head: true })
                    .eq('submitter_email', user.email);

                if (itemsError) {
                    console.error('Error counting items:', itemsError);
                    return;
                }

                setUserDetails({
                    full_name: profile.full_name,
                    email: user.email,
                    items_posted: itemsCount || 0
                });
            }
        } catch (error) {
            console.error('Error in fetchUserDetails:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserDetails();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.replace('/auth/sign-in');
        } catch (error) {
            Alert.alert('Error signing out', error.message);
        }
    };

    if (!userDetails) return null;

    return (
        <ScrollView 
            className="flex-1 bg-gray-50"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={Colors.primary.DEFAULT}
                />
            }
        >
            <View className="pt-24 h-1/3 bg-blue-800 rounded-b-[40px] justify-end pb-20 mb-10">
                <View className="items-center">
                    <Text className="text-2xl font-bold text-white">
                        {userDetails.full_name}
                    </Text>
                    <Text className="text-blue-100">{userDetails.email}</Text>

                    <View className="bg-white bg-opacity-90 rounded-xl p-4 mt-6 w-32">
                        <Text className="text-xl font-bold text-blue-500 text-center">
                            {userDetails.items_posted}
                        </Text>
                        <Text className="text-gray-600 text-center">Posted Items</Text>
                    </View>
                </View>
            </View>

            <View className="p-4 mt-4">
                {/*
                <ProfileOption 
                    icon={StarIcon}
                    title="My Items"
                />
                */}
                <ProfileOption 
                    icon={Cog6ToothIcon}
                    title="Settings"
                    path="/settings"
                />

                <TouchableOpacity 
                    onPress={handleSignOut}
                    className="flex-row items-center bg-white p-4 mb-2 rounded-xl shadow-sm mt-8"
                >
                    <ArrowRightOnRectangleIcon size={24} color="#ef4444" strokeWidth={2} />
                    <Text className="ml-4 text-base text-red-500">Sign Out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
