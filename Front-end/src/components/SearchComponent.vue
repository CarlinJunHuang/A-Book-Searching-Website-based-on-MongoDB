<template>
  <div class="search-component">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="搜索书籍的标题或作者"
    />
    <button @click="onSearch">Search</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
    };
  },
  methods: {
    onSearch() {
      this.$emit('search', this.searchQuery);
    },
  },
};
</script>

<style scoped>
.search-component {
  display: flex;
  align-items: center;
}

.search-component input {
  width: 100%;
  padding: 20px;
  margin-right: 10px;
  margin-left: 300px;
  box-sizing: border-box;
}

.search-component button {
  padding: 20px 50px;
  margin-right: 300px;
}
</style>
