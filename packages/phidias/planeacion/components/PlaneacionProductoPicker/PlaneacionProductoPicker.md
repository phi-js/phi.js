```js
let producto = null;
<PlaneacionProductoPicker v-model="producto" />
<pre>producto: {{producto}}</pre>
```

```js
let producto = null;
<PlaneacionProductoPicker 
  v-model="producto" 
  course-sequence="3"
/>
<pre>producto: {{producto}}</pre>
```