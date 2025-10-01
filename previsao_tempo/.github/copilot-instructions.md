# Copilot Instructions for previsao_tempo

This project is a simple weather forecast web app. It consists of three main files:
- `index.html`: Main HTML structure, includes jQuery and links to `script.js` and `styles.css`.
- `script.js`: Intended for JavaScript logic (currently empty).
- `styles.css`: Intended for CSS styles (currently empty).

## Architecture & Data Flow
- The app is designed to allow users to search for the weather in a city. The UI includes an input box and a button for searching.
- Weather data is expected to be displayed dynamically in the `<main>` section, updating the city name and temperature.
- All dynamic behavior should be implemented in `script.js` using jQuery for DOM manipulation and AJAX requests.

## Developer Workflow
- No build tools or test frameworks are present; development is direct-to-file.
- Open `index.html` in a browser to view changes live.
- Use jQuery for all DOM and AJAX operations (already included via CDN).

## Project-Specific Conventions
- All scripts and styles are loaded directly in `index.html`.
- Weather API integration (if added) should be handled in `script.js` using jQuery's AJAX methods.
- UI updates (city name, temperature, etc.) should target elements inside `<main>`.
- Keep all logic in `script.js` and all styles in `styles.css`.

## Integration Points
- External dependency: jQuery (CDN).
- If integrating a weather API, document the endpoint and expected response structure in comments within `script.js`.

## Example Pattern
```js
// script.js
$("button").on("click", function() {
    var city = $("input").val();
    // Call weather API and update UI
});
```

## Key Files
- `index.html`: Entry point and UI structure
- `script.js`: All JavaScript logic
- `styles.css`: All CSS styles

---
If you add new conventions or workflows, update this file to keep AI agents productive.
