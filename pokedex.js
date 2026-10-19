// pokedex.js
// Taller - Pokédex de Consola
// API usada: https://pokeapi.co

// ============================================================
// Parte 2 - Función buscarPokemon()
// ============================================================
async function buscarPokemon(nombre) {
  // 1. Construyo la URL con el nombre en minúsculas (la API no acepta mayúsculas)
  const url = "https://pokeapi.co/api/v2/pokemon/" + nombre.toLowerCase();

  // 2. Hago la petición
  const respuesta = await fetch(url);

  // 3. Verifico respuesta.ok antes de traducir
  if (!respuesta.ok) {
    console.log("No se pudo buscar '" + nombre + "'. Status: " + respuesta.status);
    return null;
  }

  // 4. Si todo salió bien, retorno el objeto traducido
  return await respuesta.json();
}

// ============================================================
// Parte 3 - Función mostrarFicha()
// ============================================================
function mostrarFicha(datos) {
  // 1. Si no hay datos, aviso y salgo
  if (!datos) {
    console.log("No hay nada que mostrar.");
    return;
  }

  // 2. Nombre en mayúscula y número de Pokédex
  console.log("\n==============================");
  console.log(datos.name.toUpperCase() + "  (#" + datos.id + ")");
  console.log("==============================");

  // 3. Tipos separados por " / "
  const nombresTipos = [];
  for (const t of datos.types) {
    nombresTipos.push(t.type.name);
  }
  console.log("Tipo: " + nombresTipos.join(" / "));

  // 4. Altura en cm y peso en kg
  const alturaCm = datos.height * 10;
  const pesoKg = datos.weight / 10;
  console.log("Altura: " + alturaCm + " cm");
  console.log("Peso: " + pesoKg + " kg");

  // 5. Todas las stats
  console.log("Stats:");
  for (const s of datos.stats) {
    console.log("  " + s.stat.name + ": " + s.base_stat);
  }

  // 6. Todas las habilidades (con "(oculta)" si aplica)
  console.log("Habilidades:");
  for (const a of datos.abilities) {
    let linea = "  " + a.ability.name;
    if (a.is_hidden) {
      linea = linea + " (oculta)";
    }
    console.log(linea);
  }
}

// ============================================================
// Parte 4 - Función compararPokemon()
// ============================================================

// 4.1 - Función auxiliar obtenerStat()
function obtenerStat(datos, nombreStat) {
  // recorro datos.stats buscando la que se llame igual
  for (const s of datos.stats) {
    if (s.stat.name === nombreStat) {
      return s.base_stat; // return corta la función ahí mismo
    }
  }
  // si el for termina sin encontrar nada
  return null;
}

// 4.2 - Función compararPokemon()
async function compararPokemon(nombre1, nombre2, stat) {
  // Busco ambos pokémon (con await en cada uno)
  const poke1 = await buscarPokemon(nombre1);
  const poke2 = await buscarPokemon(nombre2);

  // Si alguno vino null, aviso y salgo
  if (poke1 === null || poke2 === null) {
    console.log("No se puede comparar porque alguno de los dos no existe.");
    return;
  }

  // Obtengo el valor de la stat para cada uno
  const valor1 = obtenerStat(poke1, stat);
  const valor2 = obtenerStat(poke2, stat);

  // Si la stat no existe, aviso cuáles son las válidas y salgo
  if (valor1 === null || valor2 === null) {
    console.log("La stat '" + stat + "' no existe.");
    console.log("Las stats válidas son: hp, attack, defense, special-attack, special-defense, speed");
    return;
  }

  // Comparo los valores e imprimo quién gana
  console.log("\nComparando " + stat + ":");
  console.log("  " + poke1.name + ": " + valor1);
  console.log("  " + poke2.name + ": " + valor2);

  if (valor1 > valor2) {
    console.log("Gana " + poke1.name + "!");
  } else if (valor2 > valor1) {
    console.log("Gana " + poke2.name + "!");
  } else {
    console.log("Empate!");
  }
}

// ============================================================
// Parte 5 - Función pokemonMasFuerte()
// ============================================================
async function pokemonMasFuerte(listaNombres, stat) {
  // Guardo el mejor nombre y el mejor valor hasta ahora
  let mejorNombre = null;
  let mejorValor = -1;

  for (const nombre of listaNombres) {
    // Busco cada pokémon
    const datos = await buscarPokemon(nombre);
    if (datos === null) {
      continue; // si no existe, sigo con el siguiente
    }

    // Obtengo el valor de la stat
    const valor = obtenerStat(datos, stat);
    if (valor === null) {
      continue; // si la stat no existe, también lo salto
    }

    // Si es mayor al mejor guardado, actualizo ambas variables
    if (valor > mejorValor) {
      mejorValor = valor;
      mejorNombre = datos.name;
    }
  }

  // Al terminar, muestro quién ganó y retorno su nombre
  if (mejorNombre === null) {
    console.log("No se pudo determinar un ganador.");
  } else {
    console.log("El más fuerte en " + stat + " es " + mejorNombre + " con " + mejorValor);
  }
  return mejorNombre;
}

// ============================================================
// Programa principal - Ejercicios
// ============================================================
async function main() {
  // ---------- Ejercicio 2 ----------
  console.log("##### Ejercicio 2 #####");
  const nombres2 = ["pikachu", "bulbasaur", "squirtle"];
  for (const n of nombres2) {
    const datos = await buscarPokemon(n);
    if (datos !== null) {
      console.log(datos.name + " - id: " + datos.id);
    }
  }
  // Prueba con un nombre que no existe
  const falso = await buscarPokemon("pokemoninventado");
  if (falso !== null) {
    console.log(falso.name);
  }

  // ---------- Ejercicio 3 ----------
  console.log("\n##### Ejercicio 3 #####");
  mostrarFicha(await buscarPokemon("eevee"));
  mostrarFicha(await buscarPokemon("gengar"));

  // Para responder por escrito:
  // ¿Por qué es útil que buscarPokemon() y mostrarFicha() sean funciones separadas?
  // Porque cada una hace una sola cosa. buscarPokemon() solo trae los datos y
  // mostrarFicha() solo los muestra. Así puedo reutilizar buscarPokemon() en
  // compararPokemon() y pokemonMasFuerte() sin que imprima una ficha cada vez, y
  // si mañana quiero guardar la ficha en un archivo solo cambio mostrarFicha()
  // y la otra función queda intacta. También es más fácil probar y corregir errores.

  // ---------- Ejercicio 4 ----------
  console.log("\n##### Ejercicio 4 #####");

  // Elegí "hp" porque Snorlax es famoso por aguantar muchísimo daño (tiene
  // de las vidas más altas), y Machamp es más de pegar que de aguantar.
  await compararPokemon("snorlax", "machamp", "hp");

  // Dos pokémon de mi elección en defense
  await compararPokemon("blastoise", "charizard", "defense");

  // Stat que no existe: debe avisar cuáles son las válidas
  await compararPokemon("pikachu", "eevee", "fuerza");

  // ---------- Ejercicio 5 - Desafío final ----------
  console.log("\n##### Ejercicio 5 #####");

  // 1. Mi equipo de 6 pokémon
  const miEquipo = ["pikachu", "charizard", "machamp", "snorlax", "gengar", "blastoise"];

  // 2. El más fuerte en attack
  const ganadorAttack = await pokemonMasFuerte(miEquipo, "attack");

  // 3. El más fuerte en defense
  await pokemonMasFuerte(miEquipo, "defense");

  // 4. Ficha completa del ganador en attack
  // (uso buscarPokemon y no fetch directo, como pide la restricción)
  const datosGanador = await buscarPokemon(ganadorAttack);
  mostrarFicha(datosGanador);
}

main();
