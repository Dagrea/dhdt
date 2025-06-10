import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { usePatient } from '@services';
import graphic from '@assets/images/graphic.png';
import { g } from '@styles/variables';

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: g.tertiaryBlue,
  },
  graphic: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: g.width * 0.8,
    aspectRatio: 59 / 77,
  },
});

export default function Index() {
  const { isFetching, data: patient } = usePatient();

  useEffect(() => {
    if (isFetching) return;

    if (patient?.id) {
      router.replace('(tabs)/my-health');
    } else {
      router.replace('initial');
    }
  }, [patient, isFetching]);

  return (
    <View style={s.container}>
      <Image source={graphic} style={s.graphic} />
    </View>
  );
}
