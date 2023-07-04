<template>
  <ul
    class="list-unstyled"
    v-for="(notice, value, index) in notices"
    :key="index"
    v-show="index !== 2 && index !== 4"
  >
    <li class="media pb-3 pt-3 mb-3 border-bottom position-relative">
      <span class="badge badge-danger" v-if="notice?.unread">{{
        notice?.unread
      }}</span>
      <span style="padding-left: 25px" v-else></span>
      <a>
        <img
          :src="notice.user?.headerUrl"
          class="mr-4 rounded-circle user-header"
          alt="用户头像"
        />
      </a>
      <div class="media-body">
        <h6 class="mt-0 mb-3">
          <span class="text-success">{{ notice.user?.username }}</span>
          <span class="float-right text-muted font-size-12">{{
            notice.message?.createTime
          }}</span>
        </h6>
        <div>
          <router-link
            :to="{
              path: '/notice-detail',
              query: { conversationId: notice.message?.conversationId },
            }"
            >{{ notice.message?.content }}</router-link
          >
          <ul class="d-inline font-size-12 float-right">
            <li class="d-inline ml-2">
              <router-link
                :to="{
                  path: '/notice-detail',
                  query: { conversationId: notice.message?.conversationId },
                }"
                class="text-primary"
                >共{{ notice.count }}条会话</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "Notice",
  props: {
    notices: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style scoped></style>
<style>
a {
  color: #000;
  text-decoration: none;
}
</style>
