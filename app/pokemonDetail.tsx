import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, type ColorSchemeName, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fetchPokemonDetails, PokemonDetails } from '@/service/pokemon';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useFavorites } from '@/components/pokemon/favoritesContext';

export default function PokemonDetailScreen() {
	const { name } = useLocalSearchParams<{ name: string }>();
	const [details, setDetails] = useState<PokemonDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { toggleFavorite, isFavorite } = useFavorites();
	const favorito = isFavorite(name);

	const colorScheme = useColorScheme();
	const styles = getStyles(colorScheme);

	useEffect(() => {
		if (!name) return;

		fetchPokemonDetails(name)
			.then((data) => setDetails(data))
			.catch(() => setError('Não foi possível carregar os detalhes do Pokémon.'))
			.finally(() => setLoading(false));
	}, [name]);

	if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />;
	if (error || !details) return <Text style={styles.errorText}>{error}</Text>;

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<Stack.Screen options={{ title: details.name, headerTitleAlign: 'center' }} />
			<TouchableOpacity onPress={() => toggleFavorite(details.name)} style={{ margin: 16 }}>
  				<Ionicons name={isFavorite(details.name) ? 'star' : 'star-outline'} size={32} color={isFavorite(details.name) ? 'gold' : 'gray'} />
			</TouchableOpacity>
			<Image source={{ uri: details.image }} style={styles.image} />
			<Text style={styles.name}>
				{details.name} #{String(details.id).padStart(3, '0')}
			</Text>

			<View style={styles.infoSection}>
				<Text style={styles.sectionTitle}>Tipos</Text>
				<Text style={styles.infoText}>{details.types.join(', ')}</Text>
			</View>

			<View style={styles.infoSection}>
				<Text style={styles.sectionTitle}>Habilidades</Text>
				{details.abilities.slice(0, 5).map((ability) => (
					<Text key={ability} style={styles.infoText}>- {ability}</Text>
				))}
			</View>
		</ScrollView>
	);
}

const getStyles = (colorScheme: ColorSchemeName) => StyleSheet.create({
	container: { flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background },
	contentContainer: { alignItems: 'center', padding: 20 },
	image: { width: 250, height: 250, marginBottom: 16 },
	name: { fontSize: 28, fontWeight: 'bold', textTransform: 'capitalize', color: Colors[colorScheme ?? 'light'].text, marginBottom: 16 },
	infoSection: { marginVertical: 10, alignItems: 'center' },
	sectionTitle: { fontSize: 20, fontWeight: '600', color: Colors[colorScheme ?? 'light'].text, marginBottom: 4 },
	infoText: { fontSize: 16, textTransform: 'capitalize', color: Colors[colorScheme ?? 'light'].text },
	errorText: { flex: 1, textAlign: 'center', marginTop: 50, fontSize: 18, color: 'red' },
});