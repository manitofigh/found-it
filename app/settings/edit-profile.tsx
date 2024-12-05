import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function EditProfile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('id', user.id)
                        .single();

                    if (profile?.full_name) {
                        const [first, ...rest] = profile.full_name.split(' ');
                        setFirstName(first);
                        setLastName(rest.join(' '));
                    }
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setInitialLoad(false);
            }
        }
        loadProfile();
    }, []);

    const handleSave = async () => {
        if (!firstName || !lastName) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                Alert.alert('Error', 'No user found. Please try logging in again.');
                return;
            }

            const { error } = await supabase
                .from('profiles')
                .update({ full_name: `${firstName} ${lastName}` })
                .eq('id', user.id);

            if (error) throw error;

            Alert.alert(
                'Success',
                'Profile updated successfully',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            Alert.alert(
                'Error',
                error.message || 'Failed to update profile. Please try again.',
                [
                    {
                        text: 'OK'
                    }
                ]
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoad) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <View className="p-6">
                <View className="bg-white p-6 rounded-2xl shadow-sm">
                    <TextInput
                        className="bg-gray-50 p-4 rounded-xl mb-4 text-gray-800"
                        placeholder="First Name"
                        placeholderTextColor="#94a3b8"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <TextInput
                        className="bg-gray-50 p-4 rounded-xl mb-6 text-gray-800"
                        placeholder="Last Name"
                        placeholderTextColor="#94a3b8"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                    <TouchableOpacity
                        className={`rounded-xl py-4 ${loading ? 'bg-blue-300' : 'bg-blue-500'}`}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-semibold text-center text-lg">
                                Save Changes
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
