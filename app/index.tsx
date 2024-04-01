import { Feather } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import CheckModal from '~/components/CheckModal';
import {
  HistoryType,
  Player,
  addHistory,
  getHistory,
  getPlayers,
  getScoredBalls,
  saveScoredBalls,
  storePlayers,
} from '~/utils/store';

export default function Page() {
  const [players, setPlayers] = useState([
    {
      name: '',
      score: 0,
    },
    {
      name: '',
      score: 0,
    },
    {
      name: '',
      score: 0,
    },
    {
      name: '',
      score: 0,
    },
  ]);
  const prevState = useRef<{
    score: Player[];
    ball: number;
    scoredBalls: number[];
  }>({
    score: [
      {
        name: '',
        score: 0,
      },
      {
        name: '',
        score: 0,
      },
      {
        name: '',
        score: 0,
      },
      {
        name: '',
        score: 0,
      },
    ],
    ball: 1,
    scoredBalls: [],
  });

  const history = useRef<HistoryType[]>([]);
  const scoredBalls = useRef<number[]>([]);
  const [current, setCurrent] = useState(1);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const onNameChange = (name: string, index: number) => {
    setPlayers(
      players.map((p, i) => {
        if (index === i) {
          p.name = name;
        }
        return p;
      })
    );
  };

  const onScoreChange = (plus: boolean, index: number) => {
    if (plus && current < 15) {
      setCurrent(current + 1);
    }
    history.current.push({
      name: players[index].name || `Player ${index + 1}`,
      prevScore: players[index].score,
      diff: plus ? current : current * -1,
    });
    prevState.current = {
      score: players.map((p) => {
        return { ...p };
      }),
      ball: current,
      scoredBalls: [...scoredBalls.current],
    };
    setPlayers((prev) => {
      return prev.map((p, i) => {
        if (index === i) {
          if (plus) {
            if (current > 2 && !scoredBalls.current.includes(current)) {
              scoredBalls.current = [...scoredBalls.current, current];
            }
            if (current === 3) {
              p.score += 6;
            } else {
              p.score += current;
            }
          } else {
            p.score -= current;
          }
        }
        return p;
      });
    });
  };

  const revertGame = () => {
    setPlayers([...prevState.current.score]);
    setCurrent(prevState.current.ball);
    scoredBalls.current = prevState.current.scoredBalls;
  };

  const resetGame = () => {
    history.current = [];
    scoredBalls.current = [];
    prevState.current = {
      score: [...players],
      ball: current,
      scoredBalls: [...scoredBalls.current],
    };

    setCurrent(3);
    setPlayers([
      {
        name: '',
        score: 0,
      },
      {
        name: '',
        score: 0,
      },
      {
        name: '',
        score: 0,
      },
      {
        name: '',
        score: 0,
      },
    ]);
  };

  const SinglePlayer = (index: number) => {
    return (
      <View style={styles.playerContainer}>
        <TextInput
          style={styles.input}
          value={players[index]?.name}
          onChangeText={(value) => onNameChange(value, index)}
          placeholder={`Player ${index + 1}`}
        />

        <View style={styles.valueContainer}>
          <TouchableOpacity
            style={{ ...styles.button, ...styles.valueButtons }}
            onPress={() => onScoreChange(false, index)}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.value}>{players[index]?.score}</Text>
          <TouchableOpacity
            style={{ ...styles.button, ...styles.valueButtons }}
            onPress={() => onScoreChange(true, index)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const RevertButton = () => (
    <TouchableOpacity onPress={revertGame}>
      <View style={styles.backButton}>
        <Feather name="refresh-ccw" size={20} color="#007AFF" />
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    return () => {
      storePlayers(players, current);
      addHistory(history.current);
    };
  }, [players]);

  useEffect(() => {
    return () => {
      console.log('Saving Scored:', scoredBalls.current);
      saveScoredBalls(scoredBalls.current);
    };
  }, [scoredBalls]);

  useEffect(() => {
    getPlayers().then((value) => {
      if (value) {
        setCurrent(value.ball);
        setPlayers(value.players);
      }
    });
    getHistory().then((value) => {
      if (value) {
        history.current = value;
      }
    });
    getScoredBalls().then((value) => {
      if (value) {
        console.log('Saved Scored:', value);
        scoredBalls.current = value;
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Stack.Screen options={{ title: 'Score', headerRight: () => <RevertButton /> }} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.sliderContainer}>
            {Array.from({ length: 15 }, (_, i) => i + 1).map((ball) => (
              <TouchableOpacity
                onPress={() => setCurrent(ball)}
                key={ball}
                style={{
                  ...styles.ball,
                  backgroundColor: current === ball ? 'red' : 'transparent',
                }}>
                <Text style={{ ...styles.buttonText, color: current === ball ? 'white' : 'black' }}>
                  {ball}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.playersList}>
            {SinglePlayer(0)}
            {SinglePlayer(1)}
            {SinglePlayer(2)}
            {SinglePlayer(3)}
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={resetGame}>
              <Text style={styles.buttonText}>New Game</Text>
            </TouchableOpacity>
            <View style={styles.footerRow}>
              <Link href="/history" asChild push>
                <TouchableOpacity style={styles.footerRowBtn}>
                  <Text style={styles.buttonText}>History</Text>
                </TouchableOpacity>
              </Link>
              <TouchableOpacity style={styles.footerRowBtn} onPress={() => setPopUpVisible(true)}>
                <Text style={styles.buttonText}>Check</Text>
              </TouchableOpacity>
              <CheckModal
                close={() => setPopUpVisible(false)}
                visible={popUpVisible}
                players={players}
                scored={scoredBalls.current}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 24,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
  },
  backButtonText: {
    color: '#007AFF',
    marginLeft: 4,
  },
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  input: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flex: 1,
    fontSize: 20,
  },
  value: {
    fontSize: 30,
    fontWeight: '600',
    width: '30%',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingVertical: 24,
    gap: 30,
    flexDirection: 'column',
  },
  playerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  playersList: {
    gap: 30,
    padding: 24,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'flex-end',
    width: '45%',
  },
  valueButtons: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#6366F1AF',
  },
  sliderContainer: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ball: {
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    width: Dimensions.get('screen').width / 13,
    height: Dimensions.get('screen').width / 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    paddingBottom: 30,
    paddingHorizontal: 24,
    gap: 20,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 40,
  },
  footerRowBtn: {
    alignItems: 'center',
    backgroundColor: '#6366A6',
    borderRadius: 24,
    padding: 16,
    flex: 1,
  },
});
