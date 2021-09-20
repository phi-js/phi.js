<script setup>
import { ref, onMounted } from 'vue'
import { UiItem } from '/packages/ui/components'
import { useApi } from '/packages/api/'
import {
  default as jpApi,
  users as apiUsers,
  posts as apiPosts
} from '../../api'

const users = ref([])
const posts = ref([])
const $api = useApi(jpApi, { users: apiUsers, posts: apiPosts })

onMounted(() => {
  $api.users.getUsers().then((r) => (users.value = r))
  $api.posts.getPosts().then((r) => (posts.value = r))
})
</script>

<template>
  <div class="PlaceholderTest ui-row --nowrap --top">
    <div>
      <label class="ui-label">Users</label>
      <UiItem
        v-for="user in users"
        :key="user.id"
        :text="user.name"
        :secondary="user.username"
      />
    </div>

    <div>
      <label class="ui-label">Posts</label>
      <UiItem
        v-for="post in posts"
        :key="post.id"
        :text="post.title"
        :secondary="post.body"
      />
    </div>
  </div>
</template>
