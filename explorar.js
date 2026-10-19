// explorar.js
// Parte 1 - Conexión y exploración de la respuesta de la PokéAPI

async function explorar() {
  // Paso 1: hacer el fetch al endpoint con el pokémon que quiera
  const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");

  // Revisar el status de la respuesta
  console.log("Status:", respuesta.status);

  // Traducir el resultado con .json() (con su propio await)
  const datos = await respuesta.json();

  // Paso 2: imprimir datos completo para ver la estructura
  // (es muy largo, por eso después imprimo las claves principales)
  console.log(datos);
  console.log("name:", datos.name);
  console.log("id:", datos.id);
  console.log("height:", datos.height);
  console.log("weight:", datos.weight);
  console.log("types:", datos.types);
  console.log("stats:", datos.stats);
  console.log("abilities:", datos.abilities);

  // Ejercicio 1: recorrer todas las listas con un bucle
  console.log("\n--- Ejercicio 1 ---");

  console.log("Tipos:");
  for (let i = 0; i < datos.types.length; i++) {
    console.log("  -", datos.types[i].type.name);
  }

  console.log("Stats:");
  for (const s of datos.stats) {
    console.log("  -", s.stat.name + ":", s.base_stat);
  }

  console.log("Habilidades:");
  for (const a of datos.abilities) {
    console.log("  -", a.ability.name);
  }
}

explorar();
