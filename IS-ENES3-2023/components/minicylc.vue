<!-- MiniCylc component

-->

<template>
  <div>
    <object ref="object" :style="`width: ${width}; height: ${height};`" />
  </div>
</template>

<script>
import $ from "jquery"

// Default Cylc colour theme.
var minicylc_default_theme = {
    'waiting_fill': 'none',
    'waiting_stroke': 'black',
    'running_fill': '#55c3e5ff',
    'running_stroke': 'black',
    'succeed_fill': '#64c77eff',
    'succeed_stroke': 'black'
}

// Old Cylc 7 theme.
var minicylc_cylc7_theme = {
    'waiting_fill': 'none',
    'waiting_stroke': '#88c6ff',
    'running_fill': '#00c410',
    'running_stroke': 'black',
    'succeed_fill': '#ada5a5',
    'succeed_stroke': 'black'
}

// Demo colour theme for demmonstrating workflow logic.
var minicylc_demo_theme = {
    'succeed_fill': '#aabbff',
    'succeed_stroke': 'black'
}

class MiniCylc {
    /**
     * Class for animating SVG graphs.
     *
     * Attributes:
     *   - nodes: A dictionary of task names against a list of SVG nodes.
     *   - edges: A dictionary of task edges against a list SVG nodes.
     *   - dependencies: A dictionary of task names against a list of
     *     conditional expressions.
     */

    constructor(div) {
        /**
         * Initiate the object.
         * @param div The <div> element containing the SVG.
         * */
        this.div = div;
        this.svg = null;
        this.follow = ($(div).data('follow') === true)
        this.mainLoopStep = Number($(div).data('stepTime'))

        this.load();
    }

    load() {
        /**
         * Obtain nodes and edges from svg.
         *
         * This function calls itself recursively until the SVG is loaded.
         *
         * This function starts the animation when finished.
         */
        // const svg = ($(this.div).find('object:first')[0]).contentDocument;
        const svg = this.div.contentDocument
        const self = this;

        if (!svg) {
          // console.log('Wait for SVG load: Gecko');
          // this retry loop works for Firefox, etc
          setTimeout(function() {
            self.load();
          }, 500)
          return;
        }
        var eles = $(svg).find('g');
        if (!eles.length) {
          // console.log('Wait for SVG load: Blink');
          // this retry loop works for Chrome, etc
          setTimeout(function() {
            self.load();
          }, 500)
          return;
        }

        this.svg = $(svg).children()[0]
        
        this._find_svg_elements();

        // Parse dependencies.
        var deps = this._get_dependencies_from_graph(this.div);
        this._construct_dependency_map(deps);

        // Process colour theme.
        this.setup_colours($(this.div).data('theme'));

        this.run()
    }

    setup_colours(theme) {
        /**
         * Set the colour theme.
         * @param theme The name of a colour theme as a string.
         */
        if (!theme || theme == 'default') {
            this.theme = minicylc_default_theme;
        } else if (theme == 'demo') {
            this.theme = minicylc_demo_theme;
        } else if (theme == 'cylc7') {
            this.theme = minicylc_cylc7_theme;
        } else {
            console.log('Warning: Invalid theme detected "' + theme +
                        '", defaulting to black.');
            this.theme = {};
        }
    }

    _find_svg_elements() {
        /**
         * Associate task/dependency names with SVG nodes.
         *
         * Associations stored as dictionaries this.nodes and this.edges.
         * @param svg The <svg> element containing the workflow.
         */
        var nodes = {};
        var edges = {};
        $(this.svg).find('g').each(function() {
            var node = $(this)[0];
            var node_class = $(node).attr('class');
            if (node_class == 'node') {
                nodes[node.textContent.trim().split('\n')[0]] = node;
            } else if (node_class == 'edge') {
                edges[node.textContent.trim().split('\n')[0]] = node;
            }
        });
        this.nodes = nodes;
        this.edges = edges;
    }

    _get_dependencies_from_graph(div) {
        /**
         * Extract, parse and return a list of dependencies.
         * @param div The minicylc <div> element.
         * @return A list of [left, right] lists e.g. ['a & b', 'c'].
         */
        return $(div).data('dependencies')
          .split('//')
          .map(x => x.split(','))
        // var deps = [];
        // var ind = 0;
        // var parts;
        // for (let dep of $(div).data('dependencies').split('//')) {
        //     parts = dep.split('=>');
        //     if (parts.length == 0) {
        //         continue;  // Graph line does not contain a dependency => skip.
        //     }
        //     for(ind = 0; ind < parts.length-1; ind++) {
        //         deps.push([parts[ind].trim(), parts[ind + 1].trim()]);  // [left, right].
        //     }
        // }

        // return deps;
    }

    _construct_dependency_map(deps) {
        /**
         * Associate tasks with conditional expressions.
         *
         * Associations stored as a dictionary - this.dependencies.
         * @param deps A list of dependencies in the form [[left, right], ...].
         */
        var condition;
        var conditional_regex = /[()&]/;
        var conditional_regex2 = /([()&|])/;
        var conditional_chars = ['(', ')', '|', '&'];
        this.dependencies = {};
        for (let dep of deps) {
            // Build a javascript parsable conditional statement.
            condition = [];
            for (let left of dep[0].split(conditional_regex2)) {
                left = left.trim();
                if (left) {
                    if (!conditional_chars.includes(left)) {
                        // All dependencies are :succeed by default,
                        // dependencies are checked using
                        // this.succeed.has(task).
                        condition.push('this.succeed.has("' + left + '")');
                    } else {
                        // conditional character.
                        condition.push(left);
                    }
                }
            }
            condition = condition.join(' ');

            // Associate conditional statements with tasks.
            for (let right of dep[1].split(conditional_regex)) {
                right = right.trim();
                if (!this.dependencies[right]) {
                    this.dependencies[right] = [];
                }
                this.dependencies[right].push(condition);
            }
        }
    }

    evaluate_dependencies(task) {
        /**
         * Check if a task's dependencies are satisfied.
         * @param task The name of the task to evaluate.
         * @return true if satisfied else false.
         */
        var deps = this.dependencies[task];
        if (!deps) {
            return true;
        }
        for (let dep of deps) {
            if (eval(dep) == 0) {
                return false;
            }
        }
        return true;
    }

    _style_node(node, fill, stroke) {
        /**
         * Style a graphviz node.
         * @param fill The fill colour for SVG e.g. 'none', '#aabbcc', 'black'.
         * @param stroke The stroke colour for SVG.
         */
        if (!fill) {
            fill = 'none';  // Default to an unfilled node.
        }
        if (!stroke) {
            stroke = 'black';  // Default to a black border.
        }
        // Style nodes.
        $($(this.nodes[node]).find('ellipse:first')).attr({
            'fill': fill,
            'stroke': stroke
        });
    }

    _style() {
        /**
         * Refresh the style of graph nodes based on their state.
         */
        for (let task of this.waiting) {
            this._style_node(task,
                             this.theme['waiting_fill'],
                             this.theme['waiting_stroke']);
        }
        for (let task of this.running) {
            this._style_node(task,
                             this.theme['running_fill'],
                             this.theme['running_stroke']);
        }
        for (let task of this.succeed) {
            this._style_node(task,
                             this.theme['succeed_fill'],
                             this.theme['succeed_stroke']);
        }
    }

    _init() {
        /**
         * Initiate the simulation / animation.
         */
        this.waiting = new Set();
        this.running = new Set();
        this.succeed = new Set();
        for (let task in this.nodes) {
            this.waiting.add(task);
        }
        this._style();
    }

    _advance() {
        /*
         * To be called with each main loop.
         * @return true if the task pool has changed else false.
         */
        var changed = false;
        for (let task of this.running) {
            this.running.delete(task);
            this.succeed.add(task);
            changed = true;
        }
        for (let task of this.waiting) {
            if (this.evaluate_dependencies(task)) {
                this.waiting.delete(task);
                this.running.add(task);
                changed = true;
            }
        }
        return changed;
    }

    _getActiveBBox(taskStates) {
        let left = null, right = null, ttop = null, bottom = null;
        let bbox;

        if (! taskStates) {
            taskStates = [this.succeed];
        }

        // get bbox of nodes
        for (let taskSet of taskStates) {
            console.log('# active', taskSet)
            for (let node of taskSet) {
                // getTransformToElement

                // use the ellipse dimensions
                let ellipse = $($(this.nodes[node]).find('ellipse:first')[0]);
                let cx = parseFloat(ellipse.attr('cx'))
                let cy = parseFloat(ellipse.attr('cy'))
                let rx = parseFloat(ellipse.attr('rx'))
                let ry = parseFloat(ellipse.attr('ry'))
                bbox = {
                    'left': cx - rx,
                    'right': cx + rx,
                    'top': cy - ry,
                    'bottom': cy + ry
                }

                if (left === null || bbox.left < left) {
                    left = bbox.left
                }
                if (ttop === null || bbox.top < top) {
                    ttop = bbox.top
                }
                if (right === null || bbox.right > right) {
                    right = bbox.right
                }
                if (bottom === null || bbox.bottom > bottom) {
                    bottom = bbox.bottom
                }
            }
        }

        return [left, right, ttop, bottom];
    }

    _setViewBox(x, y, w, h) {
            $(this.svg).attr(
                'viewBox',
                `${x} ${y}, ${w}, ${h}`
            )
    }

    _translate(tx, ty, tw, th) {
        var [
            vx, vy, vw, vh
        ] = $(this.svg).attr('viewBox').split(' ').map(parseFloat)

        // number of animation steps
        var steps = 100;
        // how far through the requsted transition should we go (2 => 1/2)
        var completionFactor = 2;

        var dx, dy, dw, dh, dt;
        dx = (tx - vx) / steps;
        dy = (ty - vy) / steps;
        dw = (tw - vw) / steps;
        dh = (th - vh) / steps;
        dt = this.mainLoopStep / steps

        var t = -dt;
        for (let i=0; i<steps/completionFactor; i++) {
            vx += dx
            vy += dy
            vw += dw
            vh += dh
            t += dt * completionFactor

            setTimeout(
                this._setViewBox.bind(this, vx, vy, vw, vh),
                t
            );
        }
    }

    _follow(scaleFactor) {
        if (! scaleFactor) {
            scaleFactor = 2.5
        }

        // get transform of containing graph
        var transform = $($(this.svg).find('#graph0')[0]).attr('transform')
        var [xtran, ytran] = transform
            .match(/translate\(([^\)]+)\)/)[1]
                .split(' ')
                    .map(parseFloat)
        var [xscale, yscale] = transform
            .match(/scale\(([^\)]+)\)/)[1]
                .split(' ')
                    .map(parseFloat)

        let [left, right, ttop, bottom] = this._getActiveBBox(
            [this.running]
        );

        // apply transformation to coordinates
        left = xtran + (left * xscale);
        right = xtran + (right * xscale);
        ttop = ytran + (ttop * yscale);
        bottom = ytran + (bottom * yscale);
        var width = right - left;
        var height = bottom - ttop;

        // scale out view
        left = left - (width / scaleFactor);
        ttop = ttop - (height / scaleFactor);
        width = scaleFactor * width;
        height = scaleFactor * height;

        // focus on this bbox
        this._translate(left, ttop, width, height);
    }

    _main_loop(itt) {
        /*
         * The main loop - runs the simulation and handles restyling of nodes.
         * Note function calls itself recursively.
         */
        console.log('MAIN LOOP')
        var exit = false;

        // Action.
        if (this._advance()) {  // Advance the task pool.
            // If anything has changed restyle.
            this._style();
            if(this.follow) { this._follow() }
        } else {
            // If nothing has changed...
            if (this.waiting.size == 0 && this.running.size == 0) {
                // The simulation has ended, reset and restart.
                this._init();
            } else {
                // The worklfow stalled, log a console message and do nothing.
                exit = true;
                console.log('Workflow stalled :(');
            }
        }

        // Callback.
        if (!exit) {
            var self_ref = this;
            setTimeout(function(){
               self_ref._main_loop(itt + 1);
            }, this.mainLoopStep);
        }
    }

    run() {
        /*
         * Run this simulation.
         */
        this._init();
        this._main_loop(0);
    }

}

const ic = /(\w+)\[-P(\d+)\]/

export default {
  props: {
    width: {
      type: String,
      default: "50%",
    },
    height: {
      type: String,
      default: "auto",
    },
    graph: {
      type: String,
      required: true,
    },
    cycles: {
      type: Number,
      required: true,
    },
    svg: {
      type: String,
      required: true,
    },
    follow: {
      type: Boolean,
      default: false,
    },
    stepTime: {
      type: Number,
      default: 5000,
    },
  },


  data () {
    return {
      deps: null,
      minicylc: null,
    }
  },


  mounted () {
    this.deps = this.write_deps()
    this.minicylc = this.create()
    this.go_go_go(this.minicylc)
  },

  methods: {
    // write_deps() {
    //   // write dependencies
    //   const deps = []
    //   for (let cycle=0; cycle<this.cycles; cycle++) {
    //     for (const line of this.graph.split('\\n')) {
    //       let parts = line.split('=>')
    //         .map(x => x.trim())
    //         .map(x => {
    //           const match = ic.exec(x)
    //           if (!match) {
    //             return `${x}_${cycle}`
    //           }
    //           return `${match[1]}_${cycle - Number(match[2])}`
    //         })
    //         .reduce((x ,y) => `${x} => ${y}`)
    //       deps.push(...parts)
    //     }
    //   }
    //   console.log('# DEPS', [...deps])
    //   return deps
    // },

    write_deps() {
      function mapper(parts) {
        const ret = []
        for (let ind in parts) {
          if (ind == 0) { continue }
          ret.push([parts[ind - 1], parts[ind]])
        }
        return ret
      }
      
      let deps = this.graph.split('\\n')
        // remove whitespace and blank lines
        .map(x => x.trim())
        .filter(x => x)
        // split dependencies
        .map(x => x.split('=>'))
        // remove whitespace from depencies
        .map(x => x.map(y => y.trim()))
        // group deps as [left, right] pairs
        .map(x => mapper(x))
        // flatten
        .reduce((r, x) => {
          r.push(...x)
          return r
        })

      if (this.cycles > 0) {
        // inter-cycle
        deps = deps
          .map((x, _x) => {
            // console.log('#', l, r)
            let [l, r] = x
            const match = ic.exec(l)
            const ret = []
            for (let cycle=1; cycle<this.cycles + 1; cycle++) {
              let r_cycle = `${r}_${cycle}`
              if (!match) {
                ret.push([`${l}_${cycle}`, r_cycle])
              } else {
                let tgt_cycle = cycle - Number(match[2])
                if (tgt_cycle > 0) {
                  ret.push([`${match[1]}_${tgt_cycle}`, r_cycle])
                }
              }
            }
            return ret
          })
          // flatten
          .reduce((r, x) => {
            r.push(...x)
            return r
          })
      }

      console.log('# DEPS', [...deps])
      return deps
    },

    create () {
      // create minicylc impl component
      // const infininte_animation = $('<object />')
      const infininte_animation = $(this.$refs.object)
        .addClass('minicylc flexgrow')
        .data('follow', this.follow)
        .data('theme', 'default')
        .data('randomFactor', 0.5)
        .data('stepTime', this.stepTime)
        .data('dependencies', this.deps.join('//'))
        //.attr('src', this.svg)[0]
        .attr('data', this.svg)[0]
      // $('#infinite-cycling').append(infininte_animation)
      return infininte_animation
    },

    go_go_go (infininte_animation) {
      infininte_animation.onload = function() {
        console.log('#', infininte_animation)
        const infinite_workflow = new MiniCylc(infininte_animation);

        // infinite_workflow.run()

        // infinite_workflow.hold()
        // infinite_workflow.run()

        // // unhold when on slide
        // addClassNameListener(
        //   $('#infinite-cycling')[0],
        //   'active',
        //   infinite_workflow.release.bind(infinite_workflow),
        //   infinite_workflow.hold.bind(infinite_workflow)
        // )
      }
      return
    },
  }

}
</script>
