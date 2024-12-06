import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { decode } from 'base64-arraybuffer';
import { supabase } from './supabase';
import { Alert } from 'react-native';

export type ImageSource = 'camera' | 'library';

export const pickImage = async (source: ImageSource): Promise<string | null> => {
    try {
        const { status } = source === 'camera'
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                `Please grant ${source} permissions to continue`,
                [{ text: 'OK' }]
            );
            return null;
        }

        const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        };

        const result = source === 'camera'
            ? await ImagePicker.launchCameraAsync(options)
            : await ImagePicker.launchImageLibraryAsync(options);

        if (!result.canceled && result.assets[0]) {
            // Verify the original image
            const originalFileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
            console.log('Original file size:', originalFileInfo.size);

            // Compress and resize the image
            const compressed = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 1000 } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );

            // Verify the compressed image
            const compressedFileInfo = await FileSystem.getInfoAsync(compressed.uri);
            console.log('Compressed file size:', compressedFileInfo.size);

            return compressed.uri;
        }

        return null;
    } catch (error) {
        console.error('Error in pickImage:', error);
        Alert.alert('Error', 'Failed to pick image. Please try again.');
        return null;
    }
};

export const uploadImage = async (uri: string): Promise<string> => {
    try {
        // Verify file exists and has content
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
            throw new Error('File does not exist');
        }
        if (fileInfo.size === 0) {
            throw new Error('File is empty');
        }

        // Generate unique filename
        const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;

        // Read file as base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Decode base64 to ArrayBuffer
        const arrayBuffer = decode(base64);

        // Upload to Supabase
        const { data, error } = await supabase.storage
            .from('items-images')
            .upload(fileName, arrayBuffer, {
                contentType: 'image/jpeg',
                upsert: false,
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('items-images')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error('Error in uploadImage:', error);
        throw error;
    }
};
