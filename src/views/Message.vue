<template>
  <div class="body">
    <div class="nk-container">
      <!-- 头部 -->
      <Header></Header>

      <!-- 内容 -->
      <div class="main">
        <div class="container">
          <div class="position-relative">
            <!-- 选项 -->
            <ul class="nav nav-tabs mb-3">
              <li class="nav-item" @click="changeMsg('letter')">
                <a
                  class="nav-link position-relative cursor-pointer"
                  :class="{
                    active: display === 'letter',
                  }"
                  >朋友私信<span
                    class="badge badge-danger"
                    v-if="letterUnreadCount"
                    >{{ letterUnreadCount }}</span
                  ></a
                >
              </li>

              <li class="nav-item" @click="changeMsg('notice')">
                <a
                  class="nav-link position-relative cursor-pointer"
                  :class="{
                    active: display === 'notice',
                  }"
                  >系统通知<span
                    class="badge badge-danger"
                    v-if="noticeUnreadCount"
                    >{{ noticeUnreadCount }}</span
                  ></a
                >
              </li>
            </ul>
            <button
              v-if="display === 'letter'"
              type="button"
              @click="dialogVisible = true"
              class="btn btn-primary btn-sm position-absolute rt-0"
              data-toggle="modal"
              style="background-color: #195bd6; color: #fcfcfc"
              data-target="#sendModal"
            >
              发私信
            </button>
          </div>
          <!-- 弹出框 -->
          <el-dialog
            v-model="dialogVisible"
            title="发私信"
            width="40%"
            :before-close="handleClose"
          >
            <form>
              <div class="form-group">
                <label for="recipient-name" class="col-form-label"
                  >发给：</label
                >
                <input
                  type="text"
                  v-model="toName"
                  class="form-control"
                  id="recipient-name"
                />
              </div>
              <div class="form-group">
                <label for="message-text" class="col-form-label">内容：</label>
                <textarea
                  v-model="content"
                  class="form-control"
                  id="message-text"
                  rows="15"
                ></textarea>
              </div>
            </form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirm"> 发送 </el-button>
              </span>
            </template>
          </el-dialog>

          <!-- 私信列表 -->
          <template v-if="display === 'letter'">
            <Letter
              :conversations="conversations"
              v-show="conversations.length"
            />
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
              v-show="conversations.length"
            >
            </el-pagination>
            <ElEmpty v-show="!conversations.length"></ElEmpty>
          </template>
          <Notice v-if="display === 'notice'" :notices="notices" />
        </div>
      </div>

      <!-- 尾部 -->
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
//import Messagelistitem from "@/components/Messagelist-item";
import Letter from "@/components/Letter";
import Notice from "@/components/Notice";
import { letterListAPI, noticeListAPI, sendLetterAPI } from "@/api/message";
import { ElMessage } from "element-plus";
import { getToken } from "@/utils/auth";
import qs from "qs";
import { h } from "vue";

export default {
  components: {
    Letter,
    Notice,
  },
  mounted() {
    this.display = this.$route.query.display ?? "letter";
    letterListAPI(getToken(), 1, 10)
      .then((response) => {
        //console.log(response);
        if (response.data.code === 0) {
          this.conversations = response.data.data.conversations;
          this.letterUnreadCount = response.data.data.letterUnreadCount;
          this.noticeUnreadCount = response.data.data.noticeUnreadCount;
          this.total = response.data.data.count;
        }
      })
      .catch((error) => {
        ElMessage({ type: "error", message: error });
      });

    noticeListAPI(getToken())
      .then((response) => {
        if (response.data.code === 0) {
          this.notices = response.data.data;

          if (this.notices.commentNotice && this.notices.commentNotice.user) {
            this.notices.commentNotice.user.headerUrl =
              "http://static.nowcoder.com/images/head/reply.png";
            this.notices.commentNotice.message.content = `用户 ${this.notices.commentNotice.user.username} 评论了你的帖子 ...`;
            this.notices.commentNotice.user.username = "评论";
          }

          if (this.notices.followNotice && this.notices.followNotice.user) {
            this.notices.followNotice.user.headerUrl =
              "http://static.nowcoder.com/images/head/like.png";
            this.notices.followNotice.message.content = `用户 ${this.notices.followNotice.user.username} 关注了你 ...`;
            this.notices.followNotice.user.username = "关注";
          }

          if (this.notices.likeNotice && this.notices.likeNotice.user) {
            this.notices.likeNotice.user.headerUrl =
              "http://static.nowcoder.com/images/head/follow.png";
            this.notices.likeNotice.message.content = `用户 ${this.notices.likeNotice.user.username} 点赞了你的帖子 ...`;
            this.notices.likeNotice.user.username = "点赞";
          }

          //console.log(this.notices);
        }
      })
      .catch((error) => {
        ElMessage({ type: "error", message: error });
      });
  },
  data() {
    return {
      display: "letter",
      letterUnreadCount: 0,
      noticeUnreadCount: 0,
      conversations: [],
      notices: {},
      dialogVisible: false,

      toName: "",
      content: "",

      total: 0, //数据的总条数
      page: 1, //当前第几页
      limit: 10, //页面展示数据条数
    };
  },
  methods: {
    changeMsg(display) {
      console.log(display);
      // this.isNotice = !this.isNotice;
      this.display = display;
    },
    //点击分页器的某一页按钮的回调
    handleCurrentChange(page) {
      this.page = page;
      letterListAPI(getToken(), this.page, this.limit)
        .then((response) => {
          //console.log(response);
          if (response.data.code === 0) {
            this.conversations = response.data.data.conversations;
            this.letterUnreadCount = response.data.data.letterUnreadCount;
            this.total = response.data.data.count;
          }
        })
        .catch((error) => {
          ElMessage({ duration: 1000, type: "error", message: error });
        });
    },
    //点击分页器的limit的回调
    handleSizeChange(limit) {
      this.limit = limit;
      letterListAPI(getToken(), this.page, this.limit)
        .then((response) => {
          //console.log(response);
          if (response.data.code === 0) {
            this.conversations = response.data.data.conversations;
            this.letterUnreadCount = response.data.data.letterUnreadCount;
            this.total = response.data.data.count;
          }
        })
        .catch((error) => {
          ElMessage({ duration: 1000, type: "error", message: error });
        });
    },
    handleClose(done) {
      done();
    },
    confirm() {
      //this.dialogVisible = false;
      this.sendLetter(this.toName, this.content);
    },
    sendLetter(toName, content) {
      if (toName === "") {
        ElMessage({
          duration: 1000,
          type: "error",
          message: "目标用户不能为空！",
        });
        return;
      }
      sendLetterAPI(getToken(), qs.stringify({ toName, content }))
        .then((response) => {
          console.log(response.data);
          if (response.data.code == 0) {
            this.dialogVisible = false;
            ElMessage({
              duration: 1000,
              type: "success",
              message: h("div", { style: "color: teal" }, "发送成功"),
            });
          } else
            ElMessage({
              duration: 1000,
              type: "error",
              message: response.data.msg,
            });
        })
        .catch((error) => {
          ElMessage({ duration: 1000, type: "error", message: error.data });
        });
    },
  },
};
</script>

<style scoped>
.main .nav .badge {
  position: absolute;
  top: -3px;
  left: 68px;
}

.main .media .badge {
  position: absolute;
  top: 12px;
  left: -3px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
