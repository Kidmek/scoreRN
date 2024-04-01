import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from 'react-native';

import { Player } from '~/utils/store';

type Props = {
  visible: boolean;
  close: () => void;
  players: Player[];
  scored: number[];
};
const height = Dimensions.get('screen').height;

export default function CheckModal({ visible, close, players, scored }: Props) {
  const [scoredBalls, setScoredBalls] = useState<number[]>([]);
  const sortedPlayers = [...players]
    .map((p, i) => {
      return {
        ...p,
        i,
      };
    })
    .sort((a, b) => b.score - a.score);

  const ballsLeft =
    120 - scoredBalls.reduce((partialSum, a) => (a === 3 ? partialSum + 6 : partialSum + a), 0);

  useEffect(() => {
    setScoredBalls(scored);
  }, [scored]);
  return (
    <Modal visible={visible} transparent onRequestClose={close}>
      <TouchableWithoutFeedback onPress={close}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View
        style={{
          ...styles.modalContent,
        }}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeBtn} onPress={close}>
            <Feather name="x-circle" size={30} />
          </TouchableOpacity>
          <View style={styles.header}>
            <View style={styles.sliderContainer}>
              {Array.from({ length: 13 }, (_, i) => i + 3).map((ball) => (
                <TouchableOpacity
                  onPress={() => {
                    if (!scoredBalls.includes(ball)) {
                      setScoredBalls([...scoredBalls, ball]);
                    } else {
                      setScoredBalls(scoredBalls.filter((s) => s !== ball));
                    }
                  }}
                  key={ball}
                  style={{
                    ...styles.ball,
                    backgroundColor: scoredBalls.includes(ball) ? '#1817292A' : 'transparent',
                  }}>
                  <Text
                    style={{
                      ...styles.buttonText,
                      fontSize: 16,
                      color: scoredBalls.includes(ball) ? 'grey' : 'black',
                      textDecorationLine: scoredBalls.includes(ball) ? 'line-through' : 'none',
                      textDecorationStyle: 'dotted',
                    }}>
                    {ball}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.ballsLeft}>
              <Text style={{ ...styles.buttonText, color: 'black' }}>Balls Left </Text>
              <Text
                style={{ ...styles.buttonText, textDecorationLine: 'underline', color: '#007AFF' }}>
                {ballsLeft}
              </Text>
            </View>
          </View>
          <View style={styles.playerContainer}>
            {sortedPlayers.map((p, index) => {
              const isOut = index !== 0 && ballsLeft + p.score < sortedPlayers[0].score;
              return (
                <View key={p.i} style={styles.singlePlayer}>
                  <View style={{ flexDirection: 'row', gap: 5 }}>
                    <Text style={{ width: '20%' }}>
                      {index + 1}
                      <Text>
                        {index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'}
                      </Text>
                    </Text>
                    <Text>{p.name || `Player ${p.i + 1}`}</Text>
                  </View>
                  {isOut && (
                    <Text
                      style={{
                        color: 'red',
                      }}>
                      Out
                    </Text>
                  )}

                  <View>
                    <Text>Score: {p.score}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    justifyContent: 'center',
    marginVertical: '50%',
    marginHorizontal: '5%',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    gap: 10,
    marginVertical: 10,
  },
  content: {
    backgroundColor: '#fffd',
    borderRadius: 10,
    // borderWidth: 1,
    height: height * 0.5,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  sliderContainer: {
    flexDirection: 'row',
    gap: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ball: {
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    width: Dimensions.get('screen').width / 14,
    height: Dimensions.get('screen').width / 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  ballsLeft: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  playerContainer: {
    gap: 10,
    paddingHorizontal: 24,
  },
  singlePlayer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
