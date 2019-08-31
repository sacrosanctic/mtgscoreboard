<template>
<v-container>
    <v-row>
        <v-col>
            <v-img
              :src="img"
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
      carduri: String,
    },
    mounted () {
      this.$axios.get(this.carduri)
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