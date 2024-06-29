<template>
	<div class="modal" v-if="show">
		<div class="modal-content">
			<span class="close" @click="close">&times;</span>
			<div class="tags">
				<span v-if="book.isBestSeller === 'True'" class="tag best-seller">最畅销书</span>
				<span v-if="book.isEditorsPick === 'True'" class="tag editors-pick">编辑推荐</span>
				<span v-if="book.isGoodReadsChoice === 'True'" class="tag goodreads-choice">GoodReads选择</span>
			</div>
			<h3>{{ book.title }}</h3>
			<p><strong>作者:</strong> {{ book.author }}</p>
			<p><strong>价格:</strong> {{ book.price }}</p>
			<p><strong>评分:</strong> {{ book.stars }}</p>
			<p><strong>分类:</strong> {{ book.category_name }}</p>
			<p><strong>出版日期:</strong> {{ book.publishedDate }}</p>
			<p><strong>出版商:</strong> {{ book.soldBy }}</p>
			<p><strong>asin:</strong> {{ book.asin }}</p>
			<!-- 其他详细信息 -->
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			book: Object,
			show: Boolean,
		},
		methods: {
			close() {
				this.$emit('close');
			},
		},
	};
</script>

<style scoped>
	.modal {
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgba(0, 0, 0, 0.4);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-content {
		background-color: #fefefe;
		margin: 15% auto;
		padding: 20px;
		border: 1px solid #888;
		width: 80%;
	}

	.close {
		color: #aaa;
		float: right;
		font-size: 28px;
		font-weight: bold;
	}

	.close:hover,
	.close:focus {
		color: black;
		text-decoration: none;
		cursor: pointer;
	}

	.tags {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tag {
		padding: 5px 10px;
		border-radius: 5px;
		color: white;
		font-weight: bold;
	}

	.best-seller {
		background-color: royalblue;
		/* 皇家蓝 */
	}

	.editors-pick {
		background-color: darkorange;
		/* 深橙色 */
	}

	.goodreads-choice {
		background-color: mediumseagreen;
		/* 海洋绿 */
	}
</style>