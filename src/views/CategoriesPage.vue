<template>
  <v-container style="max-width: 960px">
    <v-row class="pa-5">
      <v-col cols="12" class="pa-5">
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              class="text-subtitle-1"
              outlined
              :value="selectedCategoryId"
              :items="categories"
              item-text="name"
              item-value="_id"
              label="Category"
              @change="selectCategory"
            >
              Choose category
            </v-select>
          </v-col>
          <v-col cols="12" md="6" class="text-right">
            <v-btn @click="open = true" class="mt-4">
              ADD NEW SUBCATEGORY
              <v-icon>$plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <AddSubcategory v-if="open" :open.sync="open" :activeCategory="activeCategory" />

        <confirmDelete :dialog.sync="showDialog" :title="title" :confirmDelete="deleteSubcategoryHandler" />

        <ErrorPopup :dialog.sync="cantBeDeleted" :title="title" :confirmDelete="() => cantBeDeleted = false"/>
        <v-row>
          <v-col cols="12">
            <v-card v-if="!data.length" class="py-4 px-6">
              <p class="text-subtitle-1 text-center mb-0">No subcategories here yet</p>
            </v-card>
            <v-card v-else class="pt-4 pb-6 px-6">
              <v-simple-table>
                <tbody>
                  <tr v-for="subcategory in data" :key="subcategory._id">
                    <td class="d-flex justify-between px-0">
                      <v-text-field
                        class="text-subtitle-1"
                        v-model="subcategory.name"
                        :disabled="subcategory._id !== onchangeId"
                      />
                      <v-btn
                        v-if="subcategory._id === onchangeId"
                        icon
                        class="mt-2"
                        @click="changeSubcategoryName(subcategory.name)"
                      >
                        <v-icon>$done</v-icon>
                      </v-btn>
                      <v-btn
                        v-else
                        icon
                        class="mt-2"
                        :disabled="disabledBtn(subcategory._id)"
                        @click="edit(subcategory._id)"
                      >
                        <v-icon>$edit</v-icon>
                      </v-btn>
                      <v-btn
                        v-if="subcategory._id === onchangeId"
                        icon
                        class="mt-2"
                        @click="cancelChangeSubcategoryName(subcategory._id)"
                      >
                        <v-icon>$cancel</v-icon>
                      </v-btn>
                      <v-btn
                        v-else
                        icon
                        class="mt-2"
                        :disabled="disabledBtn(subcategory._id)"
                        @click="removeSubcat(subcategory._id)"
                      >
                        <v-icon>$delete</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'categories',
  components: {
    AddSubcategory: () => import('@/components/inputs/AddSubcategory.vue'),
    confirmDelete: () => import('@/components/popups/confirmDelete.vue'),
    ErrorPopup: () => import('@/components/popups/errorDialog.vue'),
  },
  data() {
    return {
      data: [],
      open: false,
      showDialog: false,
      title: 'subcategory',
      onchangeId: '',
      deleteId: '',
      cantBeDeleted: false
      // newSubcategoryName: '',
    };
  },
  computed: {
    ...mapState('categories', ['isPageLoading', 'categories', 'activeCategory']),
    selectedCategoryId() {
      if (!this.activeCategory) return '';
      return this.activeCategory._id;
    },
  },
  watch: {
    activeCategory: {
      deep: true,
      handler(val) {
        if (!val) return;
        this.fillingData();
      },
    },
  },
  methods: {
    disabledBtn(id) {
      if (!this.onchangeId) return false;
      return id !== this.onchangeId;
    },
    async selectCategory(categoryId) {
      await this.$store.dispatch('categories/SET_CATEGORY', {
        categoryId,
      });
      this.fillingData();
    },
    removeSubcat(id) {
      const test = this.data.find(el => el._id === id)
      if (test && test.amountOfProduct > 0) {
        this.cantBeDeleted = true;
        return
      }
      this.deleteId = id;
      this.showDialog = true;
    },
    edit(id) {
      this.onchangeId = id;
    },
    async changeSubcategoryName(name) {
      const newName = name.trim();
      if (!newName) return;
      const oldName = this.activeCategory.subcategories.find(item => item._id === this.selectedCategoryId)?.name;
      if (oldName === newName) return;
      await this.$store.dispatch('categories/CHANGE_SUBCATOGORY_NAME', { id: this.onchangeId, name: newName });
      this.onchangeId = '';
    },
    async deleteSubcategoryHandler() {
      await this.$store.dispatch('categories/DELETE_SUBCATOGORY', { id: this.deleteId });
      this.showDialog = false;
    },
    cancelChangeSubcategoryName(id) {
      const obj1 = this.activeCategory.subcategories.find(elem => elem._id === id);
      const obj2 = this.data.find(elem => elem._id === id);
      Object.assign(obj2, obj1);
      this.onchangeId = '';
    },
    fillingData() {
      if (!this.selectedCategoryId) return;
      this.data = this.activeCategory.subcategories.map(item => Object.assign({}, item));
    },
  },
  mounted() {
    this.fillingData();
  },
};
</script>

<style></style>
