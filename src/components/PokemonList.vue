<template>
  <div class="row justify-center items-center q-mb-xl">
    <h1 class="text-h3 text-primary text-weight-bold">Pokédex</h1>
  </div>
  <div class="row justify-center items-center q-col-gutter-lg q-mb-xl">
    <q-input
      class="text-subtitle1 col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12"
      dark
      label-color="white"
      bg-color="dark"
      input-class="text-blue-3"
      outlined
      rounded
      clearable
      v-model="filterNameNumber"
      type="text"
      label="Name or Number"
    />
    <q-select
      class="text-subtitle1 text-capitalize col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12"
      dark
      color="primary"
      options-selected-class="text-primary"
      label-color="white"
      bg-color="dark"
      popup-content-class="bg-dark text-capitalize text-subtitle1"
      outlined
      rounded
      clearable
      v-model="filterRegion"
      :options="optionsRegion"
      option-label="label"
      option-value="value"
      label="Region"
    >
      <template v-slot:selected>
        <div class="text-blue-3">
          {{ filterRegion?.label }}
        </div>
      </template>
    </q-select>
    <q-select
      class="text-subtitle1 text-capitalize col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12"
      dark
      color="primary"
      options-selected-class="text-primary"
      label-color="white"
      bg-color="dark"
      popup-content-class="bg-dark text-capitalize text-subtitle1"
      outlined
      rounded
      clearable
      v-model="filterType"
      :options="optionsTypes"
      label="Type"
    >
      <template v-slot:selected>
        <div class="text-blue-3">
          {{ filterType }}
        </div>
      </template>
    </q-select>
  </div>
  <div class="row justify-center q-col-gutter-xl">
    <div
      class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12"
      v-for="pokemon in pokemonsFilter"
      :key="pokemon.id"
    >
      <div
        class="card cursor-pointer"
        @mouseover="followMouse($event)"
        @mouseleave="resetTransform"
      >
        <div class="content" ref="contentRef">
          <q-img
            :src="pokemon.sprites.other.home.front_default"
            :ratio="16 / 9"
            spinner-color="primary"
            spinner-size="50px"
            fit="contain"
          />
          <div class="pokemon-id absolute text-blue-1 text-weight-bold q-pa-md">
            #{{ pokemon.id }}
          </div>
          <div
            class="q-my-md text-h5 text-weight-bold text-grey-1 text-center text-capitalize"
          >
            {{ pokemon.name }}
          </div>
          <div class="row justify-center items-center q-gutter-md">
            <div
              :class="`${pokemonColor(
                type.type.name
              )} text-subtitle1 text-weight-regular text-capitalize text-center q-py-sm q-px-md`"
              style="width: 90px"
              v-for="type in pokemon.types"
              :key="type.slot"
            >
              {{ type.type.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="q-mt-xl full-width flex-center text-white text-center text-h4 text-weight-bold"
    v-if="!pokemonsFilter.length"
  >
    <q-icon class="q-mb-sm" name="search_off" size="xl" />
    <div>No results found</div>
  </div>
  <q-pagination
    v-if="pokemons"
    v-model="page"
    :min="currentPage"
    :max="Math.ceil(pokemons.length / totalPages)"
    :max-pages="6"
    direction-links
    class="q-mt-xl full-width flex-center"
  >
  </q-pagination>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { pokemonStore } from 'stores/pokemon';
import { pokemonSpeciesStore } from 'stores/pokemon-species';

let pokemons = pokemonStore().$state;
let pokemonSpecies = pokemonSpeciesStore().$state;

///// Pagination /////
const currentPage = ref<number>(1);
const page = ref<number>(1);
const totalPages = ref<number>(12);

///// Inputs /////
const filterNameNumber = ref<string>('');
const filterRegion = ref<{ label: string; value: string }>();
const optionsRegion = ref<{ label: string; value: string }[]>([
  { label: 'kanto', value: 'generation-i' },
  { label: 'Jhoto', value: 'generation-ii' },
]);
const filterType = ref<string>('');
const optionsTypes = ref<string[]>([
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
]);
const pokemonsFilter = computed(() => {
  let filteredPokemons = pokemonStore().$state.sort((a, b) => a.id - b.id);

  if (filterNameNumber.value) {
    const normalizedFilterNameNumber = filterNameNumber.value
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    filteredPokemons = filteredPokemons?.filter((pokemon) => {
      const normalizedPokemonName = pokemon.name
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      const normalizedPokemonNumber = pokemon.id.toString();

      const matchesName = normalizedPokemonName?.includes(
        normalizedFilterNameNumber || ''
      );

      const matchesNumber = normalizedPokemonNumber.includes(
        normalizedFilterNameNumber || ''
      );

      return matchesName || matchesNumber;
    });
  }

  if (filterRegion.value) {
    const normalizedFilterRegion = filterRegion.value.value
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    filteredPokemons = filteredPokemons?.filter((pokemon) => {
      const normalizedPokemonRegion = pokemonSpecies.find(
        (el) => el.id === pokemon.id
      )?.generation.name;

      const matchesRegion = normalizedPokemonRegion === normalizedFilterRegion;
      return matchesRegion;
    });
  }

  if (filterType.value) {
    const normalizedFilterType = filterType.value
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    filteredPokemons = filteredPokemons?.filter((pokemon) => {
      const normalizedPokemonType = pokemon.types;

      const matchesType = normalizedPokemonType?.find(
        (el) =>
          el.type.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') === normalizedFilterType || ''
      );

      return matchesType;
    });
  }

  pokemons = filteredPokemons;
  return filteredPokemons.slice(
    (page.value - 1) * totalPages.value,
    (page.value - 1) * totalPages.value + totalPages.value
  );
});

const angle = ref({ x: 0, y: 0 });

/**
 * Rotates the '.content' element inside the event target based on the mouse position, creating a 3D effect
 * @param {MouseEvent} event - The mouse event object that triggered the function
 * @returns {void}
 */
function followMouse(event: MouseEvent): void {
  // Get the event target and the '.content' element inside it
  const card = event.currentTarget as HTMLElement;
  const content = card.getElementsByClassName('content')[0] as HTMLElement;

  // Get the bounding rectangle of the event target
  const rect = card.getBoundingClientRect();

  // Get the position of the mouse inside the card
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Get the width and height of the card
  const width = card.offsetWidth;
  const height = card.offsetHeight;

  // Calculate the rotation angle for the card based on the mouse position
  angle.value.x = -((height / 2 - mouseY) / height) * 25;
  angle.value.y = ((width / 2 - mouseX) / width) * 25;

  // Apply the transformation matrix to the '.content' element to create the 3D effect
  content.style.transform = `rotateX(${angle.value.x}deg) rotateY(${angle.value.y}deg)`;
}

/**
 * Resets the transform property of the '.content' element inside the event target to its default value
 * @param {MouseEvent} event - The mouse event object that triggered the function
 * @returns {void}
 */
function resetTransform(event: MouseEvent): void {
  const content = (event.currentTarget as HTMLElement).querySelector(
    '.content'
  ) as HTMLElement;
  content.style.transform = 'none';
}

/**
 * Returns the corresponding CSS class for a given Pokémon type
 * @param {string} type - The Pokémon type
 * @returns {string} The CSS class associated with the type, or an empty string if the type is not recognized
 */
function pokemonColor(type: string) {
  switch (type) {
    case 'normal':
      return 'normal-card';
    case 'fighting':
      return 'fighting-card';
    case 'flying':
      return 'flying-card';
    case 'poison':
      return 'poison-card';
    case 'ground':
      return 'ground-card';
    case 'rock':
      return 'rock-card';
    case 'bug':
      return 'bug-card';
    case 'ghost':
      return 'ghost-card';
    case 'steel':
      return 'steel-card';
    case 'fire':
      return 'fire-card';
    case 'water':
      return 'water-card';
    case 'grass':
      return 'grass-card';
    case 'electric':
      return 'electric-card';
    case 'psychic':
      return 'psychic-card';
    case 'ice':
      return 'ice-card';
    case 'dragon':
      return 'dragon-card';
    case 'dark':
      return 'dark-card';
    case 'fairy':
      return 'fairy-card';
    default:
      return '';
  }
}
</script>

<style scoped>
.card {
  border-radius: 10px;
  perspective: 1000px;
  transition: transform 0.4s cubic-bezier(0.25, 0.45, 0.45, 0.95);
  touch-action: none;
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 10px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  transform: translateZ(-10px);
  opacity: 0;
  transition: opacity 0.4s ease-out;
}

.card:hover {
  transform: scale(1.05);
}

.card:hover::before {
  opacity: 1;
}

.content {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: var(--bg-200);
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.25, 0.45, 0.45, 0.95);
  position: relative;
}

.pokemon-id {
  top: 0;
  right: 0;
}
</style>
