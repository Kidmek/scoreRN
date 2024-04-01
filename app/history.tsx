import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HistoryType, getHistory } from '~/utils/store';

export default function History() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryType[]>([]);

  const BackButton = () => (
    <TouchableOpacity onPress={router.back}>
      <View style={styles.backButton}>
        <Feather name="chevron-left" size={16} color="#007AFF" />
        <Text style={styles.backButtonText}>Back</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    getHistory().then((value) => {
      if (value) {
        setHistory(value);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '', headerLeft: () => <BackButton /> }} />
      <View style={styles.main}>
        {history.map((history, index) => {
          return (
            <View
              key={index}
              style={{
                gap: 10,
              }}>
              <View style={styles.textContainer}>
                <Text style={{ ...styles.text, ...styles.name }}>{history.name} </Text>
                <View style={styles.numbersContainer}>
                  <Text style={{ ...styles.text, ...styles.numbers }}>{history.prevScore}</Text>
                  <Text style={{ ...styles.text, ...styles.numbers }}>
                    {history.diff > 0 ? ' + ' : ' - '}
                  </Text>
                  <Text style={{ ...styles.text, ...styles.numbers }}>
                    {Math.abs(history.diff)}
                  </Text>
                  <Text style={{ ...styles.text, ...styles.numbers }}>
                    {' '}
                    = {history.prevScore + history.diff}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: StyleSheet.hairlineWidth,
                  backgroundColor: 'grey',
                  width: '100%',
                }}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
  },
  backButtonText: {
    color: '#007AFF',
    marginLeft: 4,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  main: {
    flex: 1,
    maxWidth: 960,
    marginHorizontal: 'auto',
    gap: 20,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  numbersContainer: {
    flexDirection: 'row',
  },
  text: {
    fontWeight: '300',
    fontSize: 20,
  },
  name: {
    fontWeight: '600',
  },
  numbers: {
    fontWeight: '400',
  },
});
