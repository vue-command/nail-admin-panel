<template>
  <div>
    <p>{{ label }}</p>
    <div
      v-for="(textField, i) in localValue"
      :key="i"
      class="d-flex input-container"
    >
    <v-row>
      <v-col cols="8">
      <TextInput
        label="Date"
        :value.sync="localValue[i].date"
        :limit="35"
        :required="true"
        
      />
      </v-col>
      <v-col cols="4">
      <NumberInput
        label="Available of spots"
        :value.sync="localValue[i].availableSpots"
        :limit="3"
        :required="true"
      />
      </v-col>
    </v-row>
      <v-btn @click="removeField(i)" v-if="localValue.length > 1" class="remove">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
    <div v-if="localValue.length < 5" class="d-flex justify-end mb-8">
      <v-btn @click="addField">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import TextInput from '@/components/inputs/TextInput.vue';
import NumberInput from '@/components/inputs/NumberInput.vue';

export default {
  name: 'DateCourseInputs',
  props: {
    value: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
  },
  components: {
    TextInput,
    NumberInput,
  },
  data() {
    return {};
  },
  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update:value', val);
      },
    },
  },
  watch: {
  },
  methods: {
    addField() {
      this.localValue.push({
        date: '',
        availableSpots: '',
      });
    },
    removeField(index) {
      this.localValue.splice(index, 1);
    },
  },
};
</script>

<style>
</style>
