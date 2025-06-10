// UploadPage.tsx
import React, { useState } from 'react';
import { Button, View, Text, ActivityIndicator, Pressable, useWindowDimensions } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadFileToDrive, initGoogleDrive } from '@services';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const router = useRouter();
  const { width } = useWindowDimensions();
  const containerWidth = Math.min(width - 40, 600);

  const handleUpload = async () => {
    setStatus('');
    setLoading(true);
    try {
      await initGoogleDrive();

      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        setStatus('❌ File selection cancelled.');
      } else {
        const fileAsset = result.assets[0];
        const file = {
          uri: fileAsset.uri,
          name: fileAsset.name ?? 'file',
          mimeType: fileAsset.mimeType ?? 'application/octet-stream',
        };

        await uploadFileToDrive(file);
        setStatus('✅ Upload successful!');
      }
    } catch (error) {
      console.error(error);
      setStatus('❌ Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
      <View style={{ width: containerWidth, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 20, fontWeight: '600' }}>Upload a File</Text>
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 6, borderRadius: 999, backgroundColor: '#ccc' }}
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
          </Pressable>
        </View>

        <Button title="Select File and Upload" onPress={handleUpload} disabled={loading} />
        {loading && <ActivityIndicator size="large" color="#007AFF" />}
        {!!status && <Text>{status}</Text>}
      </View>
    </View>
  );
}
