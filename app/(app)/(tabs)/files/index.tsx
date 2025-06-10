// FilesPage.tsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, Linking, ActivityIndicator, Pressable, Image, useWindowDimensions } from 'react-native';
import { useDriveFiles } from '@services';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FilesPage() {
	const { files, loading, refetch } = useDriveFiles();
	const router = useRouter();
	const { width } = useWindowDimensions();

	const cardWidth = Math.min(width - 40, 600);

	useEffect(() => {
		refetch();
	}, []);

	const renderItem = ({ item }) => {
    const isImage = item.mimeType?.startsWith('image/');
    const formattedDate = item.createdTime
      ? format(new Date(item.createdTime), 'yyyy-MM-dd HH:mm')
      : 'Unknown';
    const fileSizeMB = item.size
      ? `${(item.size / (1024 * 1024)).toFixed(2)} MB`
      : 'Unknown size';
  
    return (
      <Pressable
        onPress={() => Linking.openURL(item.webViewLink)}
        style={{
          width: '100%',
          maxWidth: 600,
          flexDirection: 'row',
          alignSelf: 'center',
          gap: 12,
          padding: 12,
          marginBottom: 12,
          borderRadius: 12,
          backgroundColor: '#f9f9f9',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        {/* Картинка слева */}
        {isImage && item.thumbnailLink ? (
          <Image
            source={{ uri: item.thumbnailLink }}
            style={{
              width: 200,
              height: 200,
              borderRadius: 8,
              backgroundColor: '#eee',
            }}
            resizeMode="contain"
          />
        ) : (
          <View
            style={{
              width: 200,
              height: 200,
              borderRadius: 8,
              backgroundColor: '#ddd',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 40 }}>📄</Text>
          </View>
        )}
  
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
          <Text style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{item.mimeType}</Text>
          <Text style={{ fontSize: 13, color: '#666' }}>📅 {formattedDate}</Text>
          <Text style={{ fontSize: 13, color: '#666' }}>📦 {fileSizeMB}</Text>
        </View>
      </Pressable>
    );
  };

	return (
		<View style={{ flex: 1, padding: 20 }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 12,
				}}
			>
				<Text style={{ fontSize: 22, fontWeight: '700' }}>Drive Files</Text>
				<Pressable
					onPress={() => router.push('/files/upload')}
					style={{
						backgroundColor: '#007AFF',
						padding: 8,
						borderRadius: 999,
					}}
				>
					<Ionicons name='add' size={24} color='#fff' />
				</Pressable>
			</View>

			<Pressable onPress={refetch} style={{ marginBottom: 16 }}>
				<Text style={{ color: '#007AFF', fontSize: 16 }}>🔄 Refresh</Text>
			</Pressable>

			{loading ? (
				<ActivityIndicator size='large' color='#007AFF' style={{ marginTop: 20 }} />
			) : files.length === 0 ? (
				<Text style={{ marginTop: 20 }}>No files found.</Text>
			) : (
				<FlatList
					data={files}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
          numColumns={3}
					showsVerticalScrollIndicator={false}
				/>
			)}
		</View>
	);
}
