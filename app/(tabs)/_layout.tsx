import { Tabs } from 'expo-router';
import { HomeIcon, MagnifyingGlassIcon, PlusCircleIcon, UserIcon } from 'react-native-heroicons/outline';
import { Colors } from '../../constants/Colors';

function TabBarIcon({ Icon, color }: { Icon: any; color: string }) {
    return <Icon size={24} color={color} />;
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary.DEFAULT,
                tabBarInactiveTintColor: Colors.text.secondary,
                tabBarStyle: {
                    backgroundColor: Colors.background.primary,
                },
                headerStyle: {
                    backgroundColor: Colors.primary.DEFAULT,
                },
                headerTintColor: Colors.secondary.DEFAULT,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon Icon={HomeIcon} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="lost"
                options={{
                    title: 'Lost',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon Icon={MagnifyingGlassIcon} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="found"
                options={{
                    title: 'Found',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon Icon={PlusCircleIcon} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon Icon={UserIcon} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
