<template>
  <v-navigation-drawer v-model="localDrawer" absolute temporary>
    <v-list nav dense>
      <v-list-item-group v-model="group" active-class="red--text text--accent-4">
        <v-list-item @click="goTo('Home')">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item @click="goTo('offline-courses')">
          <v-list-item-icon>
            <v-icon>$offlineCourse</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Offline courses</v-list-item-title>
        </v-list-item>
        <v-list-item @click="goTo('online-courses')">
          <v-list-item-icon>
            <v-icon>$onlineCourse</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Online courses</v-list-item-title>
        </v-list-item>
        <v-list-item @click="goTo('shop')">
          <v-list-item-icon>
            <v-icon>$shop</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Shop</v-list-item-title>
        </v-list-item>
        <v-list-item @click="goTo('categories')">
          <v-list-item-icon>
            <v-icon>$shopCategories</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Shop categories</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    drawer:{
      type: Boolean,
      required: true
    }
  },
  data() {
    return{
      group: null,
    }
  },
  computed:{
    localDrawer: {
      get(){
        return this.drawer
      },
      set(val){
        this.$emit('update:drawer', val)
      }
    }
  },
   watch: {
    group() {
      this.localDrawer = false;
    },
  },
  methods:{
    goTo(name) {
      if (this.$route.name !== name) this.$router.push({ name });
    },
  }

}
</script>

<style>
</style>