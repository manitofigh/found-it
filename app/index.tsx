import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>FoundIt landing page</Text>
      <Link href='/profile' style={{ color:"blue" }}> Go to the profile page </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

