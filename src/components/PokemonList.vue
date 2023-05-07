<template>
  <div class="row justify-center items-center q-mb-xl">
    <!-- <q-img
      src="../assets/img/logo.png"
      :ratio="16 / 9"
      spinner-color="primary"
      spinner-size="82px"
      fit="contain"
      width="150px"
    /> -->
    <h1 class="text-h3 text-primary text-weight-bold">Pokédex</h1>
  </div>
  <div class="row justify-center q-col-gutter-xl">
    <div
      class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12"
      v-for="pokemon in pokemons"
      :key="pokemon.id"
    >
      <div
        class="card"
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
          <div>#{{ pokemon.id }}</div>
          <div class="q-my-md text-h6 text-white text-center text-capitalize">
            {{ pokemon.name }}
          </div>
          <div class="row justify-center items-center q-gutter-md">
            <div
              class="text-h6 text-capitalize"
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
</template>

<script setup lang="ts">
import { pokemonStore } from 'stores/pokemon';
import { ref } from 'vue';

const pokemons = pokemonStore().$state;

const angle = ref({ x: 0, y: 0 });

function followMouse(event: MouseEvent) {
  const card = event.currentTarget as HTMLElement;
  const content = card.getElementsByClassName('content')[0] as HTMLElement;

  const rect = card.getBoundingClientRect();

  // Obtener la posición del mouse dentro de la tarjeta
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Obtener el ancho y alto de la tarjeta
  const width = card.offsetWidth;
  const height = card.offsetHeight;

  // Calcular el ángulo de rotación para la tarjeta
  angle.value.x = -((height / 2 - mouseY) / height) * 25;
  angle.value.y = ((width / 2 - mouseX) / width) * 25;

  // Aplicar la matriz de transformación a la tarjeta
  content.style.transform = `rotateX(${angle.value.x}deg) rotateY(${angle.value.y}deg)`;
}

function resetTransform(event: MouseEvent) {
  const content = (event.currentTarget as HTMLElement).querySelector(
    '.content'
  ) as HTMLElement;
  content.style.transform = 'none';
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
</style>
