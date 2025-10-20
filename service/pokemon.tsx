export type PokemonListItem = {
	name: string;
	image: string;
};

export async function fetchPokemons(limit: number, offset: number): Promise<PokemonListItem[]> {
	const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
	const response = await fetch(url);
	if (!response.ok) throw new Error('Erro ao buscar pokémons');
	const data = await response.json();
    
	const results = await Promise.all(
		data.results.map(async (pokemon: { name: string; url: string }) => {
			const res = await fetch(pokemon.url);
			if (!res.ok) throw new Error('Erro ao buscar detalhes do pokémon');
			const details = await res.json();
			return {
				name: pokemon.name,
				image: details.sprites?.front_default || '',
			};
		})
	);
	return results;
}

export type PokemonDetails = {
	id: number;
	name: string;
	image: string;
	types: string[];
	abilities: string[];
};

export async function fetchPokemonDetails(name: string): Promise<PokemonDetails> {
	const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error('Erro ao buscar detalhes do pokémon');
	}

	const details = await response.json();

	const image =
		details.sprites.other?.['official-artwork']?.front_default ||
		details.sprites.front_default ||
		'';

	return {
		id: details.id,
		name: details.name,
		image: image,
		types: details.types.map((t: any) => t.type.name),
		abilities: details.abilities.map((a: any) => a.ability.name),
	};
}
