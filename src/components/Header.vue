<template>
  <header class="sticky-top header-bg">
    <div class="container-header">
      <!-- 导航 -->
      <nav class="navbar navbar-expand-lg navbar-dark">
        <!-- logo -->
        <router-link
          class="navbar-brand"
          to="/"
          style="
            font-weight: 700;
            font-size: x-large;
            margin-right: 100px;
            color: #dff9fb;
          "
          >呱呱乐园</router-link
        >
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- 功能 -->
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item ml-3 btn-group-vertical">
              <router-link
                to="/home"
                class="nav-link"
                style="font-size: large; color: #ffffff"
                >首页</router-link
              >
            </li>
            <li class="nav-item ml-3 btn-group-vertical">
              <router-link to="/science" class="nav-link" style="color: #ffffff"
                >学术板块</router-link
              >
            </li>
            <li class="nav-item ml-3 btn-group-vertical">
              <router-link to="/live" class="nav-link" style="color: #ffffff"
                >生活板块</router-link
              >
            </li>
            <li class="nav-item ml-3 btn-group-vertical">
              <router-link to="/help" class="nav-link" style="color: #ffffff"
                >帮助板块</router-link
              >
            </li>
            <li
              class="nav-item ml-3 btn-group-vertical"
              v-if="this.user != null"
            >
              <router-link
                to="/message"
                class="nav-link position-relative"
                style="color: #ffffff"
                >消息<span class="badge badge-danger">{{}}</span>
              </router-link>
            </li>
            <li
              class="nav-item ml-3 btn-group-vertical"
              v-if="this.user == null"
            >
              <router-link to="/login" class="nav-link" style="color: #ffffff">
                登录</router-link
              >
            </li>
            <li
              class="nav-item ml-3 btn-group-vertical dropdown"
              v-if="this.user != null"
            >
              <el-dropdown>
                <span class="el-dropdown-link">
                  <!-- <a class="nav-link  menu-item" href="#" role="button" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false"> -->
                  <img
                    :src="this.user.headerUrl"
                    class="rounded-circle"
                    style="width: 30px"
                  />
                  <!-- </a> -->
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      ><router-link
                        :to="{ path: '/profile', query: { userId: user.id } }"
                        class="dropdown-item text-center"
                        >个人主页</router-link
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      ><router-link
                        to="/setting"
                        class="dropdown-item text-center"
                        >账号设置</router-link
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      ><span @click="loginOut" class="dropdown-item text-center"
                        >退出登录</span
                      ></el-dropdown-item
                    >
                    <el-dropdown-item divided
                      ><span class="dropdown-item text-center text-secondary">{{
                        this.user.username
                      }}</span></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </li>
          </ul>
          <!-- 搜索 -->
          <form class="form-inline my-2 my-lg-0" action="site/search.html">
            <input
              class="form-control mr-sm-2"
              type="search"
              aria-label="Search"
            />
            <button class="btn btn-outline-light my-2 my-sm-0" type="submit">
              搜索
            </button>
          </form>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import { getToken, removeToken } from "@/utils/auth";
import { userInfoAPI, loginOutAPI } from "@/api/user";
import "@/style/bootstrap.min.css";
import { ArrowDown } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
const user = {};
export default {
  data() {
    return {
      user: user,
    };
  },
  beforeCreate() {
    userInfoAPI(getToken()).then((res) => {
      this.user = res.data.data;
    });
  },
  mounted() {},
  methods: {
    loginOut() {
      loginOutAPI(getToken())
        .then((res) => {
          if (res.data.code == 0) {
            ElMessage({
              duration: 1000,
              type: "success",
              message: res.data.msg,
            });
            removeToken();
            this.user = null;
            this.$router.push("/");
          } else {
            ElMessage({
              duration: 1000,
              type: "error",
              message: "退出登录失败！",
            });
          }
        })
        .catch((e) => {
          ElMessage({ duration: 1000, type: "error", message: e });
        });
    },
  },
};
</script>
<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
