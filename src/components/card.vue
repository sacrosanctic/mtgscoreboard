<template>
<v-container>
    <v-row>
        <v-col>
            <v-img
              :height="height"
              :src="img"
              contain
            ></v-img>
        </v-col>
    </v-row>
    </v-container>    
</template>

<script>

export default {
    data: () => ({
      img: ''
    }),
    props: {
      cardname: String,
      height: String,
    },
    mounted () {
      this.$axios.get("https://api.scryfall.com/cards/named?exact=" + encodeURI(this.cardname))
        .then(
          response => {
            this.img = response.data.image_uris.large
        })
        .catch(error => {
          error
        })
        .finally(()=>{})
    }
}
</script>