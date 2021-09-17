```js
import records from './records.js';
let selection = null;
let selectionArr = [];

<section>
  <select
    class="ui-native"
    v-model="selection"
  >
    <option
      v-for="record in records"
      :key="record.id"
      :value="record.id"
      v-text="record.name"
    ></option>
  </select>

  <UiSelect
    v-model="selection"
    placeholder="Selecciona una persona"
    :data="records"
    option-value="$.id"
    option-text="$.name"
    option-subtext="$.email"
  />

  <pre>selection: {{selection}}</pre>
</section>

<section>
  <select
    class="ui-native"
    multiple
    v-model="selectionArr"
  >
    <option
      v-for="record in records"
      :key="record.id"
      :value="record.id"
      v-text="record.name"
    ></option>
  </select>

  <UiSelect
    multiple
    v-model="selectionArr"
    placeholder="Selecciona varias personas"
    :data="records"
    option-value="$.id"
    option-text="$.name"
    option-subtext="$.email"
  />

  <pre>selectionArr: {{selectionArr}}</pre>
</section>
```

Con SLOTS
```js
import records from './records.js';
let selection = null;

<UiSelect
  multiple
  v-model="selection"
  placeholder="Selecciona una persona"
  :data="records"
  option-value="$.id"
  option-text="$.name"
  max-chips="0"
>
  <template #chip="{ item, value, text, subtext, deselect, toggle, isFocused, toggleDialog }">
    <div>
      <span @click="toggleDialog">Mr {{ item.email }}</span>
      <button type="button" @click="deselect">&times;</button>
    </div>
  </template>

  <template #aggregator="{ options }">
    <div>Uff hay {{ options.length }} personas</div>
    <div>{{ options.map(opt => opt.item.email).join(', ') }}</div>
  </template>

  <template #option="{ item, value, text, subtext, isSelected, select, deselect, toggle, isFocused }">
    <label class="ui-clickable">
      <input type="checkbox" :checked="isSelected" @click="toggle"></input>
      {{value}}: {{ item.email }} | {{ text }}
    </label>
  </template>
</UiSelect>

<pre>selection: {{selection}}</pre>
```