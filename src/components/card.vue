<template>
  <v-img
    style="max-height:100%"
    class="white--text"
    :src="img"
  ><slot /></v-img>
</template>

<script>
export default {
  data: () => ({
    img: ''
  }),
  props: {
    cardName: String,
  },
  watch: {
    cardName() {
      this.getArt()
    }
  },
  methods: {
    getArt() {
    this.$axios.get("https://api.scryfall.com/cards/named?exact=" + encodeURI(this.cardName))
      .then(
        response => {
          this.img = response.data.image_uris.art_crop
          // this.img = response.data.image_uris.large
      })
    }
  },
  mounted () {
    this.getArt()
  }
}
</script>