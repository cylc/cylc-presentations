.PHONY: all _all

JINJA2_FILES := $(shell find . -name '*.jinja2')
JINJA2_FILES_PROC = $(patsubst %.jinja2,%,$(filter %.jinja2,$(JINJA2_FILES)))

DOT_FILES := $(shell find . -name '*.dot')
DOT_FILES_PROC_PNG = $(patsubst %.dot,%.png,$(filter %.dot,$(DOT_FILES)))
DOT_FILES_PROC_SVG = $(patsubst %.dot,%.svg,$(filter %.dot,$(DOT_FILES)))

# _ = $(shell echo '' >> index.html.jinja2)



_all: $(JINJA2_FILES_PROC) $(DOT_FILES_PROC_PNG) $(DOT_FILES_PROC_SVG)

# run through files twice to support chained processing in one operation
# (e.g. x.dot.jinja2)
all: $(JINJA2_FILES_PROC) $(DOT_FILES_PROC_PNG) $(DOT_FILES_PROC_SVG) _all
	touch index.html.jinja2

$(JINJA2_FILES_PROC): $(JINJA2_FILES)
	./bin/jinja2 "$@.jinja2" > $@

$(DOT_FILES_PROC_PNG): $(DOT_FILES)
	dot -Tpng $(subst png,dot,$@) -Gbgcolor=none -Gfontname=sans -Nfontname=sans -Gdpi=300 -o $@

$(DOT_FILES_PROC_SVG): $(DOT_FILES)
	dot -Tsvg $(subst svg,dot,$@) -Gbgcolor=none -Gfontname=sans -Nfontname=sans -o $@

clean:
	touch ._clean
	rm $(wildcard $(JINJA2_FILES_PROC) $(DOT_FILES_PROC_PNG) $(DOT_FILES_PROC_SVG)) ._clean
