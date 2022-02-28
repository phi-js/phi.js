<script setup>
import { ref, onMounted } from 'vue'
import { UiItem, UiInput } from '@/packages/ui/components'
import { useApi } from '@/packages/api/'

import { users, posts } from '../../api'
const $api = useApi({ users, posts })

const arrUsers = ref([])
const arrPosts = ref([])

onMounted(() => {
  $api.users.getUsers().then((r) => (arrUsers.value = r))
  $api.posts.getPosts().then((r) => (arrPosts.value = r))
})
</script>

<template>
  <div class="PlaceholderTest UiGroup">
    <div>
      <label>Users</label>
      <UiInput
        type="select"
        :options="arrUsers"
        option-value="$.id"
        option-text="$.username"
      />
      <UiItem
        v-for="user in arrUsers"
        :key="user.id"
        :text="user.name"
        :subtext="user.username"
      />
    </div>

    <div>
      <label>Posts</label>

      <UiInput
        type="select"
        :options="arrPosts"
        option-value="$.id"
        option-text="$.title"
      />

      <UiItem
        v-for="post in arrPosts"
        :key="post.id"
        :text="post.title"
        :subtext="post.body"
      />
    </div>
  </div>
</template>
