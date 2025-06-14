import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@interfaces';
import { storageUtil } from '@utils';
import { getToken } from './access-token';

export const Insurers = {
  'Select One': {
    payerId: null,
    transactorType: null,
    code: null
  },
  'CO BCBS': {
    payerId: '00050',
    transactorType: 'Commercial',
    code: 'PPO'
  },
  'CO Kaiser Foundation Health Plan': {
    payerId: '91617',
    transactorType: 'Commercial',
    code: 'HMO'
  },
  'Colorado Access': {
    payerId: '84129',
    transactorType: 'Commercial',
    code: 'SUBSIDIZ'
  },
  'SC BCBS - BlueChoice Commercial': {
    payerId: 'SX085',
    transactorType: 'Commercial',
    code: 'PPO'
  },
  'CO Medicaid': {
    payerId: 'SKCO0',
    transactorType: 'Medicaid',
    code: 'SUBSIDIZ'
  },
};

/**
 * Creates a coverage resource for a patient with the specified insurer and member ID.
 *
 * @param data - The data required to create the coverage resource.
 * @param data.insurer - The name of the insurer.
 * @param data.memberID - The member ID of the patient.
 * @param data.groupNumber - The group number (optional).
 * @throws {Error} If there is an issue with creating the coverage resource.
 */
export async function coverageCreate(data: { insurer: string, memberID: string, groupNumber?: string }) {
  const token = await getToken();
  const provider = Insurers[data?.insurer];
  const patientId = await storageUtil.getItem('patient_id');
  const classes = data?.groupNumber ? [
    {
      type: {
        coding: [
          {
            system: 'http://hl7.org/fhir/ValueSet/coverage-class',
            code: 'group'
          }
        ]
      },
      value: data?.groupNumber
    },
  ] : null;
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/Coverage`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      resourceType: 'Coverage',
      order: 1,
      status: 'active',
      type: {
        coding: [
          {
            system: 'http://hl7.org/fhir/ValueSet/coverage-type',
            code: provider.code,
          }
        ]
      },
      subscriber: {
        reference: `Patient/${patientId}`
      },
      subscriberId: data?.memberID,
      beneficiary: {
        reference: `Patient/${patientId}`
      },
      relationship: {
        coding: [
          {
            system: 'http://hl7.org/fhir/ValueSet/subscriber-relationship',
            code: 'self',
          }
        ]
      },
      payor: [
        {
          identifier: { value: provider.payerId }
        }
      ],
      class: classes
    })
  });
  const json: null | ApiError = await res.json();
  if (json?.issue?.length > 0) throw new Error(json.issue[0].details.text);
}

/**
 * Custom hook for creating a coverage record that handles fetch states and error handling automatically.
 *
 * @returns A mutation function that creates a coverage.
 */
export function useCreateCoverage() {
  return useMutation({
    mutationFn: (data: { insurer: string, memberID: string, groupNumber?: string }) => coverageCreate(data),
    onSuccess: () => router.push('consents'),
    onError: (e) => {
      Alert.alert(
        'Error',
        'There was an error creating your account. Please try again.',
        [
          { text: 'OK' }
        ],
        { cancelable: false }
      );
    },
  });
}

/**
 * Gets the coverage resource for the patient.
 *
 * @throws {Error} If there is an issue with getting the coverage resource.
 */
async function getCoverage() {
  const token = await getToken();
  const patientId = await storageUtil.getItem('patient_id');
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/Coverage?patient=Patient/${patientId}&_count=100&_offset=0`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  });
  const json = await res.json();
  return json.entry?.map((entry: { resource: any; }) => entry.resource)
    .filter((resource: { status: string; }) => resource.status !== 'cancelled')[0] || {};
}

/**
 * Custom hook for fetching patient coverage that handles fetch states, errors, and caching automatically.
 *
 * @returns {QueryResult} The result of the query for patient coverage.
 */
export function useCoverage() {
  return useQuery({
    queryKey: ['patient_coverage'],
    queryFn: () => getCoverage(),
  });
}

/**
 * Updates coverage resource for a patient with the specified insurer and member ID.
 *
 * @param data - The data required to update the coverage resource.
 * @param data.coverageID - The ID of the coverage resource.
 * @param data.insurer - The name of the insurer.
 * @param data.memberID - The member ID of the patient.
 * @param data.groupNumber - The group number (optional).
 * @throws {Error} If there is an issue with creating the coverage resource.
 */
export async function coverageUpdate(data: { coverageID: string, insurer: string, memberID: string, groupNumber: string | undefined }) {
  const token = await getToken();
  const provider = Insurers[data?.insurer];
  const patientId = await storageUtil.getItem('patient_id');
  const classes = data?.groupNumber ? [
    {
      type: {
        coding: [
          {
            system: 'http://hl7.org/fhir/ValueSet/coverage-class',
            code: 'group'
          }
        ]
      },
      value: data?.groupNumber
    },
  ] : null;
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/Coverage/${data?.coverageID}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      resourceType: 'Coverage',
      order: 1,
      status: 'active',
      type: {
        coding: [
          {
            system: 'http://hl7.org/fhir/ValueSet/coverage-type',
            code: provider.code,
          }
        ]
      },
      subscriber: {
        reference: `Patient/${patientId}`
      },
      subscriberId: data?.memberID,
      beneficiary: {
        reference: `Patient/${patientId}`
      },
      relationship: {
        coding: [
          {
            system: 'http://hl7.org/fhir/ValueSet/subscriber-relationship',
            code: 'self',
          }
        ]
      },
      payor: [
        {
          identifier: { value: provider.payerId }
        }
      ],
      class: classes
    })
  });
  if (!res.ok) throw new Error();
}

/**
 * Cancels a coverage resource for a patient with the specified coverageID.
 *
 * @param data - The data required to remove the coverage resource.
 * @param data.coverageID - The ID of the coverage resource.
 * @param data.insurer - The name of the insurer.
 * @param data.memberID - The member ID of the patient.
 * @param data.groupNumber - The group number (optional).
 * @throws {Error} If there is an issue with removing the coverage resource.
 */
export async function coverageCancel(data: { coverageID: string, insurer: string, memberID: string, groupNumber: string | undefined }) {
  const token = await getToken();
  const provider = Insurers[data.insurer];
  const patientId = await storageUtil.getItem('patient_id');
  const date = new Date();
  const currentDay = `${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${(`0${date.getDate()}`).slice(-2)}`;

  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/Coverage/${data.coverageID}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      resourceType: 'Coverage',
      order: 1,
      status: 'cancelled',
      type: {
        coding: [
          {
            system: 'http://hl7.org/fhir/ValueSet/coverage-type',
            code: provider.code,
          }
        ]
      },
      subscriber: {
        reference: `Patient/${patientId}`
      },
      subscriberId: data.memberID,
      beneficiary: {
        reference: `Patient/${patientId}`
      },
      relationship: {
        coding: [
          {
            system: 'http://hl7.org/fhir/ValueSet/subscriber-relationship',
            code: 'self',
          }
        ]
      },
      payor: [
        {
          identifier: { value: provider.payerId }
        }
      ],
      period: {
        end: currentDay
      },
    })
  });
  const json: null | ApiError = await res.json();
  if (json?.issue?.length > 0) throw new Error(json.issue[0].details.text);
}

/**
 * Custom hook for creating a coverage record that handles fetch states and error handling automatically.
 *
 * @returns A mutation function that creates a coverage.
 */
export function useCancelCoverage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { coverageID: string, insurer: string, memberID: string, groupNumber: string | undefined }) => coverageCancel(data),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['patient_data'] }),
        queryClient.invalidateQueries({ queryKey: ['patient_coverage'] })
      ]);
      Alert.alert(
        'Success',
        'Your coverage has been successfully removed.',
        [
          { text: 'OK' }
        ],
        { cancelable: false }
      );
    },
    onError: (e) => {
      Alert.alert(
        'Error',
        'There was an error removing your coverage. Please try again.',
        [
          { text: 'OK' }
        ],
        { cancelable: false }
      );
    },
  });
}
