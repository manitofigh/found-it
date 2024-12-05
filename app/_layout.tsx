import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { supabase } from '../lib/supabase';

export default function RootLayout() {
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.replace('/auth/sign-in');
            }
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.replace('/auth/sign-in');
            }
        });
    }, []);

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
                headerBackTitle: 'Back'
            }}>
            <Stack.Screen 
                name="auth" 
                options={{ headerShown: false }} 
            />
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
