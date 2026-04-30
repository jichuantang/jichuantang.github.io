# jichuantang.github.io

Personal academic website of **Jichuan Tang**, Ph.D. student in Civil Engineering at the University of Notre Dame.

Live site: <https://jichuantang.github.io>

## Pages

- `index.html` — Research overview and current projects
- `about.html` — Bio, education, awards, contact
- `news.html` — News, talks, and conferences
- `publication.html` — Journal papers, conference papers, thesis

## Stack

Static HTML pages styled with Bootstrap 3, jQuery, Font Awesome, and Academicons. Dark mode and small interactions live in `js/main.js`. Page chrome (navbar/footer) is shared via the `w3-include-html` pattern in `js/w3data.js`.

## Local development

The site is fully static. Open `index.html` in a browser, or serve the directory with any static server, e.g.:

```sh
python -m http.server 8000
```

then visit <http://localhost:8000>.

## Credits

Original academic site template by Randal Sean Harrison (Hesburgh Libraries, University of Notre Dame), released under the included `LICENSE`. Substantially customized and extended for this site.
