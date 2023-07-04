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
              <h6>
                <b class="square"></b> 来自
                <router-link
                  class="text-success"
                  :to="{ path: '/profile', query: { userId: target.id } }"
                >
                  {{ target.username }}
                </router-link>
                的私信
              </h6>
            </div>
            <div class="col-4 text-right">
              <router-link
                class="btn btn-secondary btn-sm"
                :to="{ path: '/message', query: { display: 'letter' } }"
              >
                返回
              </router-link>
              <span>&nbsp;&nbsp;</span>
              <button
                @click="
                  dialogVisible = true;
                  toName = target.username;
                "
                type="button"
                class="btn btn-primary btn-sm"
                data-toggle="modal"
                data-target="#sendModal"
              >
                给TA私信
              </button>
            </div>
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

          <ul class="list-unstyled mt-4" v-show="letters.length">
            <li
              class="media pb-3 pt-3 mb-2"
              v-for="(letter, index) in letters"
              :key="letter"
              v-if="liVisible !== index"
            >
              <router-link
                :to="{
                  path: '/profile',
                  query: { userId: letter.fromUser?.id },
                }"
              >
                <img
                  :src="letter.fromUser?.headerUrl"
                  class="mr-4 rounded-circle user-header"
                  alt="用户头像"
                />
              </router-link>
              <div
                style="width: 80%"
                class="toast show d-lg-block"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <div class="toast-header">
                  <strong class="mr-auto">{{
                    letter.fromUser?.username
                  }}</strong>
                  <small>{{ letter.letter?.createTime }}</small>
                  <button
                    type="button"
                    @click="liVisible = index"
                    class="ml-2 mb-1 close"
                    data-dismiss="toast"
                    aria-lazbel="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="toast-body">
                  {{ letter.letter?.content }}
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
            v-show="letters.length"
          >
          </el-pagination>
          <ElEmpty v-show="!letters.length"></ElEmpty>
        </div>
      </div>

      <!-- 尾部 -->
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import { letterDetailAPI, sendLetterAPI } from "@/api/message";
import { ElMessage } from "element-plus";
import { getToken } from "@/utils/auth";
import qs from "qs";
import { h } from "vue";

export default {
  name: "Message-detail",
  data() {
    return {
      dialogVisible: false,
      liVisible: -1,
      conversationId: "",
      letters: [],
      target: {},
      toName: "",
      content: "",

      total: 0, //数据的总条数
      page: 1, //当前第几页
      limit: 10, //页面展示数据条数
    };
  },
  mounted() {
    this.conversationId = this.$route.query.conversationId;

    letterDetailAPI(getToken(), this.conversationId, 1, 10)
      .then((response) => {
        if (response.data.code === 0) {
          this.letters = response.data.data.letters;
          this.target = response.data.data.target;
          this.total = this.letters.length;
        }
      })
      .catch((error) => {
        ElMessage({ duration: 1000, type: "error", message: error.message });
      });
    console.log(this.letters.length);
  },

  methods: {
    //点击分页器的某一页按钮的回调
    handleCurrentChange(page) {
      this.page = page;
      letterDetailAPI(getToken(), this.conversationId, this.page, this.limit)
        .then((response) => {
          console.log(response);
          if (response.data.code === 0) {
            this.letters = response.data.data.letters;
            this.total = this.letters.length;
          }
        })
        .catch((error) => {
          ElMessage({ duration: 1000, type: "error", message: error });
        });
    },
    //点击分页器的limit的回调
    handleSizeChange(limit) {
      this.limit = limit;
      letterDetailAPI(getToken(), this.conversationId, this.page, this.limit)
        .then((response) => {
          if (response.data.code === 0) {
            this.letters = response.data.data.letters;
            this.total = this.letters.length;
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
      const toName = this.toName;
      const content = this.content;

      sendLetterAPI(getToken(), qs.stringify({ toName, content }))
        .then((response) => {
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
    //TODO:列表移除
  },
};
</script>

<style scoped></style>
