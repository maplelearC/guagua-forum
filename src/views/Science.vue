<template>
    <div class="body">
        <div class="nk-container">
            <!-- 头部 -->
            <Header></Header>

            <!-- 内容 -->
            <div class="main">
                <div class="container">
                    <div class="position-relative">
                        <!-- 筛选条件 -->
                        <ul class="nav nav-tabs mb-3">
                            <li class="nav-item">
                                <a class="nav-link" :class="order === 0 ? 'active' : ''" @click="active(0)" href="#">最新</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" :class="order === 1 ? 'active' : ''" @click="active(1)" href="#">最热</a>
                            </li>
                        </ul>
                        <button v-if="loginUser != null" type="button" @click="dialogVisible = true"
                            class="btn btn-primary btn-sm position-absolute rt-0" data-toggle="modal"
                            style="background-color: #f9d04a; color: #4a73f9;" data-target="#publishModal">
                            我要发布
                        </button>
                    </div>
                    <!-- 弹出框 -->
                    <el-dialog v-model="dialogVisible" title="新帖发布" width="30%" :before-close="handleClose">

                        <form>
                            <div class="form-group">
                                <label for="recipient-name" class="col-form-label">标题：</label>
                                <input v-model="this.discussPost.title" type="text" class="form-control"
                                    id="recipient-name" />
                            </div>
                            <div class="form-group">
                                <label for="message-text" class="col-form-label">正文：</label>
                                <textarea v-model="this.discussPost.content" class="form-control" id="message-text"
                                    rows="15"></textarea>
                            </div>
                        </form>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button @click="dialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="confirm">
                                    发布
                                </el-button>
                            </span>
                        </template>
                    </el-dialog>


                    <!-- 帖子列表 -->
                    <ul class="list-unstyled" v-loading="loading">
                        <li class="media pb-3 pt-3 mb-3 border-bottom" v-for="(item, index) in listData" :key="index">
                            <router-link :to="{ path: '/profile', query: { userId: item.user.id } }">
                                <img :src="item.user.headerUrl" class="mr-4 rounded-circle" alt="用户头像"
                                    style="width: 50px; height: 50px" />
                            </router-link>
                            <div class="media-body">
                                <h6 class="mt-0 mb-3">
                                    <router-link :to="{ path: '/discuss-detail', query: { id: item.post.id } }"
                                        style="color: #000;text-decoration: none;">{{ item.post.title
                                        }}&nbsp;&nbsp;</router-link>
                                    <span class="badge badge-secondary bg-primary" v-if="item.post.type == 1">置顶</span>
                                    <span class="badge badge-secondary bg-danger" v-if="item.post.status == 1">精华</span>
                                </h6>
                                <div class="text-muted font-size-12">
                                    <u class="mr-3">{{ item.user.username }}</u> 发布于 <b>{{ item.post.createTime.substring(0,
                                        10) + " " +
                                        item.post.createTime.substring(11, 19) }}</b>
                                    <ul class="d-inline float-right">
                                        <li class="d-inline ml-2">赞 {{ item.likeCount }}</li>
                                        <li class="d-inline ml-2">|</li>
                                        <li class="d-inline ml-2">回帖 {{ item.post.commentCount }}</li>
                                    </ul>
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

import { homeAPI, publishAPI } from '@/api/discuss_post';
import { userInfoAPI } from '@/api/user';
import qs from "qs";
import { getToken } from '@/utils/auth'
import { ElMessage } from "element-plus";
export default {
    data() {
        return {
            listData: [],
            dialogVisible: false,
            order: 0,
            loading: true,
            total: 0,   //数据的总条数
            page: 2,   //当前第几页
            limit: 5,   //页面展示数据条数
            // discussPost: {}
            discussPost: {
                title: "",
                content: "",
            },
            loginUser: {},
        }
    },
    methods: {


        //获取接口数据
        getListData(page, limit, order) {
            var that = this;
            that.loading = true;
            homeAPI(page, limit, order).then(res => {
                this.listData = res.data.data.discussPosts;
                console.log(res.data.data);
                this.total = res.data.data.count
                that.loading = false;
            }).catch(error => {
                ElMessage({ type: "error", message: error });
            })
        },
        //点击分页器的某一页按钮的回9调
        handleCurrentChange(page) {
            this.page = page;
            this.getListData(this.page, this.limit, this.order)
        },

        //点击分页器的limit的回调
        handleSizeChange(limit) {
            this.limit = limit;
            this.getListData(this.page, this.limit, this.order)
        },
        active(index) {
            this.order = index
            this.getListData(this.page, this.limit, this.order)
        },
        handleClose(done) {
            done();
        },
        confirm() {
            this.dialogVisible = false;
            this.publish(this.discussPost)
        },
        publish(post) {
            let title = post.title
            let content = post.content
            publishAPI(qs.stringify({ title, content }), getToken()).then(res => {
                ElMessage({ type: "success", message: res.data.msg });
                this.getListData(this.page, this.limit, this.order)
            }).catch(e => {
                ElMessage({ type: "error", message: e });
            })
        }
    },
    mounted() {
        userInfoAPI(getToken()).then((res) => {
            this.loginUser = res.data.data
        })
        this.getListData(this.page, this.limit, this.order)
    }
}
</script>