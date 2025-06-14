import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useQuestionnaireResponse } from '@services';
import graphic from '@assets/images/graphic.png';
import { g } from '@styles/variables';

const s = StyleSheet.create({
  answer: {
    ...g.labelMedium,
    flex: 1,
    color: g.neutral900,
  },
  container: {
    flex: 1,
    backgroundColor: g.white,
  },
  graphic: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '66%',
    aspectRatio: 1,
  },
  header: {
    paddingHorizontal: g.ms(20),
    paddingBottom: g.hs(24),
    paddingTop: Platform.OS === 'android' ? g.hs(40) : g.hs(24),
    backgroundColor: g.tertiaryBlue,
    overflow: 'hidden',
    borderBottomLeftRadius: g.ms(28),
    borderBottomRightRadius: g.ms(28),
    alignItems: 'flex-start',
  },
  lineLabel: {
    ...g.titleXSmall,
    color: g.neutral900,
    lineHeight: g.ms(20),
  },
  loading: {
    flex: 1,
  },
  qaRow: {
    flexDirection: 'row',
    gap: g.ms(12),
  },
  question: {
    ...g.bodyLarge,
    flex: 1,
    color: g.neutral600,
  },
  questionContainer: {
    gap: g.hs(8),
    paddingVertical: g.hs(20),
  },
  questionContainerBottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: g.neutral300,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: g.ms(24),
  },
  title: {
    ...g.titleLarge,
    color: g.white,
    alignSelf: 'center',
    textAlign: 'center',
  },
});

export default function QuestionnaireResponseDetails() {
  const params = useLocalSearchParams();
  const { responseId } = params;
  const { data, isLoading } = useQuestionnaireResponse(responseId as string);
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Image
          style={s.graphic}
          source={graphic}
          contentFit="fill"
        />
        <TouchableOpacity onPress={() => router.back()}>
          <Feather
            name="arrow-left"
            size={g.ms(40)}
            color={g.white}
          />
        </TouchableOpacity>
        <Text style={s.title}>
          Completed Questionnaire
        </Text>
      </View>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
      >
        {isLoading
          ? <ActivityIndicator color={g.primaryBlue} size="large" style={s.loading} />
          : (
            <>
              {data?.item.map(({ answer, text }, i) => (
                <View
                  key={text}
                  style={[
                    s.questionContainer,
                    i !== data.item.length - 1 && s.questionContainerBottomBorder,
                  ]}
                >
                  <View style={s.qaRow}>
                    <Text style={s.lineLabel}>
                      Q:
                    </Text>
                    <Text style={s.question}>
                      {text}
                    </Text>
                  </View>
                  <View style={s.qaRow}>
                    <Text style={s.lineLabel}>
                      A:
                    </Text>
                    <Text style={s.answer}>
                      {answer[0].valueCoding?.display || answer[0].valueString}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )
        }
      </ScrollView>
    </View>
  );
}
