<template>
  <v-container>
    <v-row>
      <v-col>
        <v-row class="justify-end">
          <v-btn class="ma-2" color="red darken-2" dark @click="goBack()">
            <v-icon dark left>mdi-close</v-icon>Close
          </v-btn>
        </v-row>
      </v-col>
    </v-row>

    <v-card class="base-card pa-10">
      <v-col cols="12">
        <v-row class="text-center">
          <v-col cols="12">
            <h1>{{ productId === 'new' ? 'NEW' : 'MODIFY' }} PRODUCT</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="12" sm="6">
                <v-form ref="form" v-model="valid">
                  <v-row>
                    <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                      <v-select
                        :items="categories"
                        outlined
                        :rules="[rules.required]"
                        item-text="name"
                        item-value="_id"
                        label="Category"
                        v-model="category"
                      >Choose category</v-select>
                      <v-select
                        v-if="category"
                        :items="categories ? [{_id: '', name: 'All'}, ...categories.find(e => e._id === category).subcategories] : []"
                        outlined
                        item-text="name"
                        item-value="_id"
                        label="Subcategory"
                        v-model="subCategoryId"
                      >Choose subcategory</v-select>
                      <v-textarea
                        v-model="speciﬁcations"
                        :rules="[rules.required]"
                        label="Speciﬁcation"
                        outlined
                      ></v-textarea>
                      <v-col cols="6">
                        <v-text-field
                          v-model="price"
                          :rules="[rules.required]"
                          label="Price"
                          type="number"
                          min="0"
                          outlined
                        ></v-text-field>
                      </v-col>
                    </v-col>

                    <v-col cols="12" xl="6" md="6" lg="6" sm="12">
                      <v-text-field
                        v-model="brand"
                        :rules="[rules.required]"
                        label="Brand"
                        outlined
                      ></v-text-field>
                      <v-text-field v-model="name" :rules="[rules.required]" label="Name" outlined></v-text-field>
                      <v-text-field
                        v-model="codeOfProduct"
                        :rules="[rules.required]"
                        label="Code"
                        outlined
                      ></v-text-field>
                      <v-file-input
                        v-model="previewFile"
                        accept="image/*"
                        color="deep-purple accent-4"
                        label="Cover picture"
                        placeholder="Select your file"
                        prepend-icon="mdi-paperclip"
                        outlined
                        :show-size="1000"
                        :clearable="false"
                      ></v-file-input>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-btn color="success" @click="submitHandler" :disabled="isSaveDisabled">Save</v-btn>
                      <v-btn v-if="currentProduct" @click="cancelHandler">Cancel</v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
              <v-col cols="12" sm="6">
                <v-row justify="center">
                  <ShopCard
                    :image="previewImageLink"
                    :name="name || 'Name'"
                    :brand="brand || 'Brand'"
                    :price="price"
                  />
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-row>
            <v-col>
              <v-card outlined>
                <v-col>
                  <h3>PAGE IMAGES</h3>
                  <v-row>
                    <v-card v-for="(image, index) in images" :key="index" class="pa-5 ma-5">
                      <v-img :src="image.link" height="200" width="200" contain></v-img>
                      <v-btn color="error" @click="deleteImageHandler(image, index)">DELETE</v-btn>
                    </v-card>
                  </v-row>
                  <v-row justify="center">
                    <v-btn
                      color="success"
                      @click="$refs.inputUpload.click()"
                      :disabled="!currentProduct"
                      class="my-10"
                    >Upload images</v-btn>
                    <input
                      v-show="false"
                      ref="inputUpload"
                      accept="image/*"
                      type="file"
                      @change="previewFilesHandler"
                      multiple
                    />
                  </v-row>
                </v-col>
              </v-card>
            </v-col>
          </v-row>

          <v-col cols="12">
            <v-row justify="space-around">
              <v-btn
                color="buttons"
                outlined
                large
                min-width="90"
                class="yellow-button mt-4"
                @click="publishHandler"
                :disabled="!currentProduct"
              >
                {{
                this.isPublished ? 'Hide commodity' : 'Publish commodity'
                }}
              </v-btn>
              <v-btn
                color="error"
                large
                min-width="90"
                class="mt-4"
                @click="showDialog = true"
                :disabled="!currentProduct"
              >DELETE COMMODITY</v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-row>
        <v-col cols="12">
          <v-row justify="start" class="description">
            <v-col cols="1" sm="1" md="1" xl="2" lg="2"></v-col>
            <v-col cols="12" sm="6" md="4" xl="4" lg="4" xs="12" class="px-0">
              <v-row class="image-row">
                <v-img :src="activeCard" max-width="100%" max-height="400px" contain></v-img>
              </v-row>
              <v-row class="justify-center">
                <v-slide-group
                  :model="activeCard"
                  class="px-0 justify-center"
                  center-active
                  mandatory
                >
                  <v-slide-item
                    v-for="img in images"
                    :key="img._id"
                    v-slot:default="{ active, toggle }"
                  >
                    <v-img
                      @click="setPhoto(img, toggle)"
                      :src="img.link"
                      width="60px"
                      height="60px"
                      contain
                      active
                      :class="[
                        active ? 'card-active' : 'card-disabled',
                        'mx-2',
                      ]"
                    ></v-img>
                  </v-slide-item>
                </v-slide-group>
              </v-row>
            </v-col>

            <v-col cols="2" md="0"></v-col>
            <v-col cols="12" sm="12" md="5" xl="4" lg="4" class="px-0">
              <v-col cols="12" class="gray-font px-0 text-start">
                <h2 class="dark-gray-font">{{ name || 'Name' }}</h2>
                <h4>{{ brand }}</h4>
                <div class="caption">
                  <h2 class="speciﬁcations">{{ speciﬁcations.trim() || 'Specification' }}</h2>
                </div>
                <div class="price">
                  <h3 class="dark-gray-font">{{ price }} AUD</h3>
                  <div class="shop-buttons">
                    <v-btn tile small width="100%" class="add" color="#FFC44A">Add to card</v-btn>
                    <v-btn tile small width="100%" class="buy" color="#333333">Buy it now</v-btn>
                  </div>
                </div>
              </v-col>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-dialog v-model="showDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="showDialog = false">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="deleteCommodityHandler">YES</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>


<script>
import "nails-shop-card";
import "nails-shop-card/dist/nails-shop-card.css";
import { mapState } from "vuex";

const noImage = require("./assets/noImage.jpg");

export default {
  name: "ModifyProduct",
  props: [
    "createCommodity",
    "Handler",
    "uploadImages",
    "deleteImage",
    "createCategory",
    "updateCommodity",
    "getDataMain",
    "deleteCommodity",
    "noImage"
  ],
  data() {
    return {
      showDialog: false,
      valid: true,
      category: "",
      subCategoryId: "",
      brand: "",
      name: "",
      codeOfProduct: "",
      speciﬁcations: "",
      isPublished: false,
      price: 0,
      photos: [],
      currentProduct: null,
      rules: {
        required: v => !!v || "input is required"
      },
      images: [],
      previewFile: null,
      previewImageLink: noImage,
      activeCard: noImage,
      productId: this.$route.params.commodityId
    };
  },
  watch: {
    previewFile(newVal) {
      if (newVal) {
        this.previewImageLink = URL.createObjectURL(newVal);
      }
    },
    commodity(newVal) {
      this.category = newVal.categoryId;
      this.subCategoryId = newVal.subCategoryId;
      this.brand = newVal.brand;
      this.name = newVal.name;
      this.speciﬁcations = newVal.speciﬁcations;
      this.codeOfProduct = newVal.codeOfProduct;
      this.price = newVal.price;
      this.images = newVal.images;
      this.isPublished = newVal.isPublished;
      this.previewImageLink = newVal.previewImage[0].link;
      this.previewImage = newVal.previewImage;
      this.activeCard = (newVal.images[0] && newVal.images[0].link) || noImage;
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async publishHandler() {
      try {
        const commodityToUpdate = this.currentProduct;
        delete commodityToUpdate.images;
        const updatedCommodity = await this.updateCommodity(this.productId, {
          ...commodityToUpdate,
          isPublished: !this.isPublished
        });
        if (updatedCommodity) {
          this.currentProduct = updatedCommodity;
          this.getDataMain();
        }
      } catch (e) {
        this.$notify({
          group: "foo",
          text: "Publishing error"
        });
      }
    },
    async getData() {
      if (!this.categories)
        await this.$store.dispatch("shop/GET_SHOP_CATEGORIES");
    },
    async getCommodity(id) {
      this.$store.dispatch("shop/GET_COMMODITY", {
        commodityId: id
      });
    },
    setPhoto(val, toggle) {
      toggle();
      this.activeCard = val.link;
    },
    async submitHandler() {
      const data = {
        categoryId: this.category,
        name: this.name,
        speciﬁcations: this.speciﬁcations,
        price: Number(this.price).toFixed(2),
        codeOfProduct: this.codeOfProduct,
        brand: this.brand,
        isPublished: this.isPublished
      };
      if (this.subCategoryId) {
        data.subCategoryId = this.subCategoryId;
      }
      if (!this.isEditMode) {
        data.previewFile = this.previewFile;

        const createdCommodity = await this.$store.dispatch(
          "shop/CREATE_COMMODITY",
          { data }
        );
        if (createdCommodity) {
          this.currentProduct = createdCommodity;
        }
      } else {
        if (this.previewFile) {
          data.previewFile = this.previewFile;
        } else {
          data.previewImage = this.previewImage;
        }
        const updatedCommodity = await this.$store.dispatch(
          "shop/UPDATE_COMMODITY",
          { data, id: this.productId }
        );
        if (updatedCommodity.success) {
          this.$notify({
            group: "foo",
            title: "Commodity updated"
          });
        } else {
          this.$notify({
            group: "foo",
            title: updatedCommodity.error || "Something went wrong",
            type: "error"
          });
        }
      }
    },
    cancelHandler() {
      this.previewFile = null;
      if (!this.commodity) return;
      this.category = this.commodity.categoryId;
      this.subCategoryId = this.commodity.subCategoryId;
      this.brand = this.commodity.brand;
      this.name = this.commodity.name;
      this.speciﬁcations = this.commodity.speciﬁcations;
      this.codeOfProduct = this.commodity.codeOfProduct;
      this.price = this.commodity.price;
      this.images = this.commodity.images;
      this.previewImageLink = this.commodity.previewImage[0].link;
      this.previewImage = this.commodity.previewImage;
      this.isPublished = this.commodity.isPublished;
      this.activeCard =
        (this.commodity.images[0] && this.commodity.images[0].link) || noImage;
    },
    async previewFilesHandler(e) {
      const updatedCommodity = await this.uploadImages(
        this.productId,
        e.target.files
      );
      if (updatedCommodity) {
        this.currentProduct = updatedCommodity;
      }
    },
    async deleteImageHandler(img) {
      const isDeleted = await this.deleteImage(img._id);
      if (isDeleted) {
        this.images = this.images.filter(el => el._id !== img._id);
      }
    },
    async deleteCommodityHandler() {
      const isDeleted = await this.deleteCommodity(this.productId);
      if (isDeleted) {
        this.getDataMain();
        this.clearHandler();
      }
    }
  },
  computed: {
    ...mapState("shop", [
      "fullListOfCategories",
      "commodity",
      "totalCommodities",
      "categories"
    ]),
    isEditMode() {
      return this.productId !== "new";
    },
    isSaveDisabled() {
      let isDisabled = true;
      if (this.isEditMode) isDisabled = Boolean(!this.valid);
      else {
        if (this.valid) {
          isDisabled = !this.previewFile;
        }
      }
      return isDisabled;
    }
  },
  created() {
    this.getData();
    if (this.isEditMode) {
      this.getCommodity(this.productId);
    }
    window.onbeforeunload = () => "Are you sure you want to leave?";
  },
  beforeDestroy() {
    this.$store.commit("shop/CLEAR_COMMODITY");
    window.onbeforeunload = () => null;
  }
};
</script>

<style>
.card-active {
  opacity: 1;
}
.image-row {
  height: 430px;
}
.card-disabled {
  cursor: pointer;
  opacity: 0.4;
}
.viewed-block {
  justify-content: space-around;
}
.speciﬁcations {
  white-space: pre;
}
.caption {
  margin-top: 50px;
}
.caption > h2 {
  margin-top: 5px;
}
.shop-buttons {
  width: 100px;
  display: flex;
  flex-direction: column;
}
.add {
  color: #333333 !important;
  margin: 4px 0;
}
.buy {
  color: white !important;
  margin: 4px 0;
}
.price {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
}
.price > h3 {
  margin: 25px 0;
}
.dark-gray-font {
  color: #333333;
}
.gray-font {
  color: #808080;
}
.description {
  padding-top: 25px;
}
@media screen and (max-width: 320px) {
  .caption > h2 {
    font-size: 14px;
  }
}
</style>
