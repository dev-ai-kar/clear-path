import React from 'react';
import { TextInput, StyleSheet, View, Text, TextStyle, TextInputProps } from 'react-native';
import useTheme from '@/hooks/use-soft-theme';

type Props = TextInputProps & {
  label?: string;
  style?: TextStyle;
};

const SoftInput = ({ label, style, ...props }: Props) => {
  const { colors, sizes } = useTheme();

  const inputStyles = StyleSheet.flatten([
    style,
    {
      height: sizes.xl,
      backgroundColor: colors.lightGray,
      borderRadius: sizes.buttonRadius,
      paddingHorizontal: sizes.sm,
      color: colors.darkGray,
      borderWidth: 1,
      borderColor: colors.lightGray,
    },
  ]);

  return (
    <View>
      {label && <Text style={{ marginBottom: sizes.s, color: colors.gray }}>{label}</Text>}
      <TextInput style={inputStyles} {...props} />
    </View>
  );
};

export default SoftInput;
