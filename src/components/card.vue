<template>
<v-container>
    <v-row>
        <v-col>
            <v-img
              src=""
            ></v-img>
        </v-col>
    </v-row>
    </v-container>    
</template>

<script>
export default {
    data: () => ({
      playload: null
    }),
    mounted () {
      axios
        .get('https://api.scryfall.com')
        .then(
          response => (
            this.payload = response
          )
        )
    }
}
</script>