
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useFavorites } from '@/components/pokemon/favoritesContext';
import { CardPokemon } from '@/components/pokemon/cardPokemon';
import { fetchPokemonDetails, PokemonDetails } from '@/service/pokemon';

export default function FavoriteScreen() {
	const { favorites } = useFavorites();
	const [detailsList, setDetailsList] = useState<PokemonDetails[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let isMounted = true;
		async function fetchDetails() {
			setLoading(true);
			const promises = favorites.map(name => fetchPokemonDetails(name));
			const results = await Promise.all(promises);
			if (isMounted) setDetailsList(results);
			setLoading(false);
		}
		if (favorites.length > 0) fetchDetails();
		else setDetailsList([]);
		return () => { isMounted = false; };
	}, [favorites]);

	if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />;

	if (favorites.length === 0) {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text>Nenhum Pokémon favoritado.</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={detailsList}
			keyExtractor={item => item.name}
			numColumns={3}
			renderItem={({ item }) => (
				<CardPokemon name={item.name} image={item.image} />
			)}
			contentContainerStyle={{ padding: 8 }}
		/>
	);
}
