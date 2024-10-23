import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { Picker } from '@react-native-picker/picker';
import { Categories } from '../../constants/Categories';
import { Colors } from '../../constants/Colors';

interface FilterModalProps {
    isVisible: boolean;
    onClose: () => void;
    filters: {
        category: string;
        sortBy: 'newest' | 'oldest';
        status: 'all' | 'lost' | 'found';
    };
    onApplyFilters: (filters: FilterModalProps['filters']) => void;
}

export default function FilterModal({ 
    isVisible, 
    onClose, 
    filters,
    onApplyFilters 
}: FilterModalProps) {
    const [localFilters, setLocalFilters] = React.useState(filters);

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            style={{ margin: 0 }}
            backdropOpacity={0.5}
            animationIn="slideInUp"
            animationOut="slideOutDown"
        >
            <View className="bg-white rounded-t-2xl mt-auto">
                <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                    <Text className="text-xl font-semibold">Filters</Text>
                    <TouchableOpacity onPress={onClose}>
                        <XMarkIcon size={24} color={Colors.text.secondary} strokeWidth={2} />
                    </TouchableOpacity>
                </View>

                <ScrollView className="p-4">
                    <View className="mb-4">
                        <Text className="text-lg mb-2">Category</Text>
                        <View className="border border-gray-200 rounded-lg">
                            <Picker
                                selectedValue={localFilters.category}
                                onValueChange={(value) => 
                                    setLocalFilters({...localFilters, category: value})
                                }
                            >
                                <Picker.Item label="All Categories" value="" />
                                {Categories.map((category) => (
                                    <Picker.Item 
                                        key={category.id}
                                        label={category.label}
                                        value={category.id}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-lg mb-2">Status</Text>
                        <View className="border border-gray-200 rounded-lg">
                            <Picker
                                selectedValue={localFilters.status}
                                onValueChange={(value) => 
                                    setLocalFilters({...localFilters, status: value})
                                }
                            >
                                <Picker.Item label="All Items" value="all" />
                                <Picker.Item label="Lost Items" value="lost" />
                                <Picker.Item label="Found Items" value="found" />
                            </Picker>
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-lg mb-2">Sort By</Text>
                        <View className="border border-gray-200 rounded-lg">
                            <Picker
                                selectedValue={localFilters.sortBy}
                                onValueChange={(value) => 
                                    setLocalFilters({...localFilters, sortBy: value})
                                }
                            >
                                <Picker.Item label="Newest First" value="newest" />
                                <Picker.Item label="Oldest First" value="oldest" />
                            </Picker>
                        </View>
                    </View>
                </ScrollView>

                <View className="p-4 border-t border-gray-200">
                    <TouchableOpacity 
                        className="bg-primary py-3 rounded-lg"
                        onPress={() => {
                            onApplyFilters(localFilters);
                            onClose();
                        }}
                    >
                        <Text className="text-white text-center font-semibold text-lg">
                            Apply Filters
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
