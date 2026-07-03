# FiveM Custom Loading Screen

A slick, fully custom FiveM loading screen with a video background, music controls, live player count, and animated UI elements. Theme colors are controlled from a single block at the top of `styles.css`.

## Preview

<p align="center">
  <img src="https://i.imgur.com/K9HgMgI.jpeg" width="600" alt="Loading Screen Preview" />
</p>

---

## Features

- **MP4 video background** with smooth fade-in on load
- **MP3 background music** with play/pause toggle and volume slider
- **Spacebar** toggles music on/off
- **Animated equalizer bars** that collapse flat when music is paused
- **Live loading bar** tied to FiveM's real `loadProgress` event with stage-aware status labels
- **Live player count** fetched from the server's `/players.json` endpoint, auto-refreshes every 30 seconds (click to manually refresh)
- **Live clock** in the top-right corner
- **Animated corner brackets**, scanlines, noise grain, and vignette overlay
- **Floating logo** with glow pulse animation
- **Fully theme-able** — change all colors from one place

---

## File Structure

```
robins-loading/
├── fxmanifest.lua    — FiveM resource manifest
├── index.html        — Loading screen markup
├── styles.css        — All styles and animations
├── script.js         — All JavaScript logic
├── bg.mp4            — Your background video (you provide this)
├── music.mp3         — Your background music (you provide this)
└── logo.png          — Your server logo (you provide this)
```

> `README.md` does not need to be included in the resource folder.

---

## Installation

1. Drop the folder into your server's `resources/` directory
2. Add the following to your `server.cfg`:
```
ensure robins-loading
```
3. Replace `bg.mp4`, `music.mp3`, and `logo.png` with your own files
4. Restart your server

---

## Changing the Theme Color

Open `styles.css` and edit the `:root` block at the very top of the file. This is the **only place** you need to change to re-theme the entire loading screen.

```css
:root {
  --accent-primary: #ff3333;   /* Main accent color */
  --accent-light:   #ff7777;   /* Lighter variant (glow, hover) */
  --accent-dim:     #8b1a1a;   /* Dimmer variant (corners, divider) */
  --accent-deep:    #2d0000;   /* Deepest variant (backgrounds) */
  --dark:           #0e0404;   /* Page background */
  --dark-2:         #180505;   /* Secondary background */
  --white:          #fff0f0;   /* Primary text color */
  --muted:          rgba(255, 210, 210, 0.45);  /* Muted text */
  --bar-bg:         rgba(255, 51, 51, 0.1);     /* Bar track background */
}
```

### Example Themes

**Purple**
```css
--accent-primary: #9b6dff;
--accent-light:   #c4a3ff;
--accent-dim:     #5a3d99;
--accent-deep:    #2a1560;
--dark:           #06040e;
--dark-2:         #0e0820;
--white:          #f0ecff;
--muted:          rgba(220, 210, 255, 0.45);
--bar-bg:         rgba(155, 109, 255, 0.1);
```

**Red**
```css
--accent-primary: #ff3333;
--accent-light:   #ff7777;
--accent-dim:     #8b1a1a;
--accent-deep:    #2d0000;
--dark:           #0e0404;
--dark-2:         #180505;
--white:          #fff0f0;
--muted:          rgba(255, 210, 210, 0.45);
--bar-bg:         rgba(255, 51, 51, 0.1);
```

**Blue**
```css
--accent-primary: #3b82f6;
--accent-light:   #93c5fd;
--accent-dim:     #1e3a8a;
--accent-deep:    #0d1f4e;
--dark:           #04080e;
--dark-2:         #080f1e;
--white:          #f0f4ff;
--muted:          rgba(210, 225, 255, 0.45);
--bar-bg:         rgba(59, 130, 246, 0.1);
```

**Gold**
```css
--accent-primary: #c8a96e;
--accent-light:   #e8c98e;
--accent-dim:     #8a6e40;
--accent-deep:    #3a2a10;
--dark:           #06050a;
--dark-2:         #0d0c10;
--white:          #f0ece4;
--muted:          rgba(240, 220, 180, 0.45);
--bar-bg:         rgba(200, 169, 110, 0.1);
```

---

## Customizing Content

| What | Where | How |
|---|---|---|
| Server name | `index.html` | Change `Your Server` inside `<div id="server-name">` |
| Subtitle | `index.html` | Change `FiveM Roleplay` inside `<div id="server-sub">` |
| Logo size | `styles.css` | Change `width` and `height` on `#logo` |
| Music default volume | `index.html` | Change `value="50"` on the volume slider (0–100) |
| Player count refresh rate | `script.js` | Change `30000` in `setInterval(fetchPlayerCount, 30000)` |

---

## How the Loading Bar Works

The loading bar listens for FiveM's built-in `loadProgress` NUI message, which sends:
- `loadFraction` — a number from `0.0` to `1.0` representing overall load progress
- `initiatorType` — a string describing what is currently being loaded (`network`, `cdn`, `resource`, `map`, etc.)

The status label below the bar updates automatically based on `initiatorType`. No configuration needed.

---

## How the Player Count Works

The player count fetches `/players.json` — a built-in HTTP endpoint that every FiveM server exposes automatically. No extra scripts or exports are needed. It shows `0 Online Players` if the fetch fails or the server returns an empty list.

> If player count always shows `0`, check that `sv_endpointprivacy` is not blocking the endpoint in your `server.cfg`.

---

## Troubleshooting

**Loading screen doesn't disappear after joining**
Ensure `loadscreen_manual_shutdown` is **not** present in `fxmanifest.lua`. FiveM handles shutdown automatically without it.

**Black screen on join**
Confirm all files (`bg.mp4`, `music.mp3`, `logo.png`) are present in the resource folder and listed under `files {}` in `fxmanifest.lua`.

**Video doesn't fill the screen**
Make sure `bg.mp4` is exported at 16:9 aspect ratio (e.g. 1920×1080) with no black bars baked into the video itself unless that is the look you are going for.

**Music doesn't play**
FiveM's CEF browser may block autoplay until user interaction. The screen will attempt autoplay on load — if it fails, clicking anywhere or pressing Space will start it.

**Player count shows 0 in preview**
This is expected when opening `index.html` directly in a browser. The `/players.json` endpoint only resolves correctly inside FiveM while connected to a live server.
