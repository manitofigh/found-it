import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Categories } from '../../constants/Categories';

interface FilterOption {
    id: string;
    label: string;
}

const sortOptions: FilterOption[] = [
    { id: 'newest', label: 'Newest' },
    { id: 'oldest', label: 'Oldest' },
];

const statusOptions: FilterOption[] = [
    { id: 'all', label: 'All' },
    { id: 'lost', label: 'Lost' },
    { id: 'found', label: 'Found' },
];

interface FilterChipProps {
    label: string;
    isSelected: boolean;
    onPress: () => void;
}

const FilterChip = ({ label, isSelected, onPress }: FilterChipProps) => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: isSelected ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isSelected]);

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#f3f4f6', Colors.primary.DEFAULT]
    });

    const textColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.text.secondary, '#ffffff']
    });

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Animated.View
                style={{
                    backgroundColor,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 9999,
                    marginRight: 8,
                }}
            >
                <Animated.Text
                    style={{
                        color: textColor,
                        fontSize: 14,
                        fontWeight: '500',
                    }}
                >
                    {label}
                </Animated.Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

interface InlineFiltersProps {
    visible: boolean;
    selectedCategory: string;
    selectedSort: string;
    onSelectCategory: (category: string) => void;
    onSelectSort: (sort: string) => void;
    pageType: 'lost' | 'found'; // Add this to determine which page we're on
}

export default function InlineFilters({
    visible,
    selectedCategory,
    selectedSort,
    onSelectCategory,
    onSelectSort,
    pageType,
}: InlineFiltersProps) {
    if (!visible) return null;

    return (
        <View className="bg-white py-2">
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="border-b border-gray-100 py-2"
            >
                <View className="pl-4">
                    <Text className="text-xs text-gray-500 mb-2">Category</Text>
                    <View className="flex-row">
                        <FilterChip
                            label="All"
                            isSelected={selectedCategory === ''}
                            onPress={() => onSelectCategory('')}
                        />
                        {Categories.map((category) => (
                            <FilterChip
                                key={category.id}
                                label={category.label}
                                isSelected={selectedCategory === category.id}
                                onPress={() => onSelectCategory(category.id)}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="pt-2"
            >
                <View className="pl-4">
                    <Text className="text-xs text-gray-500 mb-2">Sort By</Text>
                    <View className="flex-row">
                        <FilterChip
                            label="Newest"
                            isSelected={selectedSort === 'newest'}
                            onPress={() => onSelectSort('newest')}
                        />
                        <FilterChip
                            label="Oldest"
                            isSelected={selectedSort === 'oldest'}
                            onPress={() => onSelectSort('oldest')}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
