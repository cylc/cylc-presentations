<template class="cpoint">
  <div class="cpoints">
    <div class="cpointss">
      <slot />
    </div>
  </div>
</template>

<style>
.cpoints {
  display: flex;
  align-items: center;
  justify-items: center;
}

.cpointss {
  padding-left: 5em;
  width: auto;
  height: auto;
}

.cpointss ul {
  font-size: 1.5em;
  list-style-type: none!important;
  line-height: 180%;
}

.cpointss ul li > :first-child {
  margin-right: 0.65em;
}

.cpointss ul > li > ul {
  font-size: 1em;
}
</style>
