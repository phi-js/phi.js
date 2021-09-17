```jsx
let item = {
  icon: 'mdi:vuejs',
  text: 'Hola mundo',
  secondary: 'Texto inferior',
};

let clicks = 0;

let onItemClick = function() {
  clicks++;

  item.icon = 'mdi:bug'
  item.text += '*'
  item.secondary = `${clicks} clicks`
}

<select v-model="item.icon">
  <option value="mdi:vuejs">mdi:vuejs</option>
  <option value="mdi:account">mdi:account</option>
  <option value="mdi:star">mdi:star</option>
  <option value="mdi:bug">mdi:bug</option>
</select>
<input type="text" v-model="item.text" />
<input type="text" v-model="item.secondary" />

<UiItem
  class="ui-clickable"
  :icon="item.icon"
  :text="item.text"
  :secondary="item.secondary"

  @click="onItemClick"
/>
```

Estilos
```js

<UiItem
  icon="mdi:star"
  text="Hola mundo"
/>

<UiItem
  style="color: red"
  icon="mdi:star"
  text="Hola mundo"
/>

<UiItem
  style="font-size: 0.7em; border: 1px solid red; border-radius: 20px; padding: 0"
  icon="mdi:star"
  text="Hola mundo"
/>

<UiItem
  style="font-size: 2em; border: 1px solid red; border-radius: 20px;"
  icon="mdi:star"
  text="Hola mundo"
/>

```