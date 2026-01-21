import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../navigation/types';
import { useOnboardingStore, VehicleType } from '../../stores/onboardingStore';

const VEHICLE_OPTIONS: { type: VehicleType; label: string; icon: string }[] = [
  { type: 'motorhome', label: 'Motorhome', icon: '🚐' },
  { type: 'rooftent', label: 'Rooftent', icon: '⛺' },
  { type: 'bicycle', label: 'Bicycle', icon: '🚲' },
  { type: 'car', label: 'Car', icon: '🚗' },
  { type: 'van', label: 'Van', icon: '🚌' },
];

export function VehiclePreferencesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { vehicleType, setVehicleType } = useOnboardingStore();

  const handleSkip = () => {
    navigation.navigate('CampyPlus');
  };

  const handleContinue = () => {
    navigation.navigate('CampyPlus');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How do you travel?</Text>
        <Text style={styles.subtitle}>
          Select your preferred vehicle type
        </Text>

        <View style={styles.optionsContainer}>
          {VEHICLE_OPTIONS.map((option) => (
            <Pressable
              key={option.type}
              style={[
                styles.optionButton,
                vehicleType === option.type && styles.optionButtonSelected,
              ]}
              onPress={() => setVehicleType(option.type)}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  vehicleType === option.type && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[
            styles.continueButton,
            !vehicleType && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!vehicleType}
        >
          <Text
            style={[
              styles.continueText,
              !vehicleType && styles.continueTextDisabled,
            ]}
          >
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  placeholder: {
    width: 50,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#687076',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#687076',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  optionButton: {
    width: '45%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: '#0a7ea4',
    backgroundColor: '#E0F2FE',
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#11181C',
  },
  optionLabelSelected: {
    color: '#0a7ea4',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  continueTextDisabled: {
    color: '#9CA3AF',
  },
});
