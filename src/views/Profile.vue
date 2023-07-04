<template>
  <div class="body">
    <div class="nk-container">
      <!-- 头部 -->
      <Header></Header>

      <!-- 内容 -->
      <div class="main">
        <div class="container">
          <!-- 选项 -->
          <div class="position-relative">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <a class="nav-link active">个人信息</a>
              </li>
            </ul>
          </div>
          <!-- 个人信息 -->
          <div class="media mt-5">
            <img
              :src="user.headerUrl"
              class="align-self-start mr-4 rounded-circle"
              alt="用户头像"
              style="width: 50px"
            />
            <div class="media-body">
              <h5 class="mt-0 text-warning">
                <span>{{ user.username }}</span>
                <button
                  type="button"
                  class="btn btn-info btn-sm float-right mr-5 follow-btn"
                  v-if="
                    loginUser == null ||
                    (loginUser.id != user.id && !hasFollowed)
                  "
                  @click="follow"
                >
                  关注TA
                </button>
                <button
                  type="button"
                  class="btn btn-info btn-sm float-right mr-5 follow-btn"
                  v-if="
                    loginUser != null && loginUser.id != user.id && hasFollowed
                  "
                  style="background-color: aliceblue; border: 0px"
                  @click="unFollow"
                >
                  已关注
                </button>
              </h5>
              <div class="text-muted mt-3">
                <span
                  >注册于 <i class="text-muted">{{ user.createTime }}</i></span
                >
              </div>
              <div class="text-muted mt-3 mb-5">
                <span
                  >关注了
                  <router-link
                    :to="{
                      path: '/follow',
                      query: {
                        userId: user.id,
                        types: 0,
                      },
                    }"
                    class="text-primary"
                    >{{ followeeCount }}</router-link
                  >
                  人</span
                >
                <span class="ml-4"
                  >关注者
                  <router-link
                    :to="{
                      path: '/follow',
                      query: { userId: user.id, types: 1 },
                    }"
                    class="text-primary"
                    >{{ followerCount }}</router-link
                  >
                  人</span
                >
                <span class="ml-4"
                  >获得了
                  <i class="text-danger">{{ userLikeCount }}</i> 个赞</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 尾部 -->
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {
  followAPI,
  getUserInfoByIdAPI,
  userInfoAPI,
  unfollowAPI,
} from "@/api/user";
import "@/style/bootstrap.min.css";
import { ElMessage } from "element-plus";
import qs from "qs";
const user = {};
const loginUser = {};
export default {
  data() {
    return {
      user: user,
      followeeCount: 0,
      followerCount: 0,
      hasFollowed: false,
      userLikeCount: 0,
      userId: 0,

      loginUser: loginUser,
    };
  },
  beforeCreate() {
    userInfoAPI(getToken()).then((res) => {
      this.loginUser = res.data.data;
    });

    this.getUrlCode = function (name) {
      // 构造一个含有目标参数的正则表达式对象
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      // 匹配目标参数
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      } else {
        return null;
      }
    };
    var userId = this.getUrlCode("userId");

    this.userId = parseInt(userId);
    console.log(this.userId);

    getUserInfoByIdAPI(getToken(), userId).then((res) => {
      this.user = res.data.data.user;
      this.followeeCount = res.data.data.followeeCount;
      this.followerCount = res.data.data.followerCount;
      this.hasFollowed = res.data.data.hasFollowed;
      this.userLikeCount = res.data.data.userLikeCount;
      console.log(res.data.data);
    });
  },
  mounted() {},
  methods: {
    follow() {
      let entityId = this.user.id;
      let entityType = 3;
      followAPI(getToken(), qs.stringify({ entityId, entityType }))
        .then((res) => {
          this.followerCount++;
          this.hasFollowed = true;
          ElMessage({ type: "success", message: res.data.msg });
        })
        .catch((e) => {
          ElMessage({ type: "error", message: e });
        });
    },
    unFollow() {
      let entityId = this.user.id;
      let entityType = 3;
      unfollowAPI(getToken(), qs.stringify({ entityId, entityType }))
        .then((res) => {
          this.followerCount--;
          this.hasFollowed = false;
          ElMessage({ type: "success", message: res.data.msg });
        })
        .catch((e) => {
          ElMessage({ type: "error", message: e });
        });
    },
  },
};
</script>
