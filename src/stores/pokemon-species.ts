import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { Result } from 'components/models/models';
import { PokemonSpecie } from 'components/models/pokemon-species';

function defaultState(): PokemonSpecie[] {
  return [];
}

export const pokemonSpeciesStore = defineStore('pokemonSpecies', {
  state: () => defaultState(),

  actions: {
    async fetchPokemons() {
      api
        .get('/pokemon-species?limit=251')
        .then((response) => {
          const results = response.data.results as Result[];

          const pokemonSpecies = results.map(async (pokemon) => {
            const { data } = await api.get(pokemon.url);
            this.$state.push(data);
          });

          return pokemonSpecies;
        })
        .catch((error) => {
          Notify.create({
            icon: 'warning',
            type: 'negative',
            message: 'Error loading Pokemon Species list.',
            timeout: 2000,
          });
          return error;
        });
    },
  },
});
