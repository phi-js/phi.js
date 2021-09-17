## UiTable
Reemplazo para UiDataTable, con soporte para componentes UiColumn hijos con slots

```js
import records from './records.js';

var total = 0;
var nImages = 1;
var name = 'Hey';

<button @click="total--" :disabled="total == 0">-</button>
<button @click="total++">+</button>

<!-- :key="total" hace que el componente se re-renderize cuando cambie total de columnas -->
<UiTable
  :key="total"
  :data="records"
>
  <UiColumn title="ID" value="$.id" />

  <UiColumn title="Apellido" v-slot="{item}">{{ item.person.lastName }}</UiColumn>

  <UiColumn title="Nombre" v-slot="{item}">{{ item.person.firstName }}</UiColumn>

  <UiColumn title="UiItem" v-slot="{ item }">
    <UiItem
      :icon="item.person.avatar"
      :text="item.person.firstName"
      :secondary="item.person.lastName"
    />
  </UiColumn>

  <UiColumn title="(e)Nombre" v-slot="{ item }">
    <input type="text" v-model="item.person.firstName" />
  </UiColumn>

  <UiColumn>
    <template #header>
      <input type="text" v-model="name" />
      <UiItem icon="mdi:android" :text="name" />
    </template>
    <template #default="{ item }">
      <img :src="item.image" style="max-width: 120px; max-height: 120px" />
    </template>
  </UiColumn>

  <UiColumn>
    <template #header>
      <input type="number" v-model="nImages" />
    </template>
    <template #default="{ item }">
      <div style="display: flex; flex-wrap: wrap">
        <img
          v-for="(img,i) in item.manyImages.slice(0, nImages)"
          :src="img"
          style="max-width: 120px; max-height: 120px"
        />
      </div>
    </template>
  </UiColumn>

  <UiColumn v-for="n in total" :key="n">
    <template #header>{{n}} Header</template>
    <template #content="{ item }"><pre>n:{{n}}, item:{{item}}</pre></template>
  </UiColumn>
</UiTable>
```