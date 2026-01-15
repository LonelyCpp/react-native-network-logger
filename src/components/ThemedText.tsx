import React from 'react';
import { Text, TextProps } from 'react-native';
import { Theme, useTheme } from '../theme';

type ThemedTextProps = TextProps & {
  colorKey?: keyof Theme['colors'];
};

const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  colorKey = 'text',
  style,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Text style={[style, { color: theme.colors[colorKey] }]} {...props}>
      {children}
    </Text>
  );
};

export default ThemedText;
