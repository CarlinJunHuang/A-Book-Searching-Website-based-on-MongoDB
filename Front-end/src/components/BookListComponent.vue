<template>
	<div class="book-list">
		<table>
			<thead>
				<tr>
					<th>
						标题
						<button @click="sortBooks('title')">排序</button>
					</th>
					<th>
						作者
						<button @click="sortBooks('author')">排序</button>
					</th>
					<th>
						价格
						<button @click="sortBooks('price')">排序</button>
					</th>
					<th>
						评分
						<button @click="sortBooks('stars')">排序</button>
					</th>
					<th>
						详情
					</th>
					<!-- 其他列 -->
				</tr>
			</thead>
			<tbody>
				<tr v-for="book in books" :key="book.asin">
					<td>{{ book.title }}</td>
					<td>{{ book.author }}</td>
					<td>{{ book.price }}</td>
					<td>{{ book.stars }}</td>
					<td>
						<button @click="showDetails(book)">查看详情</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	export default {
		props: {
			books: Array,
		},
		data() {
			return {
				currentSortField: null,
				sortAscending: true,
			};
		},
		computed: {
			sortedBooks() {
				if (!this.currentSortField) {
					return this.books;
				}
				return this.books.slice().sort((a, b) => {
					let comparison = 0;
					if (a[this.currentSortField] < b[this.currentSortField]) {
						comparison = -1;
					} else if (a[this.currentSortField] > b[this.currentSortField]) {
						comparison = 1;
					}
					return this.sortAscending ? comparison : -comparison;
				});
			},
		},
		methods: {
			sortBooks(field) {
				if (this.currentSortField === field) {
					this.sortAscending = !this.sortAscending;
				} else {
					this.currentSortField = field;
					this.sortAscending = true;
				}
			},
			sortIndicator(field) {
				if (this.currentSortField === field) {
					return this.sortAscending ? '↑' : '↓';
				}
				return '';
			},
			showDetails(book) {
				// console.log('Showing details for:', book);
				this.$emit('show-details', book);
			},
		},
	};
</script>

<style scoped>
	.book-list {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}

	table {
		width: 70%;
		/* 根据需要调整宽度 */
		border-collapse: collapse;
		/* 移除表格之间的间隔 */
		margin: 0 auto;
		/* 居中显示 */
	}

	th,
	td {
		border: 1px solid #ddd;
		/* 添加边框 */
		text-align: left;
		padding: 8px;
	}

	th {
		background-color: #f4f4f4;
		/* 标题背景色 */
		color: #333;
		/* 标题字体颜色 */
	}

	tr:nth-child(even) {
		background-color: #f9f9f9;
		/* 交替行背景色 */
	}

	tr:hover {
		background-color: #f1f1f1;
		/* 鼠标悬停时行背景色 */
	}

	button {
		background-color: #f4f4f4;
		border: none;
		cursor: pointer;
		padding: 5px 10px;
		margin-left: 5px;
		border-radius: 5px;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #e2e2e2;
	}


	/* 可以根据需要添加更多样式 */
</style>