import { FontAwesome5 } from '@expo/vector-icons';
import { useProcedures } from '@services';
import { ProcedureCard, StackListView } from '@components';
import { Procedure } from '@interfaces';
import { g } from '@styles/variables';

export default function Procedures() {
  const { data, isLoading, refetch } = useProcedures();

  return (
    <StackListView
      title="Procedures"
      icon={<FontAwesome5 name="procedures" size={g.ms(36)} color={g.neutral700} />}
      isLoading={isLoading}
      refetch={refetch}
    >
      {data?.map((procedure: Procedure) => (
        <ProcedureCard
          key={procedure.id}
          procedure={procedure}
        />
      ))}
    </StackListView>
  );
}
