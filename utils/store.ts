import AsyncStorage from '@react-native-async-storage/async-storage';

export type Player = {
  name: string;
  score: number;
};

type Data = {
  players: Player[];
  ball: number;
};

export type HistoryType = {
  name: string;
  prevScore: number;
  diff: number;
};

export const storePlayers = async (players: Player[], ball: number) => {
  try {
    const jsonValue = JSON.stringify({ players, ball });
    await AsyncStorage.setItem('players', jsonValue);
  } catch (e) {
    console.log('Error Saving', e);
    // saving error
  }
};
export const addHistory = async (history: HistoryType[]) => {
  try {
    const jsonValue = JSON.stringify(history);
    await AsyncStorage.setItem('history', jsonValue);
  } catch (e) {
    console.log('Error Saving', e);
    // saving error
  }
};
export const saveScoredBalls = async (balls: number[]) => {
  try {
    const jsonValue = JSON.stringify(balls);
    await AsyncStorage.setItem('balls', jsonValue);
  } catch (e) {
    console.log('Error Saving', e);
    // saving error
  }
};
export const getPlayers = async () => {
  try {
    const value = await AsyncStorage.getItem('players');
    if (value != null) {
      return JSON.parse(value) as Data;
    } else {
      return null;
    }
  } catch (e) {
    console.log('Error Getting', e);
    return null;
    // error reading value
  }
};

export const getHistory = async () => {
  try {
    const value = await AsyncStorage.getItem('history');
    if (value != null) {
      return JSON.parse(value) as HistoryType[];
    } else {
      return null;
    }
  } catch (e) {
    console.log('Error Getting', e);
    return null;
    // error reading value
  }
};

export const getScoredBalls = async () => {
  try {
    const value = await AsyncStorage.getItem('balls');
    if (value != null) {
      return JSON.parse(value) as number[];
    } else {
      return null;
    }
  } catch (e) {
    console.log('Error Getting', e);
    return null;
    // error reading value
  }
};
