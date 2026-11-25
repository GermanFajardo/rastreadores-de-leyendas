// Textos y Mecánicas Exactas de Comprensión Lectora + Pensamiento Computacional
// I.E.M.R. La Granja - Sede San Miguel (Zipaquirá) - Estudiantes de 3.º de Primaria (8-9 años)

const GAME_DATA = {
  schoolName: "I.E.M.R. La Granja - Sede San Miguel",
  location: "Zipaquirá, Cundinamarca, Colombia",
  grade: "3.º de Primaria (8 a 9 años)",

  // Definiciones exactas de "Mis Poderes"
  powers: [
    {
      id: "descomponer",
      icon: "🧩",
      name: "1. Descomponer (Partir en pedacitos)",
      sub: "Lectura Literal",
      text: "Cuando una historia parece muy larga, la partimos en pedacitos pequeños: ¿quién sale en el cuento?, ¿dónde pasa? y ¿qué hace? Así es súper fácil encontrar las respuestas que están escritas en la lectura."
    },
    {
      id: "patrones",
      icon: "🔍",
      name: "2. Buscar Patrones (Unir pistas)",
      sub: "Lectura Inferencial",
      text: "A veces el cuento no dice todo con palabras, pero deja pistas escondidas. Unimos las pistas que se repiten (como la cara de susto o una tormenta) para adivinar qué sienten los personajes o por qué pasa algo."
    },
    {
      id: "depuracion",
      icon: "🧹",
      name: "3. Limpiar Errores (Depuración)",
      sub: "Lectura Crítica",
      text: "Cuando leemos, a veces encontramos cosas que la gente dice sin tener pruebas o por puro miedo. Limpiar errores es quitar esas ideas falsas para quedarnos solo con lo que sí es verdad."
    },
    {
      id: "abstraccion",
      icon: "💡",
      name: "4. Sacar la Idea Principal (Abstracción)",
      sub: "Lectura Crítica",
      text: "Después de quitar lo que sobra, nos quedamos con la enseñanza más importante de la historia y pensamos: ¿cómo nos ayuda esto a cuidar nuestra escuela, el agua y los bosques?"
    }
  ],

  // Las 3 Medallas oficiales
  badges: [
    {
      id: "ojo_lince",
      name: "Medalla Ojo de Lince",
      icon: "👁️",
      level: "Nivel 1 - Lectura Literal + Descomponer",
      description: "¡Encontraste todas las respuestas escritas en el cuento del Duende dividiéndolo en pedacitos!"
    },
    {
      id: "detective",
      name: "Medalla del Detective",
      icon: "🔍",
      level: "Nivel 2 - Lectura Inferencial + Buscar Patrones",
      description: "¡Uniste las pistas escondidas para descubrir el secreto del Mohán y por qué cambió el río!"
    },
    {
      id: "guardian_bosque",
      name: "Medalla Guardián del Bosque",
      icon: "🌿",
      level: "Nivel 3 - Lectura Crítica + Limpiar Errores y Sacar la Idea Principal",
      description: "¡Limpiaste las ideas falsas y descubriste la verdadera enseñanza de la Madremonte para cuidar el agua y los árboles!"
    }
  ],

  // Datos de cada pantalla / nivel
  levels: {
    // PANTALLA 0: INICIO (Escuela Rural San Miguel)
    screen0: {
      id: "screen0",
      name: "Escuela Rural San Miguel",
      dialogues: [
        {
          speaker: "jacinto",
          speakerName: "Abuelo Jacinto",
          text: "¡Hola, {name}! Qué bueno verte en nuestra Escuela San Miguel. En Colombia nuestros abuelos cuentan historias increíbles como la del Duende, el Mohán y la Madremonte."
        },
        {
          speaker: "lucia",
          speakerName: "Profesora Lucía",
          text: "¡Hoy vamos a leer tres leyendas colombianas! Pero tenemos un secreto: vamos a usar 4 superpoderes para entender muy bien cada historia sin confundirnos."
        },
        {
          speaker: "jacinto",
          speakerName: "Abuelo Jacinto",
          text: "Primero buscaremos datos fáciles, luego descubriremos pistas escondidas y al final pensaremos qué enseñanza nos deja el cuento. ¡Camina con Copo hacia la huerta para empezar!"
        }
      ]
    },

    // PANTALLA 1: NIVEL 1 (Cultivo de papa y huerta escolar)
    screen1: {
      id: "screen1",
      name: "Nivel 1: Cultivos de Papa y Huerta Escolar",
      badgeId: "ojo_lince",
      cardPrevia: {
        title: "Nivel 1: Dificultad Fácil",
        reto: "Encontrar respuestas que están escritas tal cual dentro de la historia. ¡Solo tienes que leer con mucha atención!",
        superpoder: "Vamos a dividir la historia en 4 preguntas cortas (¿Dónde vive?, ¿Cómo se viste?, ¿Qué travesuras hace? y ¿Cómo lo calman?) para entenderla pedacito por pedacito."
      },
      story: {
        title: "Lectura 1: El Duende travieso de las fincas",
        paragraphs: [
          "Cuentan los abuelos en Colombia que el Duende es un hombrecito muy pequeño que vive cerca de los ríos, los barrancos y las fincas del campo. Siempre lleva puesto un sombrero gigante que le tapa casi toda la cara y carga una guitarra chiquita.",
          "Cuando llega la noche, al Duende le gusta hacer travesuras en las casas: esconde las palas de los campesinos, cambia de lugar las ollas de la cocina y les hace trenzas bien apretadas a las colas de los caballos. Para que el Duende deje tranquila la finca, los abuelos dejan una guitarra afinada junto a la puerta para que se entretenga tocando música."
        ]
      },
      reto: {
        boxes: [
          {
            id: 1,
            title: "Caja 1: ¿Dónde vive el Duende?",
            correctAnswer: "Cerca de los ríos, los barrancos y las fincas del campo."
          },
          {
            id: 2,
            title: "Caja 2: ¿Cómo se viste y qué carga?",
            correctAnswer: "Un sombrero gigante y una guitarra chiquita."
          },
          {
            id: 3,
            title: "Caja 3: ¿Qué travesuras hace?",
            correctAnswer: "Esconde palas, mueve ollas y hace trenzas a las colas de los caballos."
          },
          {
            id: 4,
            title: "Caja 4: ¿Cómo lo calman los abuelos?",
            correctAnswer: "Dejando una guitarra afinada junto a la puerta de la casa."
          }
        ]
      }
    },

    // PANTALLA 2: NIVEL 2 (Potreros y establo lechero)
    screen2: {
      id: "screen2",
      name: "Nivel 2: Potreros y Establo Lechero",
      badgeId: "detective",
      cardPrevia: {
        title: "Nivel 2: Dificultad Media",
        reto: "A veces un cuento no dice con palabras si alguien está bravo o asustado, pero nos deja pistas para adivinarlo. ¡Hoy serás un detective de pistas escondidas!",
        superpoder: "Vamos a juntar las pistas que se repiten en la historia (lo que hacen los pescadores y cómo cambia el río) para descubrir qué pasó de verdad."
      },
      story: {
        title: "Lectura 2: El Mohán y el secreto del río",
        paragraphs: [
          "En las cuevas de los ríos grandes de Colombia vive el Mohán, un personaje mágico de pelo muy largo, barba espesa y ojos brillantes. Cuentan los pescadores que le gusta sentarse sobre las rocas grandes a tocar su guitarra de oro cuando el río está tranquilo.",
          "Cuando los vecinos cuidan el agua y pescan solo los peces grandes que necesitan para comer, el río es pacífico y hay buena pesca. Pero una mañana, unos hombres llegaron gritando, botaron bolsas de basura al agua y atraparon cientos de pececitos muy pequeños.",
          "Al instante, el agua limpia empezó a dar vueltas en remolinos oscuros, sonó un rugido fuerte debajo de las piedras y las redes se enredaron en el fondo. Los hombres soltaron sus remos, abrieron mucho los ojos y remaron súper rápido hasta la orilla sin mirar atrás."
        ]
      },
      reto: {
        paso1: {
          instruction: "Selecciona las 3 pistas que muestran por qué cambió el río:",
          options: [
            {
              id: "p1",
              text: "Los hombres llegaron gritando y botaron basura al agua.",
              correct: true
            },
            {
              id: "p2",
              text: "Atraparon cientos de pececitos muy pequeños.",
              correct: true
            },
            {
              id: "p3",
              text: "El agua hizo remolinos oscuros y sonó un rugido debajo de las piedras.",
              correct: true
            },
            {
              id: "p4",
              text: "El Mohán tiene el pelo largo y barba espesa.",
              correct: false
            }
          ]
        },
        paso2: {
          questions: [
            {
              question: "El cuento nunca dice 'el Mohán se puso bravo', pero ¿por qué hizo remolinos y enredó las redes?",
              options: [
                { text: "Porque se molestó al ver que ensuciaban el río y sacaban los peces chiquitos.", correct: true },
                { text: "Porque quería jugar en el agua.", correct: false },
                { text: "Porque se le cayó su guitarra al río.", correct: false }
              ]
            },
            {
              question: "Al final del cuento, ¿qué sintieron los hombres y cómo lo sabes?",
              options: [
                { text: "Sintieron mucho miedo, porque soltaron los remos, abrieron mucho los ojos y huyeron rápido.", correct: true },
                { text: "Sintieron alegría, porque pescaron mucho.", correct: false },
                { text: "Sintieron sueño, porque era muy temprano.", correct: false }
              ]
            }
          ]
        }
      }
    },

    // PANTALLA 3: NIVEL 3 (Quebrada y bosque alto)
    screen3: {
      id: "screen3",
      name: "Nivel 3: Quebrada y Bosque Alto",
      badgeId: "guardian_bosque",
      cardPrevia: {
        title: "Nivel 3: Dificultad Retadora",
        reto: "Cuando leemos, debemos pensar si lo que dicen los personajes tiene sentido y descubrir cuál es la enseñanza más importante para nuestra vida.",
        superpoder: "Primero vamos a borrar las ideas falsas que dicen algunos vecinos, y luego nos quedaremos con el mensaje verdadero de la leyenda."
      },
      story: {
        title: "Lectura 3: La Madremonte, protectora de los bosques",
        paragraphs: [
          "En las montañas verdes y los bosques de Colombia se cuenta la historia de la Madremonte, una mujer cubierta de hojas frescas, musgo suave y flores silvestres. Dicen los abuelos que ella camina entre los árboles cuidando que los ríos y quebradas siempre tengan agua limpia.",
          "Cuando algunas personas cortan árboles sin permiso o botan basura en el monte, la leyenda cuenta que la Madremonte hace llover muy fuerte y pierde en el camino a quienes dañan el bosque. Al oír esto, el vecino Fermín dijo que habría que cortar todos los árboles para que no exista el bosque; y Doña Rosa dijo que cuidar las plantas no sirve para nada porque el agua nunca se acaba.",
          "Pero los abuelos explican que esta leyenda se inventó para enseñarnos a amar la naturaleza: los árboles y los páramos guardan el agua de la lluvia como si fueran esponjas gigantes y son la casa de muchos animales.",
          "Por eso, leer esta leyenda nos recuerda que no debemos tener miedo del bosque, sino cuidarlo entre todos para tener agua limpia en nuestra vereda."
        ]
      },
      reto: {
        paso1: {
          instruction: "Haz clic en 'Limpiar (Basurero)' en las 2 frases falsas/dañinas:",
          phrases: [
            {
              id: "f1",
              text: "Habría que cortar todos los árboles para que no exista el bosque.",
              shouldClean: true
            },
            {
              id: "f2",
              text: "Cuidar las plantas no sirve para nada porque el agua nunca se acaba.",
              shouldClean: true
            },
            {
              id: "f3",
              text: "Los árboles y los páramos guardan el agua de la lluvia y son la casa de muchos animales.",
              shouldClean: false
            }
          ]
        },
        paso2: {
          questions: [
            {
              question: "Después de limpiar las ideas falsas, ¿para qué inventaron los abuelos la leyenda de la Madremonte?",
              options: [
                { text: "Para enseñarnos a respetar y cuidar los árboles, los animales y el agua.", correct: true },
                { text: "Para que nadie vuelva a sembrar flores.", correct: false },
                { text: "Para asustar a los niños y que no salgan de casa.", correct: false }
              ]
            },
            {
              question: "¿Qué podemos hacer nosotros en nuestra vereda después de entender esta leyenda?",
              options: [
                { text: "No botar basura en las quebradas, cuidar los árboles y contarles esta enseñanza a nuestros vecinos.", correct: true },
                { text: "No hacer nada porque las leyendas son solo cuentos.", correct: false },
                { text: "Cortar los árboles cerca de la escuela.", correct: false }
              ]
            }
          ]
        }
      }
    }
  },

  // Contenido para el Libro de Leyendas y Saberes
  book: {
    title: "Libro de Leyendas y Saberes de San Miguel",
    sections: [
      {
        legend: "Leyenda 1: El Duende travieso de las fincas",
        superpower: "Descomponer (Lectura Literal)",
        medal: "Medalla Ojo de Lince 👁️",
        summary: "El Duende vive cerca de los ríos y barrancos. Carga una guitarra chiquita y hace travesuras escondiendo palas y trenzando colas de caballos. Los abuelos lo calman dejándole una guitarra afinada junto a la puerta.",
        teaching: "Descomponer una historia nos ayuda a encontrar fácilmente la información escrita."
      },
      {
        legend: "Leyenda 2: El Mohán y el secreto del río",
        superpower: "Buscar Patrones (Lectura Inferencial)",
        medal: "Medalla del Detective 🔍",
        summary: "El Mohán cuida los ríos de Colombia. Cuando unos pescadores botaron basura y atraparon pececitos chiquitos, el río se revolvió con remolinos oscuros. Los hombres huyeron muy asustados.",
        teaching: "Unir pistas que se repiten nos permite deducir lo que sienten los personajes y por qué actúan."
      },
      {
        legend: "Leyenda 3: La Madremonte, protectora de los bosques",
        superpower: "Limpiar Errores y Sacar la Idea Principal (Lectura Crítica)",
        medal: "Medalla Guardián del Bosque 🌿",
        summary: "La Madremonte protege los árboles y el agua limpia. Limpiamos las malas ideas de cortar árboles y descubrimos que los bosques y páramos son esponjas de vida que debemos cuidar entre todos.",
        teaching: "Limpiar ideas falsas nos deja con la gran enseñanza: cuidar la naturaleza y el agua de nuestra vereda."
      }
    ]
  }
};
