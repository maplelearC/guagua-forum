<template>
  <div class="body">
    <div class="nk-container">
      <!-- 头部 -->
      <header class="sticky-top header-bg">
        <div class="container">
          <!-- 导航 -->
          <nav class="navbar">
            <!-- logo -->
            <a class="navbar-brand" href="#"></a>
            <router-link
              to="/home"
              style="margin-left: auto; color: black; font-size: 20px"
              >首页
            </router-link>
            <!-- 功能 -->
          </nav>
        </div>
      </header>
      <!-- 内容 -->
      <div class="main">
        <div class="login-register">
          <!--    contai为主容器-->
          <div class="contain">
            <!--      big contain为主部件-->
            <!--      big-box为实现页面跳转，通过active和islogin实现-->
            <div class="big-box" :class="{ active: isLogin }">
              <!--        登录处理-->
              <div class="big-contain" v-if="isLogin">
                <div class="btitle">账号登录</div>
                <div class="bform">
                  <br />
                  <br />
                  <input
                    class="textarea"
                    type="text"
                    autocomplete="on"
                    style="margin-bottom: 20px"
                    placeholder="账号"
                    v-model="this.form.username"
                  />
                  <input
                    class="textarea"
                    type="password"
                    autocomplete="on"
                    placeholder="密码"
                    v-model="this.form.password"
                  />
                  <div class="textarea">
                    <input
                      type="text"
                      style="width: 60%"
                      placeholder="验证码"
                      v-model="this.form.code"
                    />
                    &nbsp;&nbsp;&nbsp;<img
                      @click="refresh_kaptcha"
                      style="width: 100px; height: 30px; margin-top: -10px"
                      ref="code"
                      src="http:///localhost:8081/community/kaptcha"
                    />
                  </div>
                  <div class="textarea" style="margin-right: 100px">
                    <el-checkbox v-model="this.checked"
                      >是否记住此用户
                    </el-checkbox>
                    <router-link
                      to="/setting"
                      style="margin-left: 200px; color: black"
                      >忘记密码？
                    </router-link>
                  </div>
                </div>
                <br />
                <br />
                <button class="bbutton" @click="login">登录</button>
              </div>
              <!--注册处理-->
              <div class="big-contain" v-else>
                <div class="btitle">创建账户</div>
                <div class="bform">
                  <input
                    type="text"
                    class="textarea"
                    autocomplete="on"
                    placeholder="账号"
                    v-model="form.username"
                  />
                  <input
                    type="password"
                    class="textarea"
                    placeholder="8-16位密码"
                    v-model="form.password"
                  />
                  <input
                    type="password"
                    class="textarea"
                    placeholder="确认密码"
                    v-model="rePassword"
                  />
                  <input
                    type="email"
                    class="textarea"
                    autocomplete="on"
                    placeholder="邮箱"
                    v-model="form.email"
                  />
                </div>
                <button
                  class="bbutton"
                  @click="register"
                  style="display: inline"
                >
                  注册
                </button>
                :
                <button
                  class="bbutton"
                  @click="returnhome"
                  style="display: inline"
                >
                  返回
                </button>
              </div>
              <!--        页面翻转-->
            </div>
            <div class="small-box" :class="{ active: isLogin }">
              <div class="small-contain" v-if="isLogin">
                <div class="stitle">欢迎回家小瓜子！</div>
                <p class="scontent">如果没有账号，请先注册</p>
                <button class="sbutton" @click="changeType">注册</button>
              </div>
              <div class="small-contain" v-else>
                <div class="stitle">欢迎光临小瓜子！</div>
                <p class="scontent">若有账号，请立即登录</p>
                <button class="sbutton" @click="changeType">登录</button>
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
import { setToken } from "@/utils/auth";
import { Base64 } from "js-base64";
import { loginAPI, registerAPI } from "@/api/user";
import { ElMessage } from "element-plus";
import qs from "qs";

export default {
  name: "login-register",
  data() {
    return {
      isLogin: false,
      existed: false,
      checked: false,
      rePassword: "",
      errorMsg: "",
      Msg: null,
      ticket: "",
      form: {
        username: "",
        password: "",
        email: "",
        code: "",
        rememberMe: "true",
      },
    };
  },

  mounted() {
    this.getRemembered();
  },

  methods: {
    changeType() {
      this.isLogin = !this.isLogin;
      if (!this.isLogin) {
        this.remember();
      }

      this.form.username = "";
      this.form.email = "";
      this.form.password = "";
      if (this.isLogin) this.getRemembered();
    },
    /* returnhome() {
       this.$router.push("/home");
     } ,
     */
    login() {
      const { username, password, code } = this.form;
      const errorMessages = {
        username: "账号不能为空",
        password: "密码不能为空",
        code: "验证码不能为空",
      };

      for (const errorMessage in errorMessages) {
        if (!this.form[errorMessage]) {
          ElMessage({ type: "error", message: errorMessages[errorMessage] });
          return;
        }
      }
      loginAPI(qs.stringify({ username, password, code }))
        .then((response) => {
          // 处理登录成功逻辑，例如保存用户信息、跳转到首页等
          const data = response.data.data;
          if (response.data.code === 0) {
            ElMessage({ duration: 1000, type: "success", message: "登录成功" });
            setToken(data.ticket);
            this.remember();
            this.$router.push("/home");
          } else {
            const errorMsg =
              data.kaptachadMsg || data.usernameMsg || data.passwordMsg;
            if (errorMsg) {
              ElMessage({ duration: 1000, type: "error", message: errorMsg });
            }
          }
        })
        .catch((error) => {
          ElMessage({ duration: 1000, type: "error", message: error });
        });
    },
    //登录时向后端发送请求，得到用户的id和姓名来进行下一步渲染
    islogin() {
      const self = this;
      self
        .$axios({
          method: "get",
          //url一律要再次修改
          url: "/user",
        })
        .then((result) => {
          //存储用户nickname
          this.$store.commit("saveNickname", result.data.data.nickName);
        });
    },
    register() {
      const { username, password, email } = this.form;

      //此步为跳转，应该在注册后执行，先放在这
      // this.$router.push("/index")
      if (this.form.email === "" || this.form.password === "") {
        ElMessage({ duration: 1000, type: "error", message: "填写不能为空！" });
        return;
      }
      if (this.form.username === "") {
        ElMessage({
          duration: 1000,
          type: "error",
          message: "请输入正确的账户",
        });
        return;
      }
      if (!this.validEmail()) {
        ElMessage({
          duration: 1000,
          type: "error",
          message: "请输入正确的邮箱",
        });
        return;
      }
      if (!this.finiteLengthPassword()) {
        ElMessage({
          duration: 1000,
          type: "error",
          message: "请输入8-16位的密码",
        });
        return;
      }
      if (this.form.password !== this.rePassword) {
        ElMessage({
          duration: 1000,
          type: "error",
          message: "两次输入密码不一致",
        });
        return;
      }
      // form-data 请求

      registerAPI(qs.stringify({ username, password, email }))
        .then((response) => {
          const data = response.data.data;
          console.log(response);
          if (response.data.code === 0) {
            ElMessage({
              duration: 1000,
              type: "success",
              message: response.data.msg,
            });
            //setToken(data.ticket)
          } else if (data.usernameMsg !== null) {
            ElMessage({
              duration: 1000,
              type: "error",
              message: data.usernameMsg,
            });
          } else if (data.emailMsg !== null) {
            ElMessage({
              duration: 1000,
              type: "error",
              message: data.emailMsg,
            });
          }
        })
        .catch((error) => {
          ElMessage({ duration: 1000, type: "error", message: error });
        });
      this.remember();
    },

    //验证邮箱是否合法
    validEmail() {
      var verify = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
      return verify.test(this.form.email);
    },
    //验证密码长度是否合法
    finiteLengthPassword() {
      if (this.form.password != null) {
        var length1 = this.form.password.length;
      }
      if (length1 >= 16 || length1 < 8) {
        return false;
      }
      return true;
    },
    remember() {
      /* ------ 账号密码的存储 ------ */
      if (this.checked) {
        console.log("username" + this.form.username);
        let password = Base64.encode(this.form.password); // base64加密
        localStorage.setItem("username", this.form.username);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
      }
    },
    getRemembered() {
      let username = localStorage.getItem("username");
      if (username) {
        this.form.username = localStorage.getItem("username");
        this.form.password = Base64.decode(localStorage.getItem("password")); // base64解密
        this.checked = true;
      }
    },
    refresh_kaptcha() {
      this.$refs.code.src =
        "http://localhost:8081/community/kaptcha?time=" + Date.now();
      //"http://114.55.254.24:8081/community/kaptcha?time=" + Date.now();
    },
  },
};
</script>

<style scoped>
.login-register {
  width: 100vw;
  height: 100vh;
  /* box-sizing: border-box;
  background-color: antiquewhite; */
  /* background: url("../assets/background.png") no-repeat 100%; */
}

.contain {
  width: 60%;
  height: 60%;
  position: relative;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 0 3px #f0f0f0, 0 0 6px #f0f0f0;
}

.big-box {
  width: 70%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 30%;
  transform: translateX(0%);
  transition: all 1s;
}

.big-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.btitle {
  font-size: 2em;
  font-weight: bold;
  color: rgb(57, 167, 176);
}

.bform {
  width: 100%;
  height: 40%;
  padding: 2em 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}

.textarea {
  display: block;
  margin-left: 25%;
  margin-bottom: 10px;
  padding-bottom: 10px;
  padding-top: 10px;
}

.bform .errTips {
  display: block;
  width: 50%;
  text-align: left;
  color: red;
  font-size: 0.7em;
  margin-left: 1em;
}

.bform input {
  width: 50%;
  height: 30px;
  border: none;
  outline: none;
  border-radius: 10px;
  padding-left: 2em;
  background-color: #f0f0f0;
}

.bbutton {
  width: 20%;
  height: 40px;
  border-radius: 24px;
  border: none;
  outline: none;
  background-color: rgb(57, 167, 176);
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
}

.small-box {
  width: 30%;
  height: 100%;
  background: linear-gradient(135deg, rgb(57, 167, 176), rgb(56, 183, 145));
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(0%);
  transition: all 2s;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}

.small-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stitle {
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
}

.scontent {
  font-size: 0.8em;
  color: #fff;
  text-align: center;
  padding: 2em 4em;
  line-height: 1.7em;
}

.sbutton {
  width: 60%;
  height: 40px;
  border-radius: 24px;
  border: 1px solid #fff;
  outline: none;
  background-color: transparent;
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
}

.big-box.active {
  left: 0;
  transition: all 2s;
}

.small-box.active {
  left: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  transform: translateX(-100%);

  transition: all 2s;
}
</style>
