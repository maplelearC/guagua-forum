<template>
  <div class="body">
    <div class="nk-container">
      <!-- 头部 -->
      <Header></Header>

      <!-- 内容 -->
      <div class="main">
        <div class="container">
          <div class="row" style="margin-top: 20px">
            <div class="col-8">
              <h6><b class="square"></b> 系统通知</h6>
            </div>
            <div class="col-4 text-right">
              <router-link
                class="btn btn-secondary btn-sm"
                :to="{ path: '/message', query: { display: 'notice' } }"
              >
                返回
              </router-link>
            </div>
          </div>

          <!-- 通知列表 -->
          <ul class="list-unstyled mt-4" v-show="notices.length">
            <li class="media pb-3 pt-3 mb-2" v-for="notice in notices">
              <img
                src="http://static.nowcoder.com/images/head/notify.png"
                class="mr-4 rounded-circle user-header"
                alt="系统图标"
              />
              <div
                style="width: 80%"
                class="toast show d-lg-block"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <div class="toast-header">
                  <strong class="mr-auto">{{ notice.user?.username }}</strong>
                  <small>{{ notice.notice?.createTime }}</small>
                  <button
                    type="button"
                    class="ml-2 mb-1 close"
                    data-dismiss="toast"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="toast-body">
                  {{ notice.info }}
                  <span v-if="conversationId == 'comment'"
                    >用户
                    <i>{{ notice.user?.username }}</i> 评论了你的<b>帖子</b>,
                    <router-link class="text-primary" href=""
                      >点击查看</router-link
                    >
                    !</span
                  >
                  <span v-if="this.conversationId === 'like'"
                    >用户
                    <i>{{ notice.user?.username }}</i> 点赞了你的<b>帖子</b>,
                    <router-link class="text-primary" href="#"
                      >点击查看</router-link
                    >
                    !</span
                  >
                  <span v-if="conversationId == 'follow'"
                    >用户 <i>{{ notice.user?.username }}</i> 关注了你,
                    <router-link class="text-primary" href="#"
                      >点击查看</router-link
                    >
                    !</span
                  >
                </div>
              </div>
            </li>
          </ul>
          <!-- 分页 -->
          <el-pagination
            style="margin-top: 15px; text-align: center"
            :current-page="page"
            :page-sizes="[5, 10, 15]"
            :page-size="limit"
            layout="prev,pager,next,jumper,->,sizes,total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :total="total"
            v-show="notices.length"
          >
          </el-pagination>
          <ElEmpty v-show="!notices.length"></ElEmpty>
        </div>
      </div>

      <!-- 尾部 -->
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import {
  commentDetailAPI,
  likeDetailAPI,
  followDetailAPI,
} from "@/api/message";
import { ElMessage } from "element-plus";
import { getToken } from "@/utils/auth";

export default {
  name: "Message-detail",
  data() {
    return {
      conversationId: "",
      comments: [],
      likes: [],
      follows: [],
      notices: [],

      total: 0, //数据的总条数
      page: 1, //当前第几页
      limit: 10, //页面展示数据条数
    };
  },
  methods: {
    //点击分页器的某一页按钮的回调
    handleCurrentChange(page) {
      this.page = page;
      if (this.conversationId === "comment") {
        commentDetailAPI(getToken(), this.page, this.limit)
          .then((response) => {
            if (response.data.code == 0) {
              this.comments = response.data.data.notices;
            }
          })
          .catch((error) => {
            ElMessage({
              duration: 1000,
              type: "error",
              message: error.message,
            });
          });
        this.total = this.comments.length;
        this.notices = this.comments;
      } else if (this.conversationId === "like") {
        likeDetailAPI(getToken(), this.page, this.limit)
          .then((response) => {
            if (response.data.code == 0) {
              this.likes = response.data.data.notices;
            }
          })
          .catch((error) => {
            ElMessage({
              duration: 1000,
              type: "error",
              message: error.message,
            });
          });

        this.total = this.likes.length;
        this.notices = this.likes;
      } else if (this.conversationId === "follow") {
        followDetailAPI(getToken(), this.page, this.limit)
          .then((response) => {
            if (response.data.code == 0) {
              this.follows = response.data.data.notices;
            }
            console.log(response);
          })
          .catch((error) => {
            ElMessage({
              duration: 1000,
              type: "error",
              message: error.message,
            });
          });
        this.total = this.follows.length;
        this.notices = this.follows;
      }
    },
    //点击分页器的limit的回调
    handleSizeChange(limit) {
      this.limit = limit;
      if (this.conversationId === "comment") {
        commentDetailAPI(getToken(), this.page, this.limit)
          .then((response) => {
            if (response.data.code == 0) {
              this.comments = response.data.data.notices;
            }
          })
          .catch((error) => {
            ElMessage({
              duration: 1000,
              type: "error",
              message: error.message,
            });
          });
        this.total = this.comments.length;
      } else if (this.conversationId === "like") {
        likeDetailAPI(getToken(), this.page, this.limit)
          .then((response) => {
            if (response.data.code == 0) {
              this.likes = response.data.data.notices;
            }
          })
          .catch((error) => {
            ElMessage({
              duration: 1000,
              type: "error",
              message: error.message,
            });
          });

        this.total = this.likes.length;
      } else if (this.conversationId === "follow") {
        followDetailAPI(getToken(), this.page, this.limit)
          .then((response) => {
            if (response.data.code == 0) {
              this.follows = response.data.data.notices;
            }
          })
          .catch((error) => {
            ElMessage({
              duration: 1000,
              type: "error",
              message: error.message,
            });
          });
        this.total = this.follows.length;
      }
    },
  },
  mounted() {
    this.conversationId = this.$route.query.conversationId;
    console.log(this.conversationId);
    if (this.conversationId === "comment") {
      commentDetailAPI(getToken(), 1, 10)
        .then((response) => {
          if (response.data.code === 0) {
            console.log(this.notices);
            //this.notices = response.data.data.notices;
          }
        })
        .catch((error) => {
          ElMessage({ duration: 1000, type: "error", message: error.message });
        });
    } else if (this.conversationId === "like") {
      likeDetailAPI(getToken(), 1, 10)
        .then((response) => {
          if (response.data.code === 0) {
            this.notices = response.data.data.notices;
          }
          for (let i = 0; i < this.notices.length; i++) {
            this.notices[i].info =
              "用户" + this.notices[i].user.username + "点赞了你的帖子";
          }
          console.log(this.notices);
        })
        .catch((error) => {
          ElMessage({ duration: 1000, type: "error", message: error.message });
        });
    } else if (this.conversationId === "follow") {
      followDetailAPI(getToken(), 1, 10)
        .then((response) => {
          if (response.data.code === 0) {
            this.notices = response.data.data.notices;
          }
          console.log(response);
        })
        .catch((error) => {
          ElMessage({ duration: 1000, type: "error", message: error.message });
        });
      //this.total = this.notices.length;
    }
  },
};
</script>
