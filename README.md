# Split Muscle Map

Plan your weekly gym split and see which muscles it trains.

**[Open the app →](https://1mach0.github.io/split-muscle-map/)**

![Week view](docs/week-v4.png)

## Features

- Front and back body maps with 27 muscles
- Spiderweb chart of weekly sets or days per muscle, with set targets
- 806 exercises with photos and instructions
- Templates: Push / Pull / Legs, Upper / Lower, Full body, Arnold
- Compare two splits side by side
- Share as a link, export to JSON or PDF
- Custom exercises, light and dark mode

## Screenshots

| Plan your split | Spiderweb view of split |
|---|---|
| ![Day view](docs/day-v4.png) | ![Spoke picker](docs/web-v2.png) |

| Exercise photos | Compare splits |
|---|---|
| ![Photo viewer](docs/photo-v4.png) | ![Compare view](docs/compare-v4.png) |

## Run locally

```sh
git clone https://github.com/1mach0/split-muscle-map.git
cd split-muscle-map
python3 -m http.server 8000
```

## Credits

- Exercise data and photos: [Free Exercise DB](https://github.com/yuhonas/free-exercise-db) (public domain)
- PDF export: [jsPDF](https://github.com/parallax/jsPDF)

## License

[MIT](LICENSE).
