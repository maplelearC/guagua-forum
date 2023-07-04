<template>
  <ul class="list-unstyled">
    <li
      class="media pb-3 pt-3 mb-3 border-bottom position-relative"
      v-for="(conversation, index) in conversations"
      :key="index"
    >
      <span class="badge badge-danger" v-if="conversation?.unreadCount">{{
        conversation?.unreadCount
      }}</span>
      <span style="padding-left: 25px" v-else></span>
      <router-link
        :to="{ path: '/profile', query: { userId: conversation.target?.id } }"
      >
        <img
          :src="conversation.target?.headerUrl"
          class="mr-4 rounded-circle user-header"
          alt="用户头像"
        />
      </router-link>
      <div class="media-body">
        <h6 class="mt-0 mb-3">
          <span class="text-success">{{ conversation?.target?.username }}</span>
          <span class="float-right text-muted font-size-12">{{
            conversation?.conversation?.createTime
          }}</span>
        </h6>
        <div>
          <router-link
            :to="{
              path: '/letter-detail',
              query: {
                conversationId: conversation.conversation?.conversationId,
              },
            }"
            >{{ conversation.conversation?.content }}</router-link
          >
          <ul class="d-inline font-size-12 float-right">
            <li class="d-inline ml-2">
              <router-link
                :to="{
                  path: '/letter-detail',
                  query: {
                    conversationId: conversations.conversation?.conversationId,
                  },
                }"
                class="text-primary"
                >共{{ conversation.letterCount }}条会话</router-link
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
  name: "Letter",
  props: {
    conversations: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped></style>
