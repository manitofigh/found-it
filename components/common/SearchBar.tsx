import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';
import { Colors } from '../../constants/Colors';

interface SearchBarProps {
    onSearch: (text: string) => void;
    onFilterPress: () => void;
}

export default function SearchBar({ onSearch, onFilterPress }: SearchBarProps) {
    return (
        <View className="flex-row items-center px-4 py-2 bg-white">
            <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                <MagnifyingGlassIcon size={20} color={Colors.text.secondary} strokeWidth={2} />
                <TextInput
                    className="flex-1 ml-2 text-base text-gray-900"
                    placeholder="Search items..."
                    placeholderTextColor={Colors.text.secondary}
                    onChangeText={onSearch}
                />
            </View>
            <TouchableOpacity 
                className="ml-2 p-2"
                onPress={onFilterPress}
            >
                <AdjustmentsHorizontalIcon size={24} color={Colors.primary.DEFAULT} strokeWidth={2} />
            </TouchableOpacity>
        </View>
    );
}
