import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialCommunityIcons, Fontisto, Feather } from '@expo/vector-icons';
import {
	useAllergies,
	useConditions,
	useGoals,
	useImmunizations,
	useLabResults,
	useMedications,
	useObservations,
	useEducationalMaterials,
	useProcedures,
	useQuestionnaireResponses,
} from '@services';
import {
	Allergy,
	Condition,
	Goal,
	Immunization,
	Medication,
	DiagnosticReport,
	Vital,
	LabImagingReport,
	Procedure,
	DocumentResource,
	QuestionnaireResponse,
} from '@interfaces';
import {
	AllergyCard,
	ConditionCard,
	LabReportCard,
	EducationalMaterialCard,
	GoalCard,
	Header,
	ImmunizationCard,
	MedicationCard,
	MyHealthBlock,
	ProcedureCard,
	VitalCard,
	VitalCardSkeleton,
	QuestionnaireResponseCard,
} from '@components';
import { g } from '@styles/variables';

const s = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: g.neutral100,
	},
	maskedView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		gap: g.hs(32),
		paddingHorizontal: g.ws(16),
		paddingTop: g.hs(32),
	},
	vitalsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		rowGap: g.hs(16),
		justifyContent: 'space-between',
	},
	zeroState: {
		...g.bodyMedium,
		color: g.neutral700,
		opacity: 0.8,
		marginLeft: g.ms(32),
		marginTop: -g.hs(8),
	},
});

export default function Dashboard() {
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const {
		data: vitals,
		isLoading: loadingVitals,
		refetch: refetchObservations,
		hasNextPage: hasNextPageVitals,
		fetchNextPage: fetchNextPageVitals,
	} = useObservations();
	const { data: medications, isLoading: loadingMedications, refetch: refetchMedications } = useMedications();
	const { data: allergies, isLoading: loadingAllergies, refetch: refetchAllergies } = useAllergies();
	const { data: procedures, isLoading: loadingProcedures, refetch: refetchProcedures } = useProcedures();
	const { data: immunizations, isLoading: loadingImmunizations, refetch: refetchImmunizations } = useImmunizations();
	const { data: conditions, isLoading: loadingConditions, refetch: refetchConditions } = useConditions();
	const { data: goals, isFetching: loadingGoals, refetch: refetchGoals } = useGoals();
	const {
		data: questionnaireResponses,
		isLoading: loadingQuestionnaireResponses,
		refetch: refetchQuestionnaireResponses,
	} = useQuestionnaireResponses();
	const { data: labs, isLoading: loadingLabs, refetch: refetchLabResults } = useLabResults();
	const {
		data: educationalMaterials,
		isLoading: loadingEducationalMaterials,
		refetch: refetchEducationalMaterials,
	} = useEducationalMaterials();

	const onRefresh = async () => {
		setRefreshing(true);
		await refetchObservations();
		await refetchMedications();
		await refetchAllergies();
		await refetchProcedures();
		await refetchImmunizations();
		await refetchConditions();
		await refetchLabResults();
		await refetchQuestionnaireResponses();
		await refetchGoals();
		await refetchEducationalMaterials();
		setRefreshing(false);
	};

	const activeGoalStates = ['In Progress', 'Improving', 'Worsening', 'No Change', 'Sustaining'];


	const activeMedications = medications?.filter((med: Medication) => med?.status === 'active');
	const activeConditions = conditions?.filter((condition: Condition) => condition?.clinicalStatus?.text === 'Active');
	const activeGoals = goals?.filter((goal: Goal) =>
		activeGoalStates.includes(goal?.achievementStatus?.coding[0].display)
	);
	const activeAllergies = allergies;
	const recentLabDate = labs?.[0]?.date;
	const recentLabs = labs?.filter(
		(lab: LabImagingReport) => new Date(lab.date).toDateString() === new Date(recentLabDate).toDateString()
	);
	const recentProcedureDate = procedures?.[0]?.performedDateTime;
	const recentProcedures = procedures?.filter(
		(procedure: Procedure) =>
			new Date(procedure.performedDateTime).toDateString() === new Date(recentProcedureDate).toDateString()
	);


	return (
		<View style={s.container}>
			<Header hideBackButton />
			<LinearGradient colors={[g.transparent, g.white]} locations={[0, 0.05]} style={s.maskedView}>
				<ScrollView
					contentContainerStyle={[s.scrollContent, { paddingBottom: g.tabBarHeight + g.hs(120) }]}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor={g.primaryBlue}
							colors={[g.primaryBlue]}
							progressViewOffset={g.hs(20)}
						/>
					}
				>

					{/* Medications */}
					<MyHealthBlock
						viewAllRoute='my-health/medications'
						title='Medications'
						viewAll={!!medications?.length}
						icon={<MaterialCommunityIcons name='pill' size={g.ms(20)} color={g.neutral700} />}
						loading={loadingMedications}
					>
						{loadingMedications ? (
							<ActivityIndicator size='small' color={g.primaryBlue} />
						) : (
							activeMedications?.map((med: Medication) => <MedicationCard key={med.id} med={med} />)
						)}
					</MyHealthBlock>

					{/* Allergies */}
					<MyHealthBlock
						viewAllRoute='my-health/allergies'
						title='Allergies'
						viewAll={!!allergies?.length}
						icon={<MaterialCommunityIcons name='peanut-off-outline' size={g.ms(20)} color={g.neutral700} />}
						loading={loadingAllergies}
					>
						{loadingAllergies ? (
							<ActivityIndicator size='small' color={g.primaryBlue} />
						) : (
							activeAllergies?.map((allergy: Allergy) => (
								<AllergyCard key={allergy.id} allergy={allergy} />
							))
						)}
					</MyHealthBlock>

					{/* Procedures */}
					<MyHealthBlock
						viewAllRoute='my-health/procedures'
						title='Procedures'
						viewAll={procedures?.length > 1}
						icon={<FontAwesome5 name='procedures' size={g.ms(18)} color={g.neutral700} />}
						loading={loadingProcedures}
					>
						{loadingProcedures ? (
							<ActivityIndicator size='small' color={g.primaryBlue} />
						) : (
							recentProcedures?.map((procedure: Procedure) => (
								<ProcedureCard key={procedure.id} procedure={procedure} />
							))
						)}
					</MyHealthBlock>

					{/* Immunizations */}
					<MyHealthBlock
						viewAllRoute='my-health/immunizations'
						title='Immunizations'
						viewAll={immunizations?.length > 1}
						icon={<Fontisto name='injection-syringe' size={g.ms(20)} color={g.neutral700} />}
						loading={loadingImmunizations}
					>
						{loadingImmunizations ? (
							<ActivityIndicator size='small' color={g.primaryBlue} />
						) : (
							immunizations
								?.slice(0, 1)
								.map((immunization: Immunization) => (
									<ImmunizationCard key={immunization.id} immunization={immunization} />
								))
						)}
					</MyHealthBlock>

					{/* Conditions */}
					<MyHealthBlock
						viewAllRoute='my-health/conditions'
						title='Conditions'
						viewAll={!!conditions?.length}
						icon={<FontAwesome5 name='notes-medical' size={g.ms(20)} color={g.neutral700} />}
						loading={loadingConditions}
					>
						{loadingConditions ? (
							<ActivityIndicator size='small' color={g.primaryBlue} />
						) : (
							activeConditions?.map((condition: Condition) => (
								<ConditionCard key={condition.id} condition={condition} />
							))
						)}
					</MyHealthBlock>

					{/* Labs */}
					<MyHealthBlock
						viewAllRoute='my-health/lab-results'
						title='Labs'
						viewAll={!!labs?.length}
						icon={<FontAwesome5 name='vial' size={g.ms(20)} color={g.neutral700} />}
						loading={loadingLabs}
					>
						{loadingLabs ? (
							<ActivityIndicator size='small' color={g.primaryBlue} />
						) : (
							recentLabs?.map((report: LabImagingReport | DiagnosticReport) => (
								<LabReportCard key={report.id} report={report} />
							))
						)}
					</MyHealthBlock>

					{/* Questionnaire Responses */}
					<MyHealthBlock
						title='Questionnaires'
						viewAll={false}
						icon={
							<MaterialCommunityIcons
								name='comment-question-outline'
								size={g.ms(20)}
								color={g.neutral700}
							/>
						}
						loading={loadingQuestionnaireResponses}
					>
						{loadingQuestionnaireResponses ? (
							<ActivityIndicator size='small' color={g.primaryBlue} />
						) : (
							questionnaireResponses?.map((questionnaire: QuestionnaireResponse) => (
								<QuestionnaireResponseCard key={questionnaire.id} response={questionnaire} />
							))
						)}
					</MyHealthBlock>

					{/* Goals */}
					<MyHealthBlock
						viewAllRoute='my-health/goals'
						title='Goals'
						viewAll={!!goals?.length}
						icon={<Feather name='target' size={g.ms(20)} color={g.neutral700} />}
						loading={loadingGoals}
					>
						{loadingGoals ? (
							<ActivityIndicator size='small' color={g.primaryBlue} />
						) : (
							activeGoals?.map((goal: Goal) => <GoalCard key={goal.id} goal={goal} />)
						)}
					</MyHealthBlock>

					{/* Educational Materials */}
					<MyHealthBlock
						viewAllRoute='my-health/education'
						title='Educational Materials'
						viewAll={educationalMaterials?.length > 1}
						icon={
							<MaterialCommunityIcons
								name='book-open-page-variant-outline'
								size={g.ms(20)}
								color={g.neutral700}
							/>
						}
						loading={false}
					>
						{loadingEducationalMaterials ? (
							<ActivityIndicator size='small' color={g.primaryBlue} />
						) : (
							educationalMaterials?.map((item: DocumentResource) => (
								<EducationalMaterialCard key={item.id} data={item} />
							))
						)}
					</MyHealthBlock>
				</ScrollView>
			</LinearGradient>
		</View>
	);
}
