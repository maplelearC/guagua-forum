<template>
    <div class="body">
        <div class="nk-container">
            <!-- 头部 -->
            <Header></Header>

            <!-- 内容 -->
            <div class="main">
                <div class="container">
                    您的账号已激活，正在跳转登录...
                    <br />
                    <br />
                    <br />
                </div>
            </div>

            <!-- 尾部 -->
            <Footer></Footer>
        </div>
    </div>
</template>
  
<script>
import { activationAPI } from '@/api/user';
import { ElMessage } from "element-plus";
export default {
    data() {
        return {

        };
    },
    mounted() {
        var that = this
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
        }
        var userId = this.getUrlCode("userId");
        var code = this.getUrlCode("code");
        console.log(userId)
        console.log(code)
        activationAPI(userId, code).then((res) => {
            let data = res.data
            if (data.code == 1) {
                console.log(data);
                ElMessage({ type: "error", message: data.msg });
            }
            if (data.code == 0) {
                console.log(data);
                ElMessage({ type: "success", message: data.msg });

            }
        })
        setTimeout(function () {
            that.$router.push("/login");
        }, 3000); // 定时时间
    }
}
</script>
  