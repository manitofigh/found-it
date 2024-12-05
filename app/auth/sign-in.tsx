import React, { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleSubmit() {
    if (!email || !password || (isSignUp && (!firstName || !lastName))) {
      Alert.alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data: { user }, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName
            }
          }
        });
        if (error) throw error;
        Alert.alert(
          'Success', 
          'Please check your inbox for email verification!'
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="h-1/3 bg-blue-800 rounded-b-[40px] justify-end pb-10">
        <Text className="text-3xl font-bold text-white text-center">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </Text>
        <Text className="text-blue-100 text-center mt-2">
          Sign {isSignUp ? 'up' : 'in'} for a lil bit of this and a lil bit of that
        </Text>
      </View>

      <View className="px-6 pt-8">
        <View className="bg-white p-6 rounded-2xl shadow-sm">
          {isSignUp && (
            <>
              <TextInput
                className="bg-gray-50 p-4 rounded-xl mb-4 text-gray-800"
                placeholder="First Name"
                placeholderTextColor="#94a3b8"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                className="bg-gray-50 p-4 rounded-xl mb-4 text-gray-800"
                placeholder="Last Name"
                placeholderTextColor="#94a3b8"
                value={lastName}
                onChangeText={setLastName}
              />
            </>
          )}

          <TextInput
            className="bg-gray-50 p-4 rounded-xl mb-4 text-gray-800"
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            className="bg-gray-50 p-4 rounded-xl mb-6 text-gray-800"
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            className={`rounded-xl py-4 ${loading ? 'bg-blue-300' : 'bg-blue-500'}`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
                <Text className="text-white font-semibold text-center text-lg">
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Text>
              )}
          </TouchableOpacity>
        </View>

        <View className="mt-6 items-center">
          <Text className="text-gray-600 mb-2">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <TouchableOpacity 
            className="bg-blue-100 px-6 py-2 rounded-full" 
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text className="text-blue-800 font-medium">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
