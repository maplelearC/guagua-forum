<template>
  <Header></Header>
  <div class="body">
    <div class="nk-container">
      <!-- 内容 -->
      <div class="main">
        <div class="container p-5 mt-3 mb-3">
          <!-- 上传头像 -->
          <h6 class="text-left text-info border-bottom pb-2" v-show="user">
            上传头像
          </h6>
          <div class="mt-5" v-show="user">
            <div class="form-group row mt-4">
              <label class="col-sm-2 col-form-label text-right"
                >选择头像:</label
              >
              <div class="col-sm-10">
                <div class="custom-file">
                  <input
                    type="file"
                    class="custom-file-input"
                    id="head-image"
                    lang="es"
                    accept="image/*"
                    required=""
                    @change="handleFileChange"
                  />
                  <label
                    class="custom-file-label"
                    for="head-image"
                    data-browse="文件"
                    placeholder="请输入内容"
                    >{{ avater?.name ? avater?.name : "请选择一张图片" }}</label
                  >
                </div>
              </div>
            </div>
            <div class="form-group row mt-4">
              <div class="col-sm-2"></div>
              <div class="col-sm-10 text-center">
                <button
                  class="btn btn-info text-white form-control"
                  @click="updateavatar"
                  style="background-color: rgb(10, 202, 129)"
                >
                  立即上传
                </button>
              </div>
            </div>
          </div>
          <!-- 修改密码 -->
          <h6 class="text-left text-info border-bottom pb-2 mt-5">修改密码</h6>
          <div class="mt-5">
            <div class="form-group row mt-4">
              <label
                for="old-password"
                class="col-sm-2 col-form-label text-right"
                >原密码:</label
              >
              <div class="col-sm-10">
                <input
                  type="password"
                  v-model="oldpassword"
                  class="form-control"
                  id="old-password"
                  placeholder="请输入原始密码!"
                  required
                />
                <div class="invalid-feedback">密码长度不能小于8位!</div>
              </div>
            </div>
            <div class="form-group row mt-4">
              <label
                for="new-password"
                class="col-sm-2 col-form-label text-right"
                >新密码:</label
              >
              <div class="col-sm-10">
                <input
                  type="password"
                  v-model="newpassword"
                  class="form-control"
                  id="new-password"
                  placeholder="请输入新的密码!"
                  required
                />
                <div class="invalid-feedback">密码长度不能小于8位!</div>
              </div>
            </div>
            <div class="form-group row mt-4">
              <label
                for="confirm-password"
                class="col-sm-2 col-form-label text-right"
                >确认密码:</label
              >
              <div class="col-sm-10">
                <input
                  type="password"
                  v-model="renewpassword"
                  class="form-control"
                  id="confirm-password"
                  placeholder="再次输入新密码!"
                  required
                />
                <div class="invalid-feedback">两次输入的密码不一致!</div>
              </div>
            </div>
            <div class="form-group row mt-4">
              <div class="col-sm-2"></div>
              <div class="col-sm-10 text-center">
                <button
                  class="btn btn-info text-white form-control"
                  @click="updatepassword"
                  style="background-color: rgb(10, 202, 129)"
                >
                  立即保存
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<script>
import { updatepasswordAPI, updateavatarAPI, userInfoAPI } from "@/api/user";
import { getToken } from "@/utils/auth";
import { ElMessage } from "element-plus";
import qs from "qs";
export default {
  name: "Setting",
  data() {
    return {
      user: {},
      avater: null,
      oldpassword: "",
      newpassword: "",
      renewpassword: "",
    };
  },
  beforeCreate() {
    userInfoAPI(getToken()).then((res) => {
      this.user = res.data.data;
    });
  },
  methods: {
    handleFileChange(event) {
      this.avater = event.target.files[0];
    },
    updateavatar() {
      const headerImage = new FormData();
      headerImage.append("headerImage", this.avater);

      updateavatarAPI(getToken(), headerImage)
        .then((response) => {
          console.log(response);
          if (response.data.code == 0)
            ElMessage({ type: "success", message: "上传成功！" });
          else ElMessage({ type: "error", message: "上传失败！" });
        })
        .catch((error) => {
          ElMessage({ type: "error", message: error });
        });
    },

    updatepassword() {
      let oldPassword = this.oldpassword;
      let newPassword = this.newpassword;
      let renewPassword = this.renewpassword;
      if (oldPassword === "" || newPassword === "") {
        ElMessage({ duration: 1000, type: "error", message: "输入不能为空！" });
        return;
      }
      if (renewPassword !== newPassword) {
        ElMessage({
          duration: 1000,
          type: "error",
          message: "两次密码输入不一致！",
        });
        return;
      }
      if (oldPassword == newPassword) {
        ElMessage({
          duration: 1000,
          type: "error",
          message: "新旧密码不能一致！",
        });
        return;
      }
      updatepasswordAPI(getToken(), qs.stringify({ oldPassword, newPassword }))
        .then((response) => {
          console.log(response.data);
          if (response.data.code == 0) {
            ElMessage({
              type: "success",
              message: "密码修改成功,请重新登录！",
            });
            setTimeout(() => {
              this.$router.push("/login");
            }, 1500);
          } else
            ElMessage({
              type: "error",
              message: response.data.msg
                ? response.data.msg
                : response.data.oldPasswordMsg,
            });
        })
        .catch((error) => {
          ElMessage({ type: "error", message: error });
        });
    },
  },
};
</script>

<style scoped></style>
