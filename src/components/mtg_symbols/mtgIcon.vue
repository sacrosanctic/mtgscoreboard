<template>
  <svg
    xmlns="http://www.w3.org/2000/svg" 
    versions="1.1"
    :width="width" 
    :height="height" 
    viewBox="0 0 600 600"
    :aria-labelledby="icon.name"
    role="presentation"
  >
    <title :id="icon.name" lang="en">{{icon.name}}</title>
    <g v-html="icon.svg"></g>
  </svg>
</template>

<script>
import { default as iconSet } from './mtgIcon.js'

/*reference
https://jannerantala.com/tutorials/vue-replace-text-with-component-with-props/
*/

export default {
  data: () => ({
    icon: {}
  }),
  computed: {
  },
  props: {
    iconName: {
      type: String,
      default: 'mtg symbol'
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    iconColor: {
      type: String,
      default: 'currentColor'
    },
    circle: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // getIcon() {
    //   let iconName = ''
    //   if(this.$slots.default) iconName = this.$slots.default[0].text.trim()
    //   console.log(iconSet[iconName])

    //   return iconSet[iconName]
    // }
  },
  mounted() {
    let iconName = ''
    if(this.$slots.default) iconName = this.$slots.default[0].text.trim()
    this.icon = iconSet[iconName]
  }
}
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: baseline;
  margin-bottom: -2px; /* yes, I'm that particular about formatting */
}
</style>