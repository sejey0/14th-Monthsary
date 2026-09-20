# Happy 14 monthsary lovelove - Letter Website

A romantic, elegant, and tasteful letter website created to celebrate your 14th monthsary together. Designed with a blend of purple and pink gradients, clean glassmorphism, zero emojis (only Lucide SVG icons), an interactive passcode lock, a 3D opening envelope, and full music player controls.

## Features

- **Passcode Lock Screen**:
  - Displays title: **"Happy 14 monthsary lovelove"**
  - Default Passcode: `14` (or `1414`)
  - Includes a "Need a hint?" toggle and an "Open with Love Key" direct unlock button.
  - Smooth unlock animation with harmonic chime audio.

- **Envelope & Letter Presentation**:
  - 3D envelope with purple and pink silk texture, gold dashed borders, and a wax seal stamped with an interlocking heart icon.
  - Clicking the wax seal or the **"Read 14th Monthsary Letter"** button breaks the seal, opens the envelope flap, unfolds the parchment letter, and triggers background music!
  - Inside the Letter:
    - Dedicated title and heartfelt 14-month celebration letter.
    - **14 Little Things I Cherish About You**: Interactive expandable cards highlighting 14 sweet reasons with unique icons.
    - **Polaroid Keepsake Frames**: Romantic photo cards with tape aesthetics.
    - Quote banner and lover's wax seal signature.
    - "Fold Letter Back into Envelope" option to re-experience anytime.

- **Music Controller**:
  - Located in the floating top header dock.
  - **Play / Pause** toggle.
  - **Volume Slider** + **Volume Up** (+10%) and **Volume Down** (-10%) quick buttons.
  - Dynamic volume icon (`volume-2`, `volume-1`, `volume-x`).
  - Animated sound visualizer equalizer bars.
  - **Smart Audio Fallback**: As requested, no actual music file is bundled initially. The player points to `music.mp3`. If `music.mp3` is not found, the website utilizes an ambient romantic chime synthesizer (via Web Audio API) so you can test audio controls immediately.

## Adding Your Own Music

To add your special romantic song:
1. Obtain your audio file in MP3 format.
2. Rename it to `music.mp3`.
3. Place it in this folder alongside `index.html`.
4. Reload the website! The music player will automatically play your song when the letter is opened.

## Customizing

- **Letter Text**: Open `index.html` and edit the paragraphs inside `<div class="letter-parchment">`.
- **Passcode**: Open `script.js` and change `const PASSCODE = "14";` to any code you prefer.
- **Photos**: In `index.html`, replace the memory card placeholder containers with `<img src="your-photo.jpg" class="w-full aspect-square object-cover rounded-lg">`.
