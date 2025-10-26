import React from 'react';
import { View, StyleSheet, ViewStyle, ColorValue } from 'react-native';
import { BlurView, BlurTint } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import useTheme from '@/hooks/use-soft-theme';

type Props = {
  children?: React.ReactNode;
  style?: ViewStyle;
  shadow?: boolean;
  card?: boolean;
  row?: boolean;
  flex?: number;
  radius?: number;
  height?: number | string;
  width?: number | string;
  margin?: number;
  padding?: number;
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  blur?: boolean;
  intensity?: number;
  tint?: BlurTint;
  gradient?: string[];
};

const SoftBlock = ({
  children,
  style,
  shadow,
  card,
  row,
  flex,
  radius,
  height,
  width,
  margin,
  padding,
  justify,
  align,
  blur,
  intensity,
  tint,
  gradient,
  ...props
}: Props) => {
  const { colors, sizes } = useTheme();

  const blockStyles = StyleSheet.flatten([
    style,
    shadow && {
      shadowColor: colors.shadow,
      shadowOffset: {
        width: sizes.shadowOffsetWidth,
        height: sizes.shadowOffsetHeight,
      },
      shadowOpacity: sizes.shadowOpacity,
      shadowRadius: sizes.shadowRadius,
      elevation: sizes.elevation,
    },
    card && {
      backgroundColor: colors.secondary,
      borderRadius: sizes.cardRadius,
      padding: sizes.sm,
    },
    row && { flexDirection: 'row' },
    flex !== undefined && { flex },
    radius && { borderRadius: radius },
    height && { height },
    width && { width },
    margin && { margin },
    padding && { padding },
    justify && { justifyContent: justify },
    align && { alignItems: align },
  ]) as ViewStyle;

  if (gradient) {
    return (
      <LinearGradient colors={gradient as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]]} style={blockStyles} {...props}>
        {children}
      </LinearGradient>
    );
  }

  if (blur) {
    return (
      <BlurView tint={tint} intensity={intensity} style={blockStyles} {...props}>
        {children}
      </BlurView>
    );
  }

  return (
    <View style={blockStyles} {...props}>
      {children}
    </View>
  );
};

export default SoftBlock;
