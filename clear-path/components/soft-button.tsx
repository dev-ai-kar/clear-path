import React from 'react';
import { TouchableOpacity, StyleSheet, Text, ViewStyle, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useTheme from '@/hooks/use-soft-theme';

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
};

const SoftButton = ({ title, onPress, style, ...props }: Props) => {
  const { colors, sizes, gradients } = useTheme();

  const buttonStyles = StyleSheet.flatten([
    style,
    {
      minHeight: sizes.xl,
      minWidth: sizes.xl,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: sizes.buttonRadius,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: sizes.shadowOffsetWidth,
        height: sizes.shadowOffsetHeight,
      },
      shadowOpacity: sizes.shadowOpacity,
      shadowRadius: sizes.shadowRadius,
      elevation: sizes.elevation,
    },
  ]);

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyles} {...props}>
      <LinearGradient
        colors={gradients.primary as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Text style={{ color: colors.white, fontWeight: 'bold' }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SoftButton;
