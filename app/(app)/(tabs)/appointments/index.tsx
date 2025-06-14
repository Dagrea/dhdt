import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FlashList } from '@shopify/flash-list';
import { AppointmentCard, Header, FlashListSeparator, ZeroState } from '@components';
import { Appointment } from '@interfaces';
import { schedulePushNotification, useAppointments } from '@services';
import { formatTime } from '@utils';
import doctor from '@assets/images/doctor.svg';
import { g } from '@styles/variables';

const s = StyleSheet.create({
  bookAppointmentButton: {
    ...g.buttonShadow,
    width: g.ms(72),
    height: g.ms(72),
    borderRadius: g.ms(36),
    backgroundColor: g.secondaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: g.ms(12),
    opacity: 0.9,
  },
  container: {
    flex: 1,
    backgroundColor: g.neutral100,
  },
  loading: {
    flex: 1,
    paddingBottom: g.hs(120),
  },
  maskedView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: g.ws(16),
    paddingTop: g.hs(28),
  },
  sectionLabel: {
    ...g.titleXSmall,
    color: g.neutral700,
    marginTop: g.hs(4),
    marginBottom: -g.hs(8),
  },
  title: {
    ...g.titleLarge,
    color: g.neutral700,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: g.ms(12),
    paddingLeft: g.ws(14),
    marginTop: g.hs(20),
  }
});

export default function Appointments() {
  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useAppointments();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const upcomingAppointments = data?.pages.flat().filter((appointment: Appointment) => new Date(appointment.start) > new Date()).reverse() ?? [];
  const pastAppointments = data?.pages.flat().filter((appointment: Appointment) => new Date(appointment.start) <= new Date()) ?? [];
  const appointments: (string | Appointment)[] = [
    'Upcoming',
    ...upcomingAppointments,
    'Past',
    ...pastAppointments,
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={s.container}>
      <Header hideBackButton />
      <View style={s.titleContainer}>
        <MaterialCommunityIcons name="calendar-heart" size={g.ms(36)} color={g.neutral700} />
        <Text style={s.title}>
          Appointments
        </Text>
      </View>
      {isLoading
        ? <ActivityIndicator size="large" color={g.primaryBlue} style={s.loading} />
        : (
          <MaskedView
            style={s.maskedView}
            maskElement={(
              <LinearGradient
                style={s.maskedView}
                colors={[g.transparent, g.white]}
                locations={[0.0175, 0.065]}
              />
            )}
          >
            {appointments?.length > 2 ? (
              <FlashList
                data={appointments}
                contentContainerStyle={{
                  ...s.scrollContent,
                  paddingBottom: g.tabBarHeight + g.hs(120),
                }}
                getItemType={(item) => {
                  if (typeof item === 'string') return 'sectionHeader';
                  return 'row';
                }}
                renderItem={({ item }) => {
                  if (typeof item === 'string') return <Text style={s.sectionLabel}>{item}</Text>;
                  return (
                    <AppointmentCard
                      key={item.id}
                      appointment={item}
                    />
                  );
                }}
                refreshControl={(
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={g.primaryBlue}
                    colors={[g.primaryBlue]}
                    progressViewOffset={g.hs(32)}
                  />
                )}
                ItemSeparatorComponent={() => FlashListSeparator()}
                estimatedItemSize={g.hs(120)}
                onEndReached={() => {
                  if (hasNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.1}
                ListFooterComponent={isFetchingNextPage && (
                  <ActivityIndicator
                    size="large"
                    color={g.primaryBlue}
                    style={{ marginTop: g.hs(40) }}
                  />
                )}
              />
            ) : (
              <ZeroState
                image={doctor}
                imageAspectRatio={1.4}
                text="You have no upcoming appointments. Press the plus icon below to book one!"
              />
            )}
          </MaskedView>
        )}
      <TouchableOpacity
        style={[
          s.bookAppointmentButton,
          { bottom: g.tabBarHeight + g.hs(12) },
        ]}
        onPress={() => router.push('appointments/book-appointment')}
      >
        <MaterialCommunityIcons name="calendar-plus" size={g.ms(36)} color={g.white} />
      </TouchableOpacity>
    </View>
  );
}
