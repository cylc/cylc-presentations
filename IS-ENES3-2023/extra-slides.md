
<!-- paste this into the end of slides.md for presentations -->

---

```jinja2
#!Jinja2

{% set initial_point = 'previous(T00)' %}  # this morning at 00:00

[scheduling]
    initial cycle point = {{ initial_point }}
    [[graph]]
        PT6H = """  # every six hours
            foo => bar =>
{% if mode == 'production' %}
            # this bit of the graph only runs in production mode
            baz =>
{% endif %}
            pub
        """

# this loads the relevant include file
{% include 'config/' + mode + '.cylc' %}
```

---

<img width="650" src="/img/gui-arch-multi-user.svg" />
