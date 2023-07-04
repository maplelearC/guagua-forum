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
                            <li class="nav-item">
                                <a class="nav-link position-relative" :class="{
                                    active: type == 'followees'
                                }" @click="activeFollowees"><i class="text-info">{{
    user.username }}</i> 关注的人</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link position-relative" :class="{
                                    active: type == 'followers'
                                }" @click="activeFollowers">关注 <i class="text-info">{{
    user.username }}</i> 的人</a>
                            </li>
                        </ul>
                        <router-link :to="{ path: '/profile', query: { userId: user.id } }"
                            class="text-muted position-absolute rt-0">返回个人主页&gt;</router-link>
                    </div>

                    <!-- 关注列表 -->
                    <ul class="list-unstyled">
                        <li class="media pb-3 pt-3 mb-3 border-bottom position-relative" v-for="(follow, index) in follows"
                            :key="index">

                            <a href="profile.html">
                                <img :src="follow.user.headerUrl" class="mr-4 rounded-circle user-header" alt="用户头像">
                            </a>
                            <div class="media-body">
                                <h6 class="mt-0 mb-3">
                                    <span class="text-success">{{ follow.user.username }}</span>
                                    <span class="float-right text-muted font-size-12">关注于 <i>{{ follow.followTime
                                    }}</i></span>
                                </h6>
                                <div>
                                    <button type="button" class="btn btn-info btn-sm float-right mr-5 follow-btn"
                                        v-if="loginUser == null || (loginUser.id != follow.user.id && !follow.hasFollow)"
                                        @click="follow">关注TA</button>
                                    <button type="button" class="btn btn-info btn-sm float-right mr-5 follow-btn"
                                        v-if="loginUser != null && loginUser.id != follow.user.id && follow.hasFollow"
                                        style="background-color: aliceblue; border: 0px;" @click="unFollow">已关注</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <!-- 分页 -->
                    <el-pagination style="margin-top: 15px;text-align: center" :current-page="page"
                        :page-sizes="[5, 10, 15]" :page-size="limit" layout="prev,pager,next,jumper,->,sizes,total"
                        @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="total">
                    </el-pagination>
                </div>
            </div>

            <!-- 尾部 -->
            <Footer></Footer>
        </div>
    </div>
</template>
  
<script>
import { followeesAPI, followAPI, followersAPI, userInfoAPI } from '@/api/user';
import { ElMessage } from "element-plus";
import { getToken } from '@/utils/auth'
import qs from "qs";
export default {
    data() {
        return {
            type: "",
            total: 0,   //数据的总条数
            page: 1,   //当前第几页
            limit: 5,   //页面展示数据条数

            userId: 0,
            user: {},
            loginUser: {},
            follows: [],
        };
    },
    mounted() {
        let that = this
        userInfoAPI(getToken()).then((res) => {
            this.loginUser = res.data.data
        })


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
        var types = this.getUrlCode("types");
        console.log(types)

        if (types == 0) {
            this.type = "followees"
        }
        if (types == 1) {
            this.type = "followers"
        }
        this.userId = parseInt(userId)


        this.getFollows(this.page, this.limit)
    },
    methods: {
        getFollows(current, limit) {
            console.log(this.type)
            if (this.type == "followees") {

                followeesAPI(getToken(), current, limit, this.userId).then(res => {
                    if (res.data.code == 1) {
                        ElMessage({ type: "error", message: res.data.msg });
                        return
                    }
                    console.log(res)
                    this.user = res.data.data.user
                    this.follows = res.data.data.users
                    this.total = res.data.data.count
                })
            } else if (this.type == "followers") {
                followersAPI(getToken(), current, limit, 151).then(res => {
                    if (res.data.code == 1) {
                        ElMessage({ type: "error", message: res.data.msg });
                        return
                    }
                    console.log(res)
                    this.user = res.data.data.user
                    this.follows = res.data.data.users
                    this.total = res.data.data.count
                })
            }
        },
        //点击分页器的某一页按钮的回9调
        handleCurrentChange(page) {
            this.page = page;
            this.getFollows(this.page, this.limit)
        },

        //点击分页器的limit的回调
        handleSizeChange(limit) {
            this.limit = limit;
            this.getFollows(this.page, this.limit)
        },
        activeFollowees() {
            this.type = "followees"
            this.getFollows(this.page, this.limit)
        },
        activeFollowers() {

            this.type = "followers"

            this.getFollows(this.page, this.limit)
        },
        follow() {
            let entityId = this.user.id
            let entityType = 3
            followAPI(getToken(), qs.stringify({ entityId, entityType })).then(res => {
                this.followerCount++
                this.hasFollowed = true
                ElMessage({ type: "success", message: res.data.msg });
            }).catch(e => {
                ElMessage({ type: "error", message: e });
            })
        },
        unFollow() {
            let entityId = this.user.id
            let entityType = 3
            unfollowAPI(getToken(), qs.stringify({ entityId, entityType })).then(res => {
                this.followerCount--
                this.hasFollowed = false
                ElMessage({ type: "success", message: res.data.msg });
            }).catch(e => {
                ElMessage({ type: "error", message: e });
            })
        }
    }
}
</script>
  