<template>
	<div class="body">
		<div class="nk-container">
			<!-- 头部 -->
			<Header></Header>

			<!-- 内容 -->
			<div class="main">
				<!-- 帖子详情 -->
				<div class="container" style="min-height: 0px;">
					<!-- 标题 -->
					<h6 class="mb-4">
						<img src="http://static.nowcoder.com/images/img/icons/ico-discuss.png" />
						<span>{{ postData.title }}</span>
						<div class="float-right">
							<button type="button" class="btn btn-danger btn-sm"
								v-if="postData.type == 0 && user != null && user.type == 2" @click="top">置顶</button>
							<button type="button" class="btn btn-danger btn-sm"
								v-if="postData.type == 1 && user != null && user.type == 2"
								@click="top">已置顶</button>&nbsp;&nbsp;
							<button type="button" class="btn btn-danger btn-sm"
								v-if="postData.status == 0 && user != null && user.type == 2" @click="wonderful">加精</button>
							<button type="button" class="btn btn-danger btn-sm"
								v-if="postData.status == 1 && user != null && user.type == 2"
								@click="wonderful">已加精</button>&nbsp;&nbsp;
							<button type="button" class="btn btn-danger btn-sm" v-if="user != null && user.type == 1"
								@click="deletePost">删除</button>
						</div>
					</h6>
					<!-- 作者 -->
					<div class="media pb-3 border-bottom">
						<a href="profile.html">
							<img :src="userData.headerUrl" class="align-self-start mr-4 rounded-circle user-header"
								alt="用户头像">
						</a>
						<div class="media-body">
							<div class="mt-0 text-warning">{{ userData.username }}</div>
							<div class="text-muted mt-3">
								发布于 <b>{{ timeRev1 }}</b>
								<ul class="d-inline float-right">
									<li class="d-inline ml-2"><a class="text-primary" @click=addLike()
											v-if="this.likeStatus == 0">赞({{
												likeCount
											}})</a>
									</li>
									<li class="d-inline ml-2"><a class="text-primary" @click=addLike()
											v-if="this.likeStatus == 1">已赞({{
												likeCount
											}})</a>
									</li>
									<li class="d-inline ml-2">|</li>
									<li class="d-inline ml-2"><a href="#replyform" class="text-primary">回帖
											{{ total }}</a></li>
								</ul>
							</div>
						</div>
					</div>
					<!-- 正文 -->
					<div class="mt-4 mb-3 content">
						{{ postData.content }}
					</div>
				</div>
				<!-- 回帖 -->
				<div class="container mt-3" style="min-height: 0px;">
					<!-- 回帖数量 -->
					<div class="row">
						<div class="col-8">
							<h6><b class="square"></b> <i>{{ total }}</i> 条回帖</h6>
						</div>
						<div class="col-4 text-right">
							<a href="#replyform" class="btn btn-primary btn-sm">&nbsp;&nbsp;回&nbsp;&nbsp;帖&nbsp;&nbsp;</a>
						</div>
					</div>
					<!-- 回帖列表 -->
					<ul class="list-unstyled mt-4">
						<!-- 第1条回帖 -->
						<li class="media pb-3 pt-3 mb-3 border-bottom" v-for='(comment, index) in commentsData' :key=index>
							<a href="profile.html">
								<img :src="comment.user.headerUrl" class="align-self-start mr-4 rounded-circle user-header"
									alt="用户头像">
							</a>
							<div class="media-body">
								<div class="mt-0">
									<span class="font-size-12 text-success">{{ comment.user.username }}</span>
									<span class="badge badge-secondary float-right floor">{{ index + 1 }}#</span>
								</div>
								<div class="mt-2">
									{{ comment.comment.content }}
								</div>
								<div class="mt-4 text-muted font-size-12">
									<span>发布于 <b>{{ timeRev2 }}</b></span>
									<ul class="d-inline float-right">
										<li class="d-inline ml-2"><a class="text-primary" @click=addCommentLike(index)
												v-if="comment.likeStatus == 0">赞({{
													comment.likeCount }})</a></li>
										<li class="d-inline ml-2"><a class="text-primary" @click=addCommentLike(index)
												v-if="comment.likeStatus == 1">已赞({{
													comment.likeCount }})</a></li>
										<li class="d-inline ml-2">|</li>
										<li class="d-inline ml-2"><a href="#" class="text-primary">回复({{ comment.replyCount
										}})</a>
										</li>
									</ul>
								</div>
								<!-- 回复列表 -->
								<ul class="list-unstyled mt-4 bg-gray p-3 font-size-12 text-muted">
									<!-- 第1条回复 -->
									<li class="pb-3 pt-3 mb-3 border-bottom" v-for='(reply, index) in comment.replys'
										:key=index>
										<div>
											<span><b class="text-info">{{ reply.user.username }}</b>:&nbsp;&nbsp;</span>
											<span>{{ reply.reply.content }}</span>
										</div>
										<div class="mt-3">
											<span>{{ timeRev3 }}</span>
											<ul class="d-inline float-right">
												<li class="d-inline ml-2"><a class="text-primary" @click=addReplyLike(reply)
														v-if="reply.likeStatus == 0">赞({{
															reply.likeCount }})</a></li>
												<li class="d-inline ml-2"><a class="text-primary" @click=addReplyLike(reply)
														v-if="reply.likeStatus == 1">已赞({{
															reply.likeCount }})</a></li>
												<li class="d-inline ml-2">|</li>
												<li class="d-inline ml-2"><a href="#huifu01" data-toggle="collapse"
														class="text-primary">回复</a></li>
											</ul>
											<div id="huifu01" class="mt-4 collapse">
												<div>
													<input type="text" class="input-size"
														:placeholder="回复 + reply.reply.username" />
												</div>
												<div class="text-right mt-2">
													<button type="button" class="btn btn-primary btn-sm"
														onclick="#">&nbsp;&nbsp;回&nbsp;&nbsp;复&nbsp;&nbsp;</button>
												</div>
											</div>
										</div>
									</li>
									<!-- 回复输入框 -->
									<li class="pb-3 pt-3">
										<div>
											<input type="text" class="input-size" placeholder="请输入你的观点"
												v-model="comment.content" />
										</div>
										<div class="text-right mt-2">
											<button type="button" class="btn btn-primary btn-sm"
												@click="addReply(comment)">&nbsp;&nbsp;回&nbsp;&nbsp;复&nbsp;&nbsp;</button>
										</div>
									</li>
								</ul>
							</div>
						</li>
					</ul>
					<!-- 分页 -->
					<el-pagination style="margin-top: 15px;text-align: center" :current-page="page"
						:page-sizes="[5, 10, 15]" :page-size="limit" layout="prev,pager,next,jumper,->,sizes,total"
						@current-change="handleCurrentChange" @size-change="handleSizeChange" :total="total">
					</el-pagination>
					<!-- 回帖输入 -->
					<div class="replyform">
						<p class="mt-3">
							<a name="replyform"></a>
							<textarea placeholder="在这里畅所欲言你的看法吧!" v-model="postContent"></textarea>
						</p>
						<p class="text-right">
							<button type="submit" class="btn btn-primary btn-sm"
								@click=addComment()>&nbsp;&nbsp;回&nbsp;&nbsp;帖&nbsp;&nbsp;</button>
						</p>
					</div>
				</div>
			</div>

			<!-- 尾部 -->
			<Footer></Footer>
		</div>
	</div>
</template>
<script>
import { detailAPI, lickAPI, commentAPI, topAPI, wonderfulAPI, deleteAPI } from '@/api/detail.js';
import { userInfoAPI } from '@/api/user';
import { getToken } from '@/utils/auth'
import qs from "qs";
import { ElMessage } from "element-plus";
export default {
	data() {
		return {
			id: 0,
			page: 1,
			limit: 5,
			total: 0, //总的回帖数
			commentsData: [],//评论数据
			postData: {},//帖子数据
			userData: {},//用户数据
			likeCount: 0,//点赞数
			commentObj: {}, //评论的对象
			replyObj: {},  //评论的回复对象

			user: {},
			likeStatus: 0,
			postContent: ""
		}
	},
	methods: {
		top() {
			if (this.postData.type == 0) {
				topAPI(getToken(), this.id, 1).then(res => {
					ElMessage({ type: "success", message: res.data.msg });
					this.postData.type = 1;
				}).catch(e => {
					ElMessage({ type: "error", message: e });
				})
			} else {
				topAPI(getToken(), this.id, 0).then(res => {
					ElMessage({ type: "success", message: "已取消顶置！" });
					this.postData.type = 0;
				}).catch(e => {
					ElMessage({ type: "error", message: e });
				})
			}
		},
		wonderful() {
			if (this.postData.status == 0) {
				wonderfulAPI(getToken(), this.id, 1).then(res => {
					ElMessage({ type: "success", message: res.data.msg });
					this.postData.status = 1;
				}).catch(e => {
					ElMessage({ type: "error", message: e });
				})
			} else {
				wonderfulAPI(getToken(), this.id, 0).then(res => {
					ElMessage({ type: "success", message: "已取消顶置！" });
					this.postData.status = 0;
				}).catch(e => {
					ElMessage({ type: "error", message: e });
				})
			}
		},
		deletePost() {
			deleteAPI(getToken(), this.id).then(res => {
				ElMessage({ type: "success", message: res.data.msg });
				this.$router.push("/home");
			}).catch(e => {
				ElMessage({ type: "error", message: e });
			})
		},
		getListData(id, page, limit) {
			detailAPI(getToken(), id, page, limit).then(res => {
				this.total = res.data.data.post.commentCount;
				this.commentsData = res.data.data.comments;
				this.postData = res.data.data.post;
				this.userData = res.data.data.user;
				this.likeCount = res.data.data.likeCount;
				this.likeStatus = res.data.data.likeStatus;
				//console.log(this.total);
			}).catch(error => {
				ElMessage({ type: "error", message: error });
			})
		},
		handleCurrentChange(val) {
			this.page = val
			this.getListData(this.id, this.page, this.limit);
		},
		handleSizeChange(val) {
			this.limit = val
			this.getListData(this.id, this.page, this.limit);
		},
		addLike() {
			if (this.user == null) {
				ElMessage({ type: "error", message: "你还没登录哦！" });
			}
			else {
				let entityType = 1;
				let entityId = this.id;
				let entityUserId = this.user.id;
				let postId = this.id;
				lickAPI(getToken(), qs.stringify({ entityType, entityId, entityUserId, postId }))
					.then(res => {

						if (this.likeStatus == 0) {
							this.likeStatus = 1;
							this.likeCount++;
							ElMessage({ type: "success", message: res.data.msg });
						} else {
							this.likeStatus = 0
							this.likeCount--;
							ElMessage({ type: "success", message: "已取消点赞！" });
						}
					})
					.catch(e => {
						ElMessage({ type: "error", message: e });
					})

			}
		},
		addCommentLike(index) {
			if (this.user == null) {
				ElMessage({ type: "error", message: "你还没登录哦！" });
			}
			else {
				let entityType = 2;
				let entityId = this.commentsData[index].comment.id;
				let entityUserId = this.user.id;
				let postId = this.id;
				lickAPI(getToken(), qs.stringify({ entityType, entityId, entityUserId, postId }))
					.then(res => {
						if (this.commentsData[index].likeStatus == 0) {
							this.commentsData[index].likeStatus = 1;
							this.commentsData[index].likeCount++;
							ElMessage({ type: "success", message: res.data.msg });
						} else {
							this.commentsData[index].likeStatus = 0
							this.commentsData[index].likeCount--;
							ElMessage({ type: "success", message: "已取消点赞！" });
						}
					})
					.catch(e => {
						ElMessage({ type: "error", message: e });
					})

			}
		},
		addReplyLike(reply) {
			if (this.user == null) {
				ElMessage({ type: "error", message: "你还没登录哦！" });
			}
			else {
				let entityType = 2;
				let entityId = reply.reply.id;
				let entityUserId = this.user.id;
				let postId = this.id;
				lickAPI(getToken(), qs.stringify({ entityType, entityId, entityUserId, postId }))
					.then(res => {
						if (reply.likeStatus == 0) {
							reply.likeStatus = 1;
							reply.likeCount++;
							ElMessage({ type: "success", message: res.data.msg });
						} else {
							reply.likeStatus = 0
							reply.likeCount--;
							ElMessage({ type: "success", message: "已取消点赞！" });
						}
					})
					.catch(e => {
						ElMessage({ type: "error", message: e });
					})
			}
		},
		addReply(comment) {
			if (this.user == null) {
				ElMessage({ type: "error", message: "你还没登录哦！" });
			} else {
				console.log(comment)

				let entityType = 2;
				let entityId = comment.comment.id;
				let content = comment.content
				commentAPI(getToken(), this.id, qs.stringify({ entityType, entityId, content })).then(res => {
					comment.content = ""
					this.getListData(this.id, this.page, this.limit);
					ElMessage({ type: "success", message: "评论成功！" });
				}).catch(e => {
					ElMessage({ type: "error", message: e });
				})
			}
		},
		addComment() {
			if (this.user == null) {
				ElMessage({ type: "error", message: "你还没登录哦！" });
			} else {
				let entityType = 1;
				let entityId = this.id;
				let content = this.postContent
				commentAPI(getToken(), this.id, qs.stringify({ entityType, entityId, content })).then(res => {
					this.getListData(this.id, this.page, this.limit);
					ElMessage({ type: "success", message: "评论成功！" });
					this.postContent = ""
				}).catch(e => {
					ElMessage({ type: "error", message: e });
				})
			}
		}
	},

	computed: {
		timeRev1() {
			var time = this.postData.createTime;
			if (time != null) {
				var res = time.slice(0, 10) + '  ' + time.slice(11, 19);
			}
			return res;
		},
		timeRev2() {
			for (var i = 0; i < this.commentsData.length; i++) {
				var time = this.commentsData[i].comment.createTime;
				if (time != null) {

					var res = time.slice(0, 10) + '  ' + time.slice(11, 19);
				}

			}
			return res
		},
		timeRev3() {
			for (var i = 0; i < this.commentsData.length; i++) {
				for (var j = 0; j < this.commentsData[i].replys.length; j++) {
					var time = this.commentsData[i].replys[j].reply.createTime;
					if (time != null) {
						var res = time.slice(0, 10) + '  ' + time.slice(11, 19);
					}
				}
			}
			return res;
		}

	},
	mounted() {
		this.getListData(this.id, this.page, this.limit);
		userInfoAPI(getToken()).then((res) => {
			this.user = res.data.data
		})
	},
	created() {
		this.id = this.$route.query.id
	}
}

</script>
<style scoped>
.content {
	font-size: 16px;
	line-height: 2em;
}

.replyform textarea {
	width: 100%;
	height: 200px;
}

.floor {
	background: #dcdadc;
	padding: 4px 12px;
	border-radius: 3px;
	font-size: 14px;
}

.input-size {
	width: 100%;
	height: 35px;
}

a {
	text-decoration: none;
	color: #000;
	cursor: pointer;
}
</style>