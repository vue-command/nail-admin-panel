<template>
  <v-dialog v-model="localDialog" max-width="480px" class="pa-4">
    <v-card flat>
      <v-toolbar dark dense color="error">
        <v-icon class="mr-4"> $delete </v-icon>
        <v-toolbar-title> Delete </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('update:dialog', false)">
          <v-icon large> $close </v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="text-center mt-10">
        <h4>This subcategory can't be deleted, because it has commodities</h4>
      </v-card-text>
    </v-card>
    <v-card-actions class="homefone">
      <v-spacer></v-spacer>
      <v-btn color="error" text large @click="confirmDelete">OK</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-dialog>
</template>

<script>
export default {
  name: 'confirmDelete',
  props: ['dialog', 'confirmDelete', 'title'],
  computed: {
    localDialog: {
      get() {
        return this.dialog
      },
      set(val) {
        this.$emit('update:dialog', val)
      }
    }
  },
  methods: {},
};
</script>
