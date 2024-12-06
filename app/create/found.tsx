import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    Platform,
    ActionSheetIOS,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { CameraIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { Categories } from '../../constants/Categories';
import { Colors } from '../../constants/Colors';
import { supabase } from '../../lib/supabase';
import { pickImage, uploadImage } from '../../lib/imageHandler';

interface FoundItemForm {
    title: string;
    description: string;
    category: string;
    location: string;
}

interface UserDetails {
    full_name: string | null;
    email: string;
}

export default function CreateFoundItem() {
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    
    const { 
        control, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<FoundItemForm>();

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching profile:', error);
                    return;
                }

                setUserDetails({
                    full_name: profile.full_name,
                    email: user.email || ''
                });
            }
        } catch (error) {
            console.error('Error in fetchUserDetails:', error);
            Alert.alert('Error', 'Failed to fetch user details');
        }
    };

    const handleImagePick = async (source: 'camera' | 'library') => {
        try {
            if (images.length >= 1) {
                Alert.alert('Limit Reached', 'You can only upload up to 1 image');
                return;
            }

            const imageUri = await pickImage(source);
            if (imageUri) {
                setImages(prev => [...prev, imageUri]);
            }
        } catch (error) {
            console.error('Error handling image pick:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: FoundItemForm) => {
        if (!userDetails) {
            Alert.alert('Error', 'Unable to get user details. Please try again.');
            return;
        }

        try {
            setIsSubmitting(true);
            let imageUrls: string[] = [];

            if (images.length > 0) {
                const uploadPromises = images.map(uri => uploadImage(uri));
                imageUrls = await Promise.all(uploadPromises);
            }

            const { error } = await supabase
                .from('items')
                .insert([{
                    ...data,
                    status: 'found',
                    images: imageUrls,
                    date: new Date().toISOString(),
                    submitter_email: userDetails.email,
                    submitter_name: userDetails.full_name,
                    is_anonymous: false,
                    deleted: false
                }]);

            if (error) throw error;

            Alert.alert(
                'Success',
                'Found item has been reported successfully',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Submission error:', error);
            Alert.alert('Error', 'Failed to submit found item report');
        } finally {
            setIsSubmitting(false);
        }
    };

    const showImagePicker = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancel', 'Take Photo', 'Choose from Library'],
                    cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) handleImagePick('camera');
                    else if (buttonIndex === 2) handleImagePick('library');
                }
            );
        } else {
            Alert.alert(
                'Add Photo',
                'Choose a method',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Take Photo', onPress: () => handleImagePick('camera') },
                    { text: 'Choose from Library', onPress: () => handleImagePick('library') }
                ]
            );
        }
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
                                    style={{ color: Colors.text.primary }}
                                >
                                    <Picker.Item 
                                        label="Select a category" 
                                        value="" 
                                        color={Colors.text.secondary}
                                    />
                                    {Categories.map((category) => (
                                        <Picker.Item
                                            key={category.id}
                                            label={`${category.icon} ${category.label}`}
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
                                placeholder="Describe where the owner could find this item (e.g. I handed it to office x in department y)"
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

                <View className="mb-4">
                    <Text className="text-gray-700 mb-2">Images (max 1)</Text>
                    <View className="flex-row flex-wrap">
                        {images.map((uri, index) => (
                            <View key={index} className="mr-2 mb-2">
                                <Image
                                    source={{ uri }}
                                    className="w-20 h-20 rounded-lg"
                                />
                                <TouchableOpacity
                                    className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                                    onPress={() => removeImage(index)}
                                >
                                    <XMarkIcon size={16} color="white" strokeWidth={2} />
                                </TouchableOpacity>
                            </View>
                        ))}
                        {images.length < 1 && (
                            <TouchableOpacity
                                className="w-20 h-20 bg-gray-100 rounded-lg items-center justify-center"
                                onPress={showImagePicker}
                            >
                                <View className="items-center">
                                    <CameraIcon size={24} color={Colors.text.secondary} strokeWidth={2} />
                                    <Text className="text-xs text-gray-500 mt-1">Add Photo</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-green-500 py-3 rounded-lg"
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-center font-semibold text-lg">
                            Report Found Item
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
