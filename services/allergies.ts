import { useQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { getToken } from './access-token';

/**
 * Retrieves the allergies for a specific patient.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of allergy resources.
 */
async function getAllergies() {
  const token = await getToken();
  const patientId = await SecureStore.getItemAsync('patient_id');
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/AllergyIntolerance/?patient__key=${patientId}`, {
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
 * Custom hook for fetching allergies data that handles fetch states, errors, and caching automatically.
 *
 * @returns {QueryResult} The result of the query for allergies.
 */
export function useAllergies() {
  return useQuery({
    queryKey: ['allergies'],
    queryFn: () => getAllergies(),
  });
}
