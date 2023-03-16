### Requirements

* Nodejs
* Python
* Graphviz

### Install

```shell
$ yarn install
```

### Build

To rebuild resources (e.g. graphs):

```shell
$ make all
```

For development:

```shell
$ yarn slidev
```

For production:

```shell
$ yarn build
$ python -m http.server --directory dist/
```

> Note: the Python web server can open the index page, but doesn't like the slide
navigation.

For GitHub Pages:

```shell
$ yarn gh-pages
```

### Notes for presenting

* Presenter notes in the slides.
* You may want to disable the link styling in `styles/index.css`.
* If you open the presenter consoler in one browser window and the slides
  in another, Slidev will magically synchronise these for presenting.
* At the time of writing this synchronisation is unstable in development
  mode but works nicely in production mode. Make sure you are using the same
  web browser for both.
* There are also a couple of extra slides in the `extra-slides.md` file to
  help with questions which are commented out.
