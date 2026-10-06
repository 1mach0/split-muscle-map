# Split Muscle Map

Plan a weekly training split and see exactly which muscles it trains.

Pick exercises for each day and the front and back body maps highlight what you're hitting. The week view shows how many days each muscle is a main target, and a spiderweb chart shows how balanced the whole split is. Build several splits, compare them side by side, and export any of it as a PDF.

No build step, no backend, no account. It's one static page.

## Features

- **Body maps:** front and back views with 23 muscles. Day view shows main targets and helpers; week view shows how often each muscle is trained (1×, 2×, 3×+, helper only, missed).
- **Spiderweb chart:** weekly sets or days per week, by muscle or by muscle group. Pick a day to overlay it on the week.
- **794 exercises:** 75 hand-checked staples plus 719 from [Free Exercise DB](https://github.com/yuhonas/free-exercise-db), with photos and step-by-step instructions.
- **Filters:** search by exercise or muscle, filter by muscle group, equipment (barbell, dumbbell, cable, machine, body only, kettlebell, bands) and source. Tap any muscle to list exercises that train it.
- **Multiple splits:** tabs for Split 1, Split 2, and so on. Duplicate a split to try changes.
- **Compare:** two splits side by side with body maps, an overlaid spiderweb and a muscle-by-muscle table of days and sets.
- **PDF export:** the split's body maps, spiderweb, every day with its own body maps and exercise table, and a full muscle coverage table. In compare view it exports the comparison.
- **Custom exercises:** add your own and tag which muscles they work.
- **Light and dark mode** follow your system setting.

Your splits are saved in your browser (localStorage), so they stay put between visits on the same device and browser.

## Run it

Open `index.html` in a browser. That's it.

If your browser blocks local files for some reason, serve the folder instead:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Fonts and the PDF library load from Google Fonts and jsDelivr, so the first load needs a connection.

## Put it online with GitHub Pages

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
4. The site appears at `https://<your-username>.github.io/<repo-name>/` after a minute or two.

## Project structure

```
index.html                 Page markup
css/styles.css             All styles, light and dark themes
js/app.js                  App logic: state, body maps, spiderweb, compare, PDF export
js/data/exercise-db.js     Generated exercise database (do not edit by hand)
images/exercises/<id>/     Start and finish photos for database exercises (480px JPEGs)
tools/build_exercise_db.py Rebuilds js/data/exercise-db.js from Free Exercise DB
tools/fetch_images.py      Downloads and resizes the exercise photos
```

## How the muscle data works

Each exercise lists **main targets** and **helpers**.

- A day counts toward a muscle's weekly frequency only when that muscle is a main target.
- Weekly sets count main-target sets in full and helper sets as half.

The 75 staples were mapped by hand. Free Exercise DB only uses about 17 broad labels ("shoulders", "chest", "middle back"), so `tools/build_exercise_db.py` converts them to the map's 23 muscles using the exercise name. For example, "lateral raise" becomes side delts and "incline" becomes upper chest. Most come out right, but some won't. To fix one, change the rules in that script and rebuild, or add the exercise as a staple in `js/app.js` (the `RAW` list), which takes priority over a database entry with the same name.

### Updating the exercise database

```sh
python3 tools/build_exercise_db.py   # downloads the latest dataset and rewrites js/data/exercise-db.js
pip install pillow
python3 tools/fetch_images.py        # downloads any missing photos into images/exercises/
```

## Roadmap ideas

- Link staples to their matching database entry so they get photos and instructions too.
- Weekly set targets per muscle (for example 10 to 20), drawn as a ring on the spiderweb.
- Reps, RIR and notes per exercise.
- Drag to reorder exercises and move them between days.
- Overlap warnings, for example heavy lower-back work on back-to-back days.
- Split templates: push/pull/legs, upper/lower, full body, Arnold split.
- Share a split as a link, and import or export it as JSON.
- An "equipment I have" profile that hides exercises your gym can't do.
- Install as an offline app (PWA).
- A workout log to track weights over time.
- More muscles on the map: neck, serratus, tibialis, hip flexors.

## Credits

- Exercise data and photos: [Free Exercise DB](https://github.com/yuhonas/free-exercise-db) by yuhonas, released into the public domain under the Unlicense.
- PDF export: [jsPDF](https://github.com/parallax/jsPDF) and [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable), both MIT licensed.
- Fonts: Big Shoulders Display and Public Sans from Google Fonts, both under the SIL Open Font License.

## License

No license has been chosen yet. Add a `LICENSE` file before others use or contribute to the code (MIT is a common choice for small web projects).
