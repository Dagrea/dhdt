import { useQuery } from '@tanstack/react-query';
import { storageUtil } from '@utils';
import { getToken } from './access-token';

/**
 * Retrieves the goals for a specific patient.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of goal objects.
 */
async function getGoals() {
  const token = await getToken();
  const patientId = await storageUtil.getItem('patient_id');
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/Goal?patient=Patient/${patientId}&_count=100&_offset=0`, {
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
 * Custom hook for fetching goals data that handles fetch states, errors, and caching automatically.
 *
 * @returns {QueryResult} The result of the query for goals.
 */
export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: () => getGoals(),
  });
}
