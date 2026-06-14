# Pokédex JS

A responsive Pokédex web app that fetches data from the PokéAPI. Built with Vanilla JavaScript, HTML and custom CSS.

Una Pokédex web responsiva que consume datos de la PokéAPI. Construida con JavaScript puro, HTML y CSS custom.

![Preview](preview.png)

## Live Demo

[https://va-mathml.github.io/pokedex-js/](https://va-mathml.github.io/pokedex-js/)

## Features / Funcionalidades

- Browse the original 150 Pokémon with official artwork / Explora los 150 Pokémon originales con arte oficial
- Real-time search by name / Búsqueda en tiempo real por nombre
- Filter by type (Fire, Water, Grass...) / Filtro por tipo
- Detailed modal: base stats with visual bars, Pokédex description and type weaknesses / Modal detallado: stats con barras visuales, descripción Pokédex y debilidades por tipo
- Export any Pokémon card as PNG / Exportar cualquier card como imagen PNG
- Dark mode UI / Interfaz en modo oscuro
- Fully responsive / Totalmente responsivo

## Tech Stack

- HTML5
- CSS3 (custom properties, grid, flexbox)
- JavaScript ES6+ (async/await, fetch, Promise.all, DOM manipulation)
- Bootstrap 5.3 (base reset)
- html2canvas (card export)
- PokéAPI v2

## Key Technical Highlights / Aspectos técnicos destacados

- Consuming RESTful APIs with fetch and handling JSON responses / Consumir APIs REST con fetch y manejar respuestas JSON
- Parallel HTTP requests with Promise.all for performance / Peticiones HTTP paralelas con Promise.all para rendimiento
- Dynamic DOM rendering without frameworks / Renderizado dinámico del DOM sin frameworks
- Client-side filtering and search logic / Lógica de filtrado y búsqueda del lado del cliente
- Converting remote images to base64 for canvas export / Convertir imágenes remotas a base64 para exportar con canvas
- Custom CSS layout with grid and flexbox, no UI library dependency / Layout CSS propio con grid y flexbox, sin dependencia de librería UI

## Run Locally / Ejecutar localmente

```bash
git clone https://github.com/va-mathml/pokedex-js.git
cd pokedex-js
# Open index.html with Live Server or any browser
```

## Author / Autor

Victor Aguilar — [GitHub](https://github.com/va-mathml)