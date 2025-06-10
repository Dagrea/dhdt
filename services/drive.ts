import { useEffect, useState, useCallback } from 'react';
import { initGoogleDrive, listFilesInFolder } from '@services';

export const useDriveFiles = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      await initGoogleDrive();
      const res = await listFilesInFolder();
      setFiles(res);
    } catch (e) {
      console.error('Error fetching drive files:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return {
    files,
    loading,
    refetch: fetchFiles,
  };
};
