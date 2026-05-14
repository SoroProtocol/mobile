import { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, Animated, StyleProp, TextStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

interface BalanceCounterProps {
  ratePerSecond: bigint;
  withdrawn:     bigint;
  startTime:     number;
  stopTime:      number;
  style?:        StyleProp<TextStyle>;
}

const T = Colors.dark;

export function BalanceCounter({
  ratePerSecond, withdrawn, startTime, stopTime, style,
}: BalanceCounterProps) {
  const [balance, setBalance] = useState(0n);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const id = setInterval(() => {
      const now     = Math.floor(Date.now() / 1000);
      if (now <= startTime) { setBalance(0n); return; }
      const elapsed = BigInt(Math.min(now, stopTime) - startTime);
      const accrued = ratePerSecond * elapsed;
      const bal     = accrued > withdrawn ? accrued - withdrawn : 0n;
      setBalance(prev => {
        if (bal !== prev) {
          Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.04, duration: 80, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1,    duration: 80, useNativeDriver: true }),
          ]).start();
        }
        return bal;
      });
    }, 500);
    return () => clearInterval(id);
  }, [ratePerSecond, withdrawn, startTime, stopTime]);

  const xlm = (Number(balance) / 1e7).toFixed(7);

  return (
    <Animated.Text
      style={[styles.balance, style, { transform: [{ scale: scaleAnim }] }]}
      accessibilityLabel={`${xlm} XLM available to withdraw`}
    >
      {xlm}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  balance: {
    color:      T.text,
    fontSize:   32,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: -0.5,
  },
});
