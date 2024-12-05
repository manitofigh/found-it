import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;
            Alert.alert('Success', 'Password updated successfully');
            router.back();
        } catch (error) {
            Alert.alert('Error updating password', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <View className="p-6">
                <View className="bg-white p-6 rounded-2xl shadow-sm">
                    <TextInput
                        className="bg-gray-50 p-4 rounded-xl mb-4 text-gray-800"
                        placeholder="Current Password"
                        placeholderTextColor="#94a3b8"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry
                    />
                    <TextInput
                        className="bg-gray-50 p-4 rounded-xl mb-4 text-gray-800"
                        placeholder="New Password"
                        placeholderTextColor="#94a3b8"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                    <TextInput
                        className="bg-gray-50 p-4 rounded-xl mb-6 text-gray-800"
                        placeholder="Confirm New Password"
                        placeholderTextColor="#94a3b8"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        className={`rounded-xl py-4 ${loading ? 'bg-blue-300' : 'bg-blue-500'}`}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-semibold text-center text-lg">
                                Update Password
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
