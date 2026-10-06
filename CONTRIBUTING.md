# Contributing

Thanks for helping out. This is a small project, so the process is light.

## Reporting a wrong muscle mapping

Most database exercises had their muscles converted automatically, so some will be off. Use the **Wrong muscle mapping** issue template and include:

- the exercise name as it appears in the app
- the muscles it shows now
- the muscles you think it should show, and why

## Reporting a bug or suggesting a feature

[Open an issue](https://github.com/1mach0/split-muscle-map/issues). For bugs, say what you did, what you expected, what happened, and which browser and device you used. A screenshot helps.

## Making a change

1. Fork the repo and create a branch.
2. Open `index.html` in a browser to test. There is no build step.
3. Keep it dependency-free: plain HTML, CSS and JavaScript. Fonts and jsPDF load from a CDN.
4. Check light and dark mode and a phone-width window before opening a pull request.
5. Describe what changed and why in the pull request.

### Where things live

- **Staple exercises** (hand-checked): the `RAW` list near the top of `js/app.js`. A staple overrides a database exercise with the same name.
- **Database exercises:** generated into `js/data/exercise-db.js` by `tools/build_exercise_db.py`. Fix mapping rules in that script and re-run it rather than editing the generated file.
- **Body map shapes:** the `FRONT` and `BACK` path lists in `js/app.js`. Each muscle is drawn once on the left side and mirrored.
- **Colors and fonts:** the tokens at the top of `css/styles.css`. Every color has a light and a dark value.
