Phi.js SERVICE package

Provides components and an API spec to interact with the PHI SERVICE:
A hosted service to store stories, files and data (jsondb)  https://phi.co

<PhiStory
  src="https://phi.co/campestre/rmt/estudiante"
  client-key="xXxXxXxXxXxXx"
  v-model="{foo:'foo'}"
/>

<PhiStoryEditor
  src="https://phi.co/campestre/rmt/estudiante"
  client-key="xXxXxXxXxXxXx"
  v-model="{foo:'foo'}"
/>


Full example:

<PhiStory
  src="https://phi.co/campestre/rmt/estudiante"
  client-key="xXxXxXxXxXxXx"
  v-model="{foo:'foo'}"
>
  <template #loading>
    <h1>Loading your story ....</h1>
  </template>

  <template #error="{ code, message }">
    <h1>Something went wrong</h1>
    <pre>{{ message }}</pre>
  </template>
</PhiStory>