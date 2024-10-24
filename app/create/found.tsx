import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { CameraIcon } from 'react-native-heroicons/outline';
import { Categories } from '../../constants/Categories';
import { Colors } from '../../constants/Colors';

interface FoundItemForm {
    title: string;
    description: string;
    category: string;
    location: string;
    date: string;
    isAnonymous: boolean;
}

export default function CreateFoundItem() {
    const { control, handleSubmit, formState: { errors } } = useForm<FoundItemForm>();

    const onSubmit = (data: FoundItemForm) => {
        console.log(data);
        // will implement form submission later
        router.back();
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4">
                <Controller
                    control={control}
                    rules={{ required: true }}
                    name="title"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="text-gray-700 mb-2">Title</Text>
                            <TextInput
                                className="bg-white p-3 rounded-lg border border-gray-200"
                                placeholder="What did you find?"
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.title && (
                                <Text className="text-red-500 mt-1">Title is required</Text>
                            )}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name="category"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="text-gray-700 mb-2">Category</Text>
                            <View className="border border-gray-200 rounded-lg bg-white">
                                <Picker
                                    selectedValue={value}
                                    onValueChange={onChange}
                                >
                                    <Picker.Item label="Select a category" value="" />
                                    {Categories.map((category) => (
                                        <Picker.Item
                                            key={category.id}
                                            label={category.label}
                                            value={category.id}
                                        />
                                    ))}
                                </Picker>
                            </View>
                            {errors.category && (
                                <Text className="text-red-500 mt-1">Category is required</Text>
                            )}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name="location"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="text-gray-700 mb-2">Found Location</Text>
                            <TextInput
                                className="bg-white p-3 rounded-lg border border-gray-200"
                                placeholder="Where did you find it?"
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.location && (
                                <Text className="text-red-500 mt-1">Location is required</Text>
                            )}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name="description"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="text-gray-700 mb-2">Description</Text>
                            <TextInput
                                className="bg-white p-3 rounded-lg border border-gray-200"
                                placeholder="Describe the item in detail..."
                                multiline
                                numberOfLines={4}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.description && (
                                <Text className="text-red-500 mt-1">Description is required</Text>
                            )}
                        </View>
                    )}
                />

                <TouchableOpacity 
                    className="bg-gray-100 p-4 rounded-lg mb-4 flex-row justify-center items-center"
                    onPress={() => {/* Implement image upload later */}}
                >
                    <CameraIcon size={24} color={Colors.text.secondary} strokeWidth={2} />
                    <Text className="ml-2 text-gray-600">Add Photos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-green-500 py-3 rounded-lg"
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Report Found Item
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
