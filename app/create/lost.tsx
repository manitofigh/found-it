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
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Categories } from '../../constants/Categories';
import { Colors } from '../../constants/Colors';
import { supabase } from '../../lib/supabase';
import { decode } from 'base-64';

interface LostItemForm {
    title: string;
    description: string;
    category: string;
    location: string;
}

export default function CreateLostItem() {
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userDetails, setUserDetails] = useState<{
        full_name: string | null;
        email: string;
    } | null>(null);
    const { control, handleSubmit, formState: { errors } } = useForm<LostItemForm>();

    useEffect(() => {
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
                        email: user.email
                    });
                }
            } catch (error) {
                console.error('Error in fetchUserDetails:', error);
            }
        };

        fetchUserDetails();
    }, []);


    const pickImage = async (source: 'camera' | 'library') => {
        try {
            if (images.length >= 1) {
                Alert.alert('Limit Reached', 'You can only upload up to 1 image');
                return;
            }

            let result;
            const options = {
                mediaTypes: ImagePicker.MediaType.Images,  // Updated from MediaTypeOptions
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            };

            if (source === 'camera') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Please grant camera permissions');
                    return;
                }
                result = await ImagePicker.launchCameraAsync(options);
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Please grant photo library permissions');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync(options);
            }

            if (!result.canceled && result.assets[0].uri) {
                const selectedImage = result.assets[0];
                console.log('Picked image details:', {
                    uri: selectedImage.uri,
                    width: selectedImage.width,
                    height: selectedImage.height,
                    type: selectedImage.type,
                    fileSize: selectedImage.fileSize
                });

                // Check file info immediately
                const fileInfo = await FileSystem.getInfoAsync(selectedImage.uri);
                console.log('FileSystem info for picked image:', fileInfo);

                setImages(prev => [...prev, selectedImage.uri]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const uploadImages = async (): Promise<string[]> => {
        try {
            const uploadedUrls = await Promise.all(
                images.map(async (uri) => {
                    console.log('Starting upload for uri:', uri);

                    // Get and log file info
                    const fileInfo = await FileSystem.getInfoAsync(uri);
                    console.log('File info before upload:', fileInfo);

                    if (!fileInfo.exists) {
                        throw new Error('File does not exist');
                    }

                    // Try reading the file directly first
                    try {
                        const rawFile = await FileSystem.readAsStringAsync(uri);
                        console.log('Raw file length:', rawFile.length);
                    } catch (readError) {
                        console.error('Error reading raw file:', readError);
                    }

                    // Read as base64
                    const base64 = await FileSystem.readAsStringAsync(uri, {
                        encoding: FileSystem.EncodingType.Base64
                    });
                    console.log('Base64 string length:', base64.length);

                    // Create the filename
                    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;

                    // Try uploading the base64 string directly
                    const { data, error } = await supabase.storage
                        .from('items-images')
                        .upload(fileName, base64, {
                            contentType: 'image/jpeg',
                            upsert: false
                        });

                    if (error) {
                        console.error('Supabase upload error:', error);
                        throw error;
                    }

                    console.log('Upload response:', data);

                    const { data: { publicUrl } } = supabase.storage
                    .from('items-images')
                    .getPublicUrl(fileName);

                    console.log('Generated public URL:', publicUrl);
                    return publicUrl;
                })
            );

            return uploadedUrls;
        } catch (error) {
            console.error('Fatal error in uploadImages:', error);
            throw error;
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: LostItemForm) => {
        if (!userDetails) {
            Alert.alert('Error', 'Unable to get user details. Please try again.');
            return;
        }

        try {
            setIsSubmitting(true);
            console.log('Starting submission process');

            let imageUrls: string[] = [];

            if (images.length > 0) {
                console.log('Starting image upload process');
                try {
                    imageUrls = await uploadImages();
                    console.log('Image upload completed:', imageUrls);
                } catch (uploadError) {
                    console.error('Image upload failed:', uploadError);
                    Alert.alert('Error', 'Failed to upload images. Please try again.');
                    setIsSubmitting(false);
                    return;
                }
            }

            console.log('Proceeding with item creation');
            const { error } = await supabase
                .from('items')
                .insert([{
                    ...data,
                    status: 'lost',
                    images: imageUrls,
                    date: new Date().toISOString(),
                    submitter_email: userDetails.email,
                    submitter_name: userDetails.full_name,
                    is_anonymous: false,
                    deleted: false
                }]);

            if (error) {
                console.error('Item creation error:', error);
                throw error;
            }

            Alert.alert(
                'Success',
                'Your lost item has been reported successfully',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Submission error:', error);
            Alert.alert('Error', 'Failed to submit lost item report');
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
                                placeholder="What did you lose?"
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
                            <Text className="text-gray-700 mb-2">Last Seen Location</Text>
                            <TextInput
                                className="bg-white p-3 rounded-lg border border-gray-200"
                                placeholder="Where did you last see it?"
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
                                placeholder="Describe where the owner could find this item (e.g. I handed it to office x in department y"
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

                {/* img upload */}
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
                                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
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
                    className="bg-red-500 py-3 rounded-lg"
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                            <Text className="text-white text-center font-semibold text-lg">
                                Report Lost Item
                            </Text>
                        )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
