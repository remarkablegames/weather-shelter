<p align="center">
  <img src="public/logo192.png" alt="Weather Shelter">
</p>

# Weather Shelter

[![release](https://img.shields.io/github/v/release/remarkablegames/weather-shelter)](https://github.com/remarkablegames/weather-shelter/releases)
[![build](https://github.com/remarkablegames/weather-shelter/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablegames/weather-shelter/actions/workflows/build.yml)

☂️ Build shelters before the storm arrives. Can your creations weather the storm?

Play the game on:

- [remarkablegames](https://remarkablegames.org/weather-shelter/)

## Credits

- [Sunny Land](https://ansimuz.itch.io/sunny-land-pixel-game-art) by [ansimuz](https://ansimuz.itch.io/)
- [Free Swamp 2D Tileset Pixel Art](https://free-game-assets.itch.io/free-swamp-2d-tileset-pixel-art) by [Free Game Assets](https://free-game-assets.itch.io/)

## Prerequisites

[nvm](https://github.com/nvm-sh/nvm#installing-and-updating):

```sh
brew install nvm
```

## Install

Clone the repository:

```sh
git clone https://github.com/remarkablegames/weather-shelter.git
cd weather-shelter
```

Install the dependencies:

```sh
npm install
```

Update the files:

- [ ] `README.md`
- [ ] `index.html`
- [ ] `package.json`
- [ ] `public/*.png`
- [ ] `public/manifest.json`
- [ ] `src/index.ts`

## Environment Variables

Update the environment variables:

```sh
cp .env .env.local
```

Update the **Secrets** in the repository **Settings**.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the game in the development mode.

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.

You will also see any errors in the console.

### `npm run build`

Builds the game for production to the `dist` folder.

It correctly bundles in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your game is ready to be deployed!

### `npm run bundle`

Builds the game and compresses the contents into a ZIP archive in the `dist` folder.

Your game can be uploaded to your server, [itch.io](https://itch.io/), [newgrounds](https://www.newgrounds.com/), etc.

## Testing

Start a specific level by appending `?level=<number>` to the URL (e.g., `?level=2`):

```sh
open http://localhost:5173/?level=2
```

## License

[MIT](LICENSE)
