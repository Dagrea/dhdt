import { useQuery } from '@tanstack/react-query';
import { storageUtil } from '@utils';
import { getToken } from './access-token';

/**
 * Retrieves the medications for a specific patient.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of medication objects.
 */
async function getMedications() {
  const token = await getToken();
  const patientID = await storageUtil.getItem('patient_id');
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/MedicationStatement?patient=Patient/${patientID}&_count=100&_offset=0`, {
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
 * Custom hook for fetching medications data that handles fetch states, errors, and caching automatically.
 *
 * @returns {QueryResult} The result of the query for medications.
 */
export function useMedications() {
  return useQuery({
    queryKey: ['medications'],
    queryFn: () => getMedications(),
  });
}
