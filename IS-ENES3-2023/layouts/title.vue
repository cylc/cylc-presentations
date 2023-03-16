<template>
    <div
      class="slidev-layout cover ctitle"
      :style="style"
    >
    <h2 class="ccc">
      <span class="ch2"><slot /></span>
      <span class="cone"><slot name="one" /></span>
      <span class="ctwo"><slot name="two" /></span>
      <span class="cthree"><slot name="three" /></span>
      <span class="cfour"><slot name="four" /></span>
    </h2>
  </div>
</template>

<script>
// import { computed } from 'vue'
// 
// const props = defineProps({
//   background: {
//     type: String,
//     default: 'rgb(50, 50, 50)'
//   }
// })
// 
// const style = computed(() => {
//   if (props.image) {
//     return `background-image: url(${props.image});`
//   }
//   return 'background: rgb(50, 50, 50);'
// })
export default {
  props: {
    image: {
      type: String,
      required: false,
    },
    logo: {
      type: String,
      required: false,
    }
  },
  computed: {
    style () {
      if (this.image && this.logo) {
        return `
          background-image: url(${this.logo}), url(${this.image});
          background-size: 25%, cover;
          background-position: 5% 90%, top left;
          background-repeat: no-repeat, no-repeat;
        `
      }
      else if (this.image) {
        return `background-image: url(${this.image}); background-size: cover;`
      }
      return 'background: rgb(50, 50, 50);'
    },
  },
}
</script>

<style>
.ccc {
  margin: 0;
  position: absolute;
  top: 45%;
  left: 7%;
  color: rgb(220, 220, 220);
}
.ch2 {
  display: inline-block;
  padding-right: 0.5em;
}
.cone {
  color: #f75f5fff;
  padding-right: 0.2em;
  display: inline-block;
}
.ctwo {
  color: #f0c84bff;
  padding-right: 0.2em;
  display: inline-block;
}
.cthree {
  color: #64c77eff;
  padding-right: 0.2em;
  display: inline-block;
}
.cfour {
  color: #55c3e5ff;
  display: inline-block;
}
</style>
