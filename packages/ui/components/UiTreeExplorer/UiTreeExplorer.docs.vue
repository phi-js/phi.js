<script setup>
import { UiTreeExplorer } from '.'
import UiItem from '../UiItem/UiItem.vue'
import UiTree from '../UiTree/UiTree.vue'
import tree from '../UiTree/sample.js'

</script>

<template>
  <div class="UiTreeExplorer-docs">
    <h1>UiTreeExplorer</h1>
    <p>A <strong>tree</strong> is an <strong>Array</strong> of <strong>nodes</strong></p>
    <p>A <strong>node</strong> is an <strong>Object</strong> that <em>may</em> have a <strong>children</strong> property</p>

    <UiTreeExplorer
      :value="tree"
    />
    <hr>

    <UiTree :value="tree" />
    <hr>

    <UiTree
      :value="tree"
      :path="[2,1,2]"
    />

    <UiTree
      :value="tree"
      :path="[2,1,2]"
    >
      <template #item="{item, hasChildren, navigate}">
        <a
          v-if="item.href"
          class="TreeItem"
          :class="{'TreeItem--active': item.isActive}"
          :href="item.href"
        >
          <UiItem :text="item.text" />
        </a>
        <div
          v-else
          class="TreeItem"
          :class="{'TreeItem--active': item.isActive}"
          @click="navigate()"
        >
          <UiItem
            :icon="item.icon || 'mdi:chevron-right'"
            :text="item.text"
          />
        </div>
      </template>
    </UiTree>
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

  & > .UiTree,
  .UiTreeExplorer {
    border: 2px solid red;
    width: 300px;

    max-height: 200px;
    overflow-y: auto;
  }
}
</style>