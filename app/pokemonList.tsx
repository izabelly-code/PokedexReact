import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { fetchPokemons, PokemonListItem } from '../service/pokemon';
import { CardPokemon } from '../components/pokemon/cardPokemon';

export default function PokemonList() {
  // Usando o tipo importado do serviço
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit] = useState(30);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
 
  useEffect(() => {
    fetchPokemons(limit, offset)
      .then((data) => {
        setPokemons(data);
        setHasMore(data.length === limit);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextOffset = offset + limit;
    try {
      const newPokemons = await fetchPokemons(limit, nextOffset);
      setPokemons((prev) => [...prev, ...newPokemons]);
      setOffset(nextOffset);
      setHasMore(newPokemons.length === limit);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderFooter = () => {
    if (!hasMore && !loadingMore) return null;

    return (
      <View style={styles.footer}>
        {loadingMore ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button
            title={'Carregar Mais'}
            onPress={handleLoadMore}
            disabled={loadingMore}
          />
        )}
      </View>
    );
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={pokemons}
        keyExtractor={item => item.name}
        numColumns={3}
        renderItem={({ item }) => (
          <CardPokemon name={item.name} image={item.image} />
        )}
        contentContainerStyle={{ padding: 8 }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter} // ESTE É O SEGREDO!
      />
    </View>
  );
}

const styles = StyleSheet.create({
    footer: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#CED0CE',
        marginVertical: 10,
    }
});