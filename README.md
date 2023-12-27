# Moores Cloud Holiday - Moores Fireplace

A heavy modification of [Game-of-Lights](https://github.com/katiejots/game-of-lights) to show a "fire" behind my heater.

## Use

```sh
npm install
npm start
```

- <http://127.0.0.1:8080>

## Contributing

### Terminology

- **Holiday** - The Moores Cloud Holiday device
- **Light** - A single LED on the Holiday
- **Cell** - A single cell in the HTML table
- **Color** - A color in the RGB color space
- **Palette** - An array of colors
- **Pattern** - An array of colors for each light (sometimes it's 49 or 50 colors)

### Notes

- The HTML table is a neat 7x7 grid, but there's 50 lights in a holiday. The first light will the set to the same color as the 2nd light (aka the first cell)