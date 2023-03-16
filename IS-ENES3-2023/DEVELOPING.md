### Requirements

* Nodejs
* Python
* Graphviz

### Install

```shell
$ yarn install
```

### Build

#### To rebuild resources (e.g. graphs):

```shell
$ make all
```

#### For development:

```shell
$ yarn slidev
```

#### For production:

```shell
$ yarn build
$ python -m http.server --directory dist/
```

> Note: the Python web server can open the index page, but doesn't like the slide
navigation.

#### For GitHub Pages:

```shell
$ yarn gh-pages
```

Slidev creates a resource with a name which starts with an underscore.
Jekyll will filter underscore-prefixed files out. I've tried adding an
exception in the `_config.yml` file, but I just can't get it to let this file
pass through so here's a really nasty hack:

```shell
$ sed -i 's/_commonjsHelpers-28e086c5.js/-commonjsHelpers-28e086c5.js/g' $(git grep --name-only _commonjsHelpers-28e086c5.js)
$ mv dist/assets/_commonjsHelpers-28e086c5.js dist/assets/-commonjsHelpers-28e086c5.js
```

Apologies to future me when reading this :(

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
