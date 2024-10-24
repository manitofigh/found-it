import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import supabase from './supabase';

export const pickImage = async (options: 'camera' | 'library') => {
    try {
        let result;
        
        if (options === 'camera') {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                throw new Error('Camera permission required');
            }
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });
        } else {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                throw new Error('Media library permission required');
            }
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });
        }

        if (!result.canceled) {
            const compressed = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 1000 } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            
            return compressed.uri;
        }
        return null;
    } catch (error) {
        console.error('Error picking image:', error);
        throw error;
    }
};

export const uploadImage = async (uri: string, folder: string): Promise<string> => {
    try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        
        const fileName = `${Date.now()}.jpg`;
        const filePath = `${folder}/${fileName}`;
        
        const { data, error } = await supabase.storage
            .from('item-images')
            .upload(filePath, decode(base64), {
                contentType: 'image/jpeg',
                cacheControl: '3600',
            });

        if (error) throw error;
        
        return data.path;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
