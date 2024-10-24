import React, { useState } from 'react';
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
    ActionSheetIOS
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { CameraIcon, PhotoIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { decode } from 'base-64';
import * as ImagePicker from 'expo-image-picker';
import { Categories } from '../../constants/Categories';
import { Colors } from '../../constants/Colors';
import { supabase } from '../../lib/supabase';

interface FoundItemForm {
    title: string;
    description: string;
    category: string;
    location: string;
}

export default function CreateFoundItem() {
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm<FoundItemForm>();

    const pickImage = async (source: 'camera' | 'library') => {
        try {
            if (images.length >= 3) {
                Alert.alert('Limit Reached', 'You can only upload up to 3 images');
                return;
            }

            let result;
            if (source === 'camera') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Please grant camera permissions');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                });
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Please grant photo library permissions');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                });
            }

            if (!result.canceled && result.assets[0].uri) {
                setImages(prev => [...prev, result.assets[0].uri]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
            console.error('Error picking image:', error);
        }
    };

    const uploadImages = async (): Promise<string[]> => {
        try {
            const uploadedUrls = await Promise.all(
                images.map(async (uri, index) => {
                    // For local files, we need to read them first
                    const base64 = await fetch(uri).then(response => 
                        response.blob()
                    ).then(blob => {
                            return new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    resolve(reader.result);
                                };
                                reader.onerror = reject;
                                reader.readAsDataURL(blob);
                            });
                        });

                    // Remove the data URL prefix to get just the base64 string
                    const base64String = base64.toString().split(',')[1];

                    // Create file name
                    const ext = uri.substring(uri.lastIndexOf('.') + 1);
                    const fileName = `${Date.now()}-${index}.${ext}`;

                    console.log('Uploading file:', fileName);

                    const { data, error } = await supabase.storage
                        .from('items-images')
                        .upload(fileName, decode(base64String), {
                            contentType: `image/${ext}`,
                            cacheControl: '3600',
                            upsert: false
                        });

                    if (error) {
                        console.error('Upload error:', error);
                        throw error;
                    }

                    // Get the public URL
                    const { data: { publicUrl } } = supabase.storage
                    .from('items-images')
                    .getPublicUrl(data.path);

                    return publicUrl;
                })
            );

            return uploadedUrls;
        } catch (error) {
            console.error('Error in uploadImages:', error);
            throw error;
        }
    };    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: FoundItemForm) => {
        try {
            setIsSubmitting(true);
            let imageUrls: string[] = [];

            if (images.length > 0) {
                imageUrls = await uploadImages();
            }

            const { error } = await supabase
                .from('items')
                .insert([{
                    ...data,
                    status: 'found',
                    images: imageUrls,
                    date: new Date().toISOString(),
                    // user_id field was being problematic as auth wasn't setup 
                    is_anonymous: false
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
                    if (buttonIndex === 1) pickImage('camera');
                    else if (buttonIndex === 2) pickImage('library');
                }
            );
        } else {
            Alert.alert(
                'Add Photo',
                'Choose a method',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Take Photo', onPress: () => pickImage('camera') },
                    { text: 'Choose from Library', onPress: () => pickImage('library') }
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

                {/* Image Upload Section */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-2">Images (max 3)</Text>
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
                        {images.length < 3 && (
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
