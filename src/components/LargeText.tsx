import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';

const LargeText: React.FC<{ children: string }> = ({ children }) => {
  // split into chunks of 1000 characters
  // this is a hack to avoid a text render bug on ios that causes the text to not render at all
  const chunks = children.match(/.{1,1000}/g);

  if (chunks) {
    return (
      <View>
        {chunks.map((chunk, index) => (
          <View key={index}>
            <ThemedText style={styles.text}>{chunk}</ThemedText>
          </View>
        ))}
      </View>
    );
  }

  return (
    <ThemedText colorKey="statusBad">
      Error while rendering large text
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
});

export default LargeText;
