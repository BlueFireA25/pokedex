import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { Result } from 'components/models/models';
import { Pokemon } from 'components/models/pokemon';

function defaultState(): Pokemon[] {
  return [];
}

export const pokemonStore = defineStore('pokemon', {
  state: () => defaultState(),

  actions: {
    async fetchPokemons() {
      api
        .get('/pokemon?limit=151')
        .then((response) => {
          const results = response.data.results as Result[];

          const pokemons = results.map(async (pokemon) => {
            const { data } = await api.get(pokemon.url);
            this.$state.push(data);
          });

          return pokemons;
        })
        .catch((error) => {
          Notify.create({
            icon: 'warning',
            type: 'negative',
            message: 'Error al cargar la lista de Pokémon.',
            timeout: 2000,
          });
          return error;
        });
    },
  },
});
