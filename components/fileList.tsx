import { useDriveFiles } from '@services';
import { View, Text, Linking } from 'react-native';

export const FileList = () => {
  const { files, loading } = useDriveFiles();

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      {files.map(file => (
        <Text key={file.id} onPress={() => Linking.openURL(file.webViewLink)}>
          {file.name}
        </Text>
      ))}
    </View>
  );
};