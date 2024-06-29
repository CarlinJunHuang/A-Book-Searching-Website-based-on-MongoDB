<template>
	<div id="app">
		<SearchComponent @search="handleSearch" />
		<BookListComponent :books="books" @show-details="showDetails" />
		<BookDetailComponent :book="selectedBook" :show="showModal" @close="closeModal" />
		<button class="page-button" @click="changePage(-1)">上一页</button>
		<button class="page-button" @click="changePage(1)">下一页</button>
	</div>
</template>

<script>
	import SearchComponent from './components/SearchComponent.vue';
	import BookListComponent from './components/BookListComponent.vue';
	import BookDetailComponent from './components/BookDetailComponent.vue';
	import axios from 'axios';
	import {
		ref
	} from 'vue';

	export default {
		name: 'App',
		setup() {
			const currentPage = ref(1);
			const itemsPerPage = ref(30); // 假设每页30项
			const lastSearchQuery = ref(''); // 储存最后的搜索词
			const books = ref([{
				asin: "B00TZE87S4",
				title: "Adult Children of Emotionally Immature Parents",
				author: "Lindsay C. Gibson",
				stars: 4.8,
				reviews: 0,
				price: 9.99,
				isBestSeller: true,
				category_name: "Parenting & Relationships",
				showModal: false,
				selectedBook: null
			}, ]);

			const changePage = (step) => {
				currentPage.value += step;
				handleSearch(lastSearchQuery.value, false);
			
				// 滚动到页面顶部
				window.scrollTo(0, 0);
			};

			const showModal = ref(false);
			const selectedBook = ref(null);

			const showDetails = (book) => {
				selectedBook.value = book;
				showModal.value = true;
			};

			const closeModal = () => {
				showModal.value = false;
			};

			const handleSearch = async (query, resetPage = true) => {
				try {
					if (resetPage) {
						currentPage.value = 1; // 仅在新搜索时重置页码
					}
					const response = await fetch(
						`http://localhost:3001/search?query=${query}&page=${currentPage.value}&limit=${itemsPerPage.value}`
					);
					if (!response.ok) {
						throw new Error('网络响应错误');
					}
					const data = await response.json();
					books.value = data; // 存储在 `books` 数组中
					lastSearchQuery.value = query;
				} catch (error) {
					console.error('搜索错误:', error);
				}
			};

			return {
				books,
				currentPage,
				itemsPerPage,
				lastSearchQuery,
				changePage,
				handleSearch,
				showModal,
				selectedBook,
				showDetails,
				closeModal,
			};
		},
		components: {
			SearchComponent,
			BookListComponent,
			BookDetailComponent,
		},
		data() {
			return {
				// books: [{
				// 		asin: "B00TZE87S4",
				// 		title: "Adult Children of Emotionally Immature Parents",
				// 		author: "Lindsay C. Gibson",
				// 		stars: 4.8,
				// 		reviews: 0,
				// 		price: 9.99,
				// 		isBestSeller: true,
				// 		category_name: "Parenting & Relationships",
				// 		showModal: false,
				// 		selectedBook: null
				// 	},
				// 	{
				// 		asin: "B08WCKY8MB",
				// 		title: "From Strength to Strength",
				// 		author: "Arthur C. Brooks",
				// 		stars: 4.4,
				// 		reviews: 0,
				// 		price: 16.99,
				// 		isBestSeller: false,
				// 		category_name: "Parenting & Relationships",
				// 		showModal: false,
				// 		selectedBook: null
				// 	},
				// 	{
				// 		asin: "B09KPS84CJ",
				// 		title: "Good Inside: A Guide to Becoming the Parent You Want to Be",
				// 		author: "Becky Kennedy",
				// 		stars: 4.8,
				// 		reviews: 0,
				// 		price: 16.99,
				// 		isBestSeller: false,
				// 		category_name: "Parenting & Relationships",
				// 		showModal: false,
				// 		selectedBook: null
				// 	}
				// ],
			};
		},
		methods: {


			// showDetails(book) {
			// 	// console.log('Showing details for:', book);
			// 	this.selectedBook = book;
			// 	this.showModal = true;
			// 	console.log('Showing details for:', this.selectedBook);
			// 	console.log('Showing modal:', this.showModal);
			// },
			// closeModal() {
			// 	this.showModal = false;
			// 	this.selectedBook = null;
			// },
		},
	};
</script>


<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}

	.page-button {
		padding: 10px 20px;
		margin: 10px;
		margin-top: 20px;
		background-color: #f0f0f0;
		border: 1px solid #ddd;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.page-button:hover {
		background-color: #e0e0e0;
	}
</style>