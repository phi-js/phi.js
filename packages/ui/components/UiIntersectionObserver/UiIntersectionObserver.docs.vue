<script setup>
import { ref } from 'vue'
import UiIntersectionObserver from './UiIntersectionObserver.vue'

const events = ref([])

function onShow(evt) {
  events.value.push(`onShow: ${evt}`)
}

function onHide(evt) {
  events.value.push(`onHide: ${evt}`)
}
</script>

<template>
  <div class="Docs">
    <h1>UiIntersectionObserver</h1>
    <code>import { UiIntersectionObserver } from '@/packages/ui'</code>
    <p>A Vue component that uses the IntersectionObserver API to detect when an element is visible on the screen. It emits the 'show' event when the element is fully visible and the 'hide' event when it is hidden or occluded.</p>

    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Description</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>threshold</td>
          <td>The threshold at which to trigger the 'show' event. This can be a number between 0 and 1, or a string representing a percentage.</td>
          <td>String or Number</td>
          <td>No</td>
          <td>'0.0'</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Event</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>show</td>
          <td>Emitted when the visible element portion exceeds the threshold and is fully visible on the screen.</td>
        </tr>
        <tr>
          <td>hide</td>
          <td>Emitted when the visible element is below the threshold or occluded by another element.</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Description</th>
          <th>Slot bindings</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>default</td>
          <td>The content to be observed for visibility.</td>
          <td>N/A</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic usage</h3>
    <p>Use the default slot to specify the content to be observed for visibility.</p>
    <pre><code>&lt;UiIntersectionObserver @show="onShow" @hide="onHide"&gt;
  &lt;p&gt;This is the content to be observed for visibility.&lt;/p&gt;
&lt;/UiIntersectionObserver&gt;</code></pre>
    <p>Result:</p>
    <UiIntersectionObserver
      @show="onShow"
      @hide="onHide"
    >
      <p>This is the content to be observed for visibility.</p>
    </UiIntersectionObserver>

    <h3>Changing threshold</h3>
    <p>Change the threshold to trigger the 'show' event at 50% visibility.</p>
    <pre><code>&lt;UiIntersectionObserver threshold="0.5" @show="onShow" @hide="onHide"&gt;
  &lt;p&gt;This is the content to be observed for visibility.&lt;/p&gt;
&lt;/UiIntersectionObserver&gt;</code></pre>
    <p>Result:</p>
    <UiIntersectionObserver
      threshold="0.5"
      @show="onShow"
      @hide="onHide"
    >
      <p>This is the content to be observed for visibility.</p>
    </UiIntersectionObserver>
  </div>

  <div class="HumanDocs">
    <div style="width: 500px; height: 500px; overflow: auto;">
      <!-- !!! --->
      <div style="width: max-content">
        <UiIntersectionObserver
          @show="onShow('top')"
          @hide="onHide('top')"
        />
        <div style="display: flex; flex-wrap: nowrap;">
          <UiIntersectionObserver
            @show="onShow('left')"
            @hide="onHide('left')"
          />
          <div style="flex: 1; white-space: nowrap;">
            <p
              v-for="n in 30"
              :key="n"
            >
              Loremp sdfklsaudhflaksjdfh lksjadhf lksadfh slkadfjh lkasdfh
              lak;sdjfh laskdfh laskdjhfaslkjf hdskjsdfklsaudhflaksjdfh lksjadhf
              lksadfh slkadfjh lkasdfh lak;sdjfh laskdfh laskdjhfaslkjf hdskjsdfkl
              saudhflaksjdfh lksjadhf lksadfh slkadfjh lkasdfh lak;sdjfh laskdfh
              laskdjhfaslkjf hdskjsdfklsaudhflaksjdfh lksjadhf lksadfh slkadfjh
              lkasdfh lak;sdjfh laskdfh laskdjhfaslkjf hdskj
            </p>
          </div>
          <UiIntersectionObserver
            @show="onShow('right')"
            @hide="onHide('right')"
          />
        </div>
        <UiIntersectionObserver
          @show="onShow('bottom')"
          @hide="onHide('bottom')"
        />
      </div>
    </div>

    <ul>
      <li
        v-for="(e, i) in events.slice().reverse()"
        :key="i"
      >
        {{ e }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.UiIntersectionObserver {
  min-width: 1px;
  min-height: 1px;
}
</style>