import { useQuery } from '@tanstack/react-query';
import { storageUtil } from '@utils';
import { getToken } from './access-token';

/**
 * Retrieves educational materials for a specific patient.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of educational materials.
 */
async function getEducationalMaterials() {
  const token = await getToken();
  const patientID = await storageUtil.getItem('patient_id');
  const apiURL = process.env.EXPO_PUBLIC_API_URL;
  const res = await fetch(`${apiURL}/api/DocumentReference?subject=Patient/${patientID}&category=educationalmaterial&_count=100&_offset=0`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json'
    }
  });
  const json = await res.json();
  return json.entry?.map((entry) => entry.resource) || [];
}

/**
 * Custom hook for fetching educational materials that handles fetch states, errors, and caching automatically.
 *
 * @returns {QueryResult} The result of the query for educational materials.
 */
export function useEducationalMaterials() {
  return useQuery({
    queryKey: ['educational-materials'],
    queryFn: () => getEducationalMaterials(),
  });
}
