import React from 'react';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-3xl font-bold">Test page</Text>
      <Link href='/profile' className="mt-4 text-blue-500">
        Go to the profile page
      </Link>
    </View>
  );
}
