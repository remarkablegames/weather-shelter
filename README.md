<p align="center">
  <img src="public/logo192.png" alt="Phaser Template">
</p>

# Phaser Template

[![release](https://img.shields.io/github/v/release/remarkablegames/weather-shelter)](https://github.com/remarkablegames/weather-shelter/releases)
[![build](https://github.com/remarkablegames/weather-shelter/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablegames/weather-shelter/actions/workflows/build.yml)

<kbd>weather-shelter</kbd> is a template for making [Phaser](https://phaser.io/) games. The template is inspired by the tutorial "[Making your first Phaser 3 game](https://phaser.io/tutorials/making-your-first-phaser-3-game)".

Play the game on:

- [remarkablegames](https://remarkablegames.org/weather-shelter/)

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

Rename the project:

```sh
git grep -l weather-shelter | xargs sed -i '' -e 's/weather-shelter/my-game/g'
```

```sh
git grep -l 'Phaser Template' | xargs sed -i '' -e 's/Phaser Template/My Game/g'
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

## License

[MIT](LICENSE)
