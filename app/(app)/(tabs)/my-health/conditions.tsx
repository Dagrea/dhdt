import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useConditions } from '@services';
import { ConditionCard, StackListView } from '@components';
import { Condition } from '@interfaces';
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

export default function Conditions() {
  const { data, isLoading, refetch } = useConditions();
  const activeConditions = data?.filter((condition) => condition.clinicalStatus.text === 'Active');
  const resolvedConditions = data?.filter((condition) => condition.clinicalStatus.text === 'Resolved');
  return (
    <StackListView
      title="Conditions"
      icon={<FontAwesome5 name="notes-medical" size={g.ms(36)} color={g.neutral700} />}
      isLoading={isLoading}
      refetch={refetch}
    >
      {activeConditions?.length > 0 && (
        <View style={s.scrollSection}>
          <Text style={s.label}>
            Active
          </Text>
          {activeConditions.map((condition: Condition) => (
            <ConditionCard
              key={condition.id}
              condition={condition}
            />
          ))}
        </View>
      )}
      {resolvedConditions?.length > 0 && (
        <View style={s.scrollSection}>
          <Text style={s.label}>
            Resolved
          </Text>
          {resolvedConditions.map((condition: Condition) => (
            <ConditionCard
              key={condition.id}
              condition={condition}
            />
          ))}
        </View>
      )}
    </StackListView>
  );
}
