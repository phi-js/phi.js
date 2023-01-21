<script setup>
import { UiTreeExplorer } from '.'
import tree from '../UiTree/sample.js'

</script>

<template>
  <div class="UiTreeExplorer-docs">
    <h1>UiTreeExplorer</h1>
    <p>A <strong>tree</strong> is an <strong>Array</strong> of <strong>nodes</strong></p>
    <p>A <strong>node</strong> is an <strong>Objects</strong> that <em>may</em> have a <strong>children</strong> property</p>

    <UiTreeExplorer
      :value="tree"
    />
    <hr>

    <UiTreeExplorer
      :value="tree"
      :path="[2,1,2]"
    />
    <hr>

    <UiTreeExplorer :value="tree">
      <template #item="{ item, hasChildren, navigate }">
        <li>
          <span>Hola soy {{ item.text }}</span>
          <button
            v-if="hasChildren"
            type="button"
            @click="navigate()"
          >
            ENTER
          </button>
        </li>
      </template>
    </UiTreeExplorer>
    <hr>

    More content
  </div>
</template>

<style lang="scss">
.UiTreeExplorer-docs {
  .UiTreeExplorer {
    border: 2px solid red;
    width: 300px;
  }
}
</style>