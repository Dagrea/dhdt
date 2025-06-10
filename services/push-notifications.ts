import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { storageUtil } from '@utils';

/**
 * Schedules a push notification for an appointment.
 * If the appointment already has a push notification scheduled, it will not schedule a new one.
 * The notification will be triggered 30 minutes before the appointment start time.
 *
 * @param {Object} options - The options for scheduling the push notification.
 * @param {string} options.appointmentStartTime - The start time of the appointment.
 * @param {string} options.formattedTime - The formatted time of the appointment.
 * @param {string} options.appointmentDescription - The description of the appointment.
 * @param {string} options.appointmentID - The ID of the appointment.
 * @param {boolean} [options.checkedIfScheduled] - Optional flag indicating if the appointment has already been checked for a scheduled notification.
 * @returns {Promise<void>} A promise that resolves when the push notification is scheduled.
 */
export async function schedulePushNotification({
  appointmentStartTime,
  formattedTime,
  appointmentDescription,
  appointmentID,
  checkedIfScheduled,
}: {
  appointmentStartTime: string,
  formattedTime: string,
  appointmentDescription: string,
  appointmentID: string,
  checkedIfScheduled?: boolean,
}): Promise<void> {
  // Checking to see if this appointment already has a push notification scheduled

  const trigger = new Date(appointmentStartTime);
  trigger.setMinutes(trigger.getMinutes() - 30);
}

/**
 * Registers the device for push notifications.
 * This function sets up the necessary notification channel for Android devices,
 * requests permission to send notifications, and retrieves the Expo push token.
 * The push token is then stored securely using SecureStore.
 *
 * @returns {Promise<void>} A promise that resolves when the device is registered for push notifications.
 */
export async function registerForPushNotificationsAsync(): Promise<any> {

}
