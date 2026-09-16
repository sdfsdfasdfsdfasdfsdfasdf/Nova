# Arcade

A small, self-contained collection of browser games: Snake, 2048, Memory, and Tic-Tac-Toe. Plain HTML, CSS, and JavaScript — no build step, no frameworks, no external game embeds or trackers.

## Run it locally

Just open `index.html` in a browser. Everything works offline except the Google Fonts stylesheet linked in `styles.css` — without internet access it'll fall back to your system font.

## Put it on GitHub Pages

1. Create a new repository and push this folder's contents to it (this `README.md` can sit at the repo root alongside `index.html`, `styles.css`, and `games/`).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch," pick your default branch (usually `main`) and the `/ (root)` folder, then save.
4. GitHub gives you a URL like `https://yourusername.github.io/your-repo-name/` — it can take a minute to go live.

## Structure

```
index.html          landing page with links to each game
styles.css           shared design system (colors, type, layout)
games/
  snake.html / .js
  2048.html   / .js
  memory.html / .js
  tictactoe.html / .js
```

## Add another game

1. Duplicate one of the folders in `games/` as a starting point, or add a new `games/yourgame.html` + `.js` pair.
2. Link back to `../styles.css` in the `<head>` and reuse the `.game-header`, `.game-title`, `.game-stage`, `.hud`, and `.btn` classes so it matches the rest of the site.
3. Add a new cartridge card to `index.html`'s `<main class="grid">`, pick an unused `--tint` color, and point its `href` at your new page.
