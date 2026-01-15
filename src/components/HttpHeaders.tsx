import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme, useThemedStyles } from '../theme';
import Header from './Header';

interface Props {
  title: string;
  headers?: object;
}

const HttpHeaders = ({ title = 'Headers', headers }: Props) => {
  const styles = useThemedStyles(themedStyles);

  return (
    <View>
      <Header shareContent={headers && JSON.stringify(headers, null, 2)}>
        {title}
      </Header>

      <View style={styles.content}>
        {Object.entries(headers || {}).map(([name, value]) => (
          <View style={{ marginBottom: 8 }} key={name}>
            <View style={{}}>
              <Text style={styles.headerKey}>{name}</Text>
            </View>
            <View style={{}}>
              <Text style={[styles.headerValue, { fontStyle: 'italic' }]}>
                {value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    headerKey: {
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    headerValue: {
      color: theme.colors.text,
    },
    content: {
      backgroundColor: theme.colors.card,
      padding: 10,
      color: theme.colors.text,
    },
  });

export default HttpHeaders;
