import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMedications } from '@services';
import { Medication } from '@interfaces';
import { MedicationCard, StackListView } from '@components';
import { g } from '@styles/variables';

const s = StyleSheet.create({
  label: {
    ...g.titleXSmall,
    color: g.neutral700,
    marginLeft: g.ms(4),
  },
  scrollSection: {
    gap: g.hs(16),
  },
});

export default function Medications() {
  const { data, isLoading, refetch } = useMedications();
  const activeStatuses = ['active', 'intended'];
  const activeMedications = data?.filter((med: Medication) => activeStatuses.includes(med.status));
  const expiredMedications = data?.filter((med: Medication) => !activeStatuses.includes(med.status));

  return (
    <StackListView
      title="Medications"
      icon={<MaterialCommunityIcons name="pill" size={g.ms(36)} color={g.neutral700} />}
      isLoading={isLoading}
      refetch={refetch}
    >
      {activeMedications.length > 0 && (
        <View style={s.scrollSection}>
          <Text style={s.label}>
            Active
          </Text>
          {activeMedications.map((med: Medication) => <MedicationCard key={med.id} med={med} />)}
        </View>
      )}
      {expiredMedications.length > 0 && (
        <View style={s.scrollSection}>
          <Text style={s.label}>
            Inactive
          </Text>
          {expiredMedications.map((med: Medication) => <MedicationCard key={med.id} med={med} />)}
        </View>
      )}
    </StackListView>
  );
}
