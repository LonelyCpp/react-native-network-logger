import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Theme, useThemedStyles } from '../theme';
import { NetworkRequestInfoRow } from '../types';
import ThemedText from './ThemedText';

interface Props {
  style?: any;
  numberOfLines?: number;
  onPress?(): void;
  compact?: boolean;
  request: NetworkRequestInfoRow;
}

const ResultItem: React.FC<Props> = ({ request, onPress, numberOfLines }) => {
  const styles = useThemedStyles(themedStyles);

  const gqlOperation = request.gqlOperation;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ThemedText style={styles.topText}>
        {''}
        <Text>{getTime(request.startTime)}</Text>
        {gqlOperation ? <Text>{` (${gqlOperation})`}</Text> : null}
        {' | '}
        {'Status '}
        <Text>{request.status > 0 ? request.status : '(pending)'}</Text>
        {', '}
        <Text>{request.duration > 0 ? formatTime(request.duration) : ''}</Text>
      </ThemedText>

      <ThemedText
        numberOfLines={numberOfLines}
        colorKey={getStatusTextColor(request.status)}
      >
        <Text style={[{ fontWeight: 'bold' }]}>
          {request.method}
          {' : '}
        </Text>
        <Text>{request.url}</Text>
      </ThemedText>
    </TouchableOpacity>
  );
};

const getStatusTextColor = (status: number) => {
  if (status < 0) {
    return 'text';
  }
  if (status < 400) {
    return 'statusGood';
  }
  if (status < 500) {
    return 'statusWarning';
  }
  return 'statusBad';
};

const pad = (num: number) => `0${num}`.slice(-2);

const getTime = (time: number) => {
  if (time === 0) return ''; // invalid time
  const date = new Date(time);
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${hours}:${minutes}:${seconds}`;
};

const formatTime = (ms: number) => {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.card,
      borderBottomColor: theme.colors.muted,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    topText: {
      marginBottom: 4,
      fontSize: 10,
    },
  });

export default ResultItem;
