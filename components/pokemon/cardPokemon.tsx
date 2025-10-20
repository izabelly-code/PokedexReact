import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

type CardPokemonProps = {
  readonly name: string;
  readonly image: string;
};

export function CardPokemon({ name, image }: CardPokemonProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const textColor = Colors[colorScheme ?? 'light'].text;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => router.push({pathname:"../pokemonDetail", params: { name }})}>
      <View style={[styles.card, { backgroundColor }]}>
        <Image source={{ uri: image }} style={styles.image} />
        <Text style={[styles.name, { color: textColor }]}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
  },
  cardContainer: {
    flex: 1,
    margin: 8,
  },
  image: {
    width: 100,
    height: 100,
  },
  name: {
    marginTop: 8,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});