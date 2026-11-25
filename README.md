# 🌾 Los Rastreadores de Leyendas de San Miguel
### Videojuego Educativo Web 2D en Pixel Art (Comprensión Lectora + Pensamiento Computacional)
**I.E.M.R. La Granja — Sede San Miguel (Zipaquirá, Cundinamarca, Colombia)**  
*Para estudiantes de 3.º de Primaria (8 a 9 años)*

---

## 🎮 ¿Cómo Jugar?

El juego está diseñado con tecnologías web estándar (**HTML5 Canvas, CSS3 y JavaScript moderno**) sin dependencias externas ni compiladores complejos.

### Enlace Directo (Servidor Local Activo)
El servidor local ya se encuentra ejecutándose en el puerto **8080**:
👉 **`http://localhost:8080`**

### Ejecución Offline
También puedes abrir directamente el archivo **`index.html`** con doble clic en cualquier navegador (Google Chrome, Microsoft Edge, Safari o Firefox).

---

## 🕹️ Controles del Juego

- **Mover al personaje**: Flechas del teclado (`↑`, `↓`, `←`, `→`), teclas `WASD`, o haciendo clic / toque en la casilla adyacente.
- **Interactuar / Hablar**: Tecla `Espacio`, `Enter` o botón circular en pantalla **[A Hablar]**.
- **Controles táctiles**: D-Pad virtual y botón de acción para tabletas escolares y celulares.
- **Copo el perrito**: Te sigue fielmente un paso atrás en todos los escenarios.
- **Arreglo de dirección visual**: Movimiento lateral impecable mediante volteo horizontal programático (`ctx.scale(-1, 1)`).

---

## ⚡ Los 4 Superpoderes (Botón "Mis Poderes" en el HUD)

1. **Descomponer (Partir en pedacitos - Lectura Literal)**:
   > *"Cuando una historia parece muy larga, la partimos en pedacitos pequeños: ¿quién sale en el cuento?, ¿dónde pasa? y ¿qué hace? Así es súper fácil encontrar las respuestas que están escritas en la lectura."*
2. **Buscar Patrones (Unir pistas - Lectura Inferencial)**:
   > *"A veces el cuento no dice todo con palabras, pero deja pistas escondidas. Unimos las pistas que se repiten (como la cara de susto o una tormenta) para adivinar qué sienten los personajes o por qué pasa algo."*
3. **Limpiar Errores (Depuración - Lectura Crítica)**:
   > *"Cuando leemos, a veces encontramos cosas que la gente dice sin tener pruebas o por puro miedo. Limpiar errores es quitar esas ideas falsas para quedarnos solo con lo que sí es verdad."*
4. **Sacar la Idea Principal (Abstracción - Lectura Crítica)**:
   > *"Después de quitar lo que sobra, nos quedamos con la enseñanza más importante de la historia y pensamos: ¿cómo nos ayuda esto a cuidar nuestra escuela, el agua y los bosques?"*

---

## 🗺️ Flujo por Pantallas Independientes (Un Escenario por Nivel)

### 🏫 Pantalla 0: Inicio (Escuela Rural San Miguel)
- Registro del estudiante y elección de avatar (**Tomás** o **Valeria**).
- Escenario pixel art de la Escuela Rural San Miguel con el **Abuelo Jacinto**, la **Profesora Lucía** y **Copo**.
- Diálogo de bienvenida e inducción a las leyendas colombianas.
- Al caminar hacia la derecha junto al letrero, avanzas a la Pantalla 1.

### 🥔 Pantalla 1: Nivel 1 (Cultivos de Papa y Huerta Escolar)
- **Dificultad**: Fácil — Lectura Literal + Descomponer.
- **Tarjeta Previa**: Explicación del reto literal y el superpoder de descomponer.
- **Lectura 1**: *"El Duende travieso de las fincas"*.
- **Reto Interactivo (4 Cajas de Descomposición)**:
  - Caja 1: ¿Dónde vive el Duende? ➔ *Cerca de los ríos, los barrancos y las fincas del campo.*
  - Caja 2: ¿Cómo se viste y qué carga? ➔ *Un sombrero gigante y una guitarra chiquita llamada tiple.*
  - Caja 3: ¿Qué travesuras hace? ➔ *Esconde palas, mueve ollas y hace trenzas a las colas de los caballos.*
  - Caja 4: ¿Cómo lo calman los abuelos? ➔ *Dejando un tiple afinado junto a la puerta de la casa.*
- **Recompensa**: **Medalla Ojo de Lince 👁️**.

### 🐄 Pantalla 2: Nivel 2 (Potreros y Establo Lechero)
- **Dificultad**: Media — Lectura Inferencial + Buscar Patrones.
- **Tarjeta Previa**: Detective de pistas escondidas y búsqueda de patrones.
- **Lectura 2**: *"El Mohán y el secreto del río"*.
- **Reto Interactivo en 2 Pasos**:
  - *Paso 1 (Unir pistas)*: Seleccionar las 3 pistas reales sobre el cambio del río (gritos y basura, pesca de pececitos chiquitos, remolinos oscuros y rugido).
  - *Paso 2 (Preguntas de Detective)*: Deducir por qué se enojó el Mohán y el miedo que sintieron los hombres al huir.
- **Recompensa**: **Medalla del Detective 🔍**.

### 🌲 Pantalla 3: Nivel 3 (Quebrada y Bosque Alto)
- **Dificultad**: Retadora — Lectura Crítica + Limpiar Errores y Sacar la Idea Principal.
- **Tarjeta Previa**: Pensamiento crítico, depurar mentiras y encontrar la enseñanza de vida.
- **Lectura 3**: *"La Madremonte, protectora de los bosques"*.
- **Reto Interactivo en 2 Pasos**:
  - *Paso 1 (Limpiar Errores - Depuración)*: Enviar al basurero las 2 frases falsas (cortar todos los árboles y que cuidar las plantas no sirve) y conservar la verdad ecológica de que los árboles y páramos son esponjas que guardan el agua.
  - *Paso 2 (Sacar la Idea Principal - Abstracción)*: Reflexionar sobre el verdadero propósito de la leyenda y las acciones comunitarias para cuidar el agua en San Miguel.
- **Recompensa**: **Medalla Guardián del Bosque 🌿**.

### 🎉 Pantalla Final: Celebración y Libro de Leyendas
- Escenario festivo en la Escuela San Miguel con todos los personajes reunidos (Jacinto, Rigoberto, Lucía, Copo, Tomás/Valeria) y lluvia de confeti animada.
- **Libro de Leyendas y Saberes interactivo**:
  - **Diploma Oficial de Honor** con el nombre del estudiante, grado 3.º de primaria, sellos de la I.E.M.R. La Granja y las 3 medallas.
  - Botón para **Imprimir o Guardar en PDF** con formato listo para entregar a los niños.
  - Pestañas con las 3 leyendas resueltas y sus enseñanzas.
  - Botón para volver a jugar.

---

## ♿ Accesibilidad y Lectura en Voz Alta

- Botón **"🔊 Escuchar lectura"** (Web Speech API en español) en todos los diálogos, tarjetas previas, párrafos de historias y preguntas.
- Tipografía clara, grande y de alto contraste ("Nunito" de 16 a 19px con interlineado generoso) especialmente adaptada para niños de 8 y 9 años.
- Efectos de sonido chiptune retro sintetizados con la Web Audio API (sin dependencias externas).

---
*I.E.M.R. La Granja — Sede San Miguel, Zipaquirá.*
