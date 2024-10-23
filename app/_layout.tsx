import { Stack } from 'expo-router';
import { Colors } from '../constants/Colors';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.primary.DEFAULT,
                },
                headerTintColor: Colors.secondary.DEFAULT,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
            <Stack.Screen 
                name="(tabs)" 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="create/lost" 
                options={{ title: 'Report Lost Item' }} 
            />
            <Stack.Screen 
                name="create/found" 
                options={{ title: 'Report Found Item' }} 
            />
            <Stack.Screen 
                name="item/[id]" 
                options={{ title: 'Item Details' }} 
            />
        </Stack>
    );
}
