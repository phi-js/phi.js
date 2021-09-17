```js
<UiIcon value="mdi:star" />

<UiIcon value="mdi:star" style="font-size: 0.5em; color:red" />
<UiIcon value="mdi:star" style="font-size: 1em; color:orange" />
<UiIcon value="mdi:star" style="font-size: 2em; color:green" />
<UiIcon value="mdi:star" style="font-size: 4em; color:blue" />
<UiIcon value="mdi:star" style="font-size: 8em; color:purple" />
```

```js
<div>
  <UiIcon value="text:H" style="color:red" />
  <UiIcon value="text:E" style="color:orange" />
  <UiIcon value="text:L" style="color:green" />
  <UiIcon value="text:L" style="color:blue" />
  <UiIcon value="text:0" style="color:purple" />
</div>

<div style="font-size: 3em">
  <UiIcon value="text:H" style="color:red" />
  <UiIcon value="text:E" style="color:orange" />
  <UiIcon value="text:L" style="color:green" />
  <UiIcon value="text:L" style="color:blue" />
  <UiIcon value="text:0" style="color:purple" />
</div>
```


BUG (?!)  En provider/Text.vue, al intentar poner
un font-size dependiendo de la longitud del texto,
elementos continuos no quedan bien alineados:
```js
<div style="font-size: 4em">
  <UiIcon value="text:A" />
  <UiIcon value="text:AC" style="color:red" />
  <UiIcon value="text:ACD" style="color:orange" />
  <UiIcon value="text:ACDE" style="color:green" />
  <UiIcon value="text:ACDES" style="color:blue" />
  <UiIcon value="text:Oh hello" style="color:purple" />
  <UiIcon value="text:Oh hello there" />
</div>
```

```js
<div>
  <h1>Un texto <UiIcon value="mdi:star" /> por aqui</h1>
  <h2>Un texto <UiIcon value="mdi:star" /> por aqui</h2>
  <h3>Un texto <UiIcon value="mdi:star" /> por aqui</h3>
  <h4>Un texto <UiIcon value="mdi:star" /> por aqui</h4>
  <p>Un texto <UiIcon value="mdi:star" /> por aqui</p>
</div>

<div style="font-size: 12px">
  <h1>Un texto <UiIcon value="mdi:star" /> por aqui</h1>
  <h2>Un texto <UiIcon value="mdi:star" /> por aqui</h2>
  <h3>Un texto <UiIcon value="mdi:star" /> por aqui</h3>
  <h4>Un texto <UiIcon value="mdi:star" /> por aqui</h4>
  <p>Un texto <UiIcon value="mdi:star" /> por aqui</p>
</div>
```

```js
const imgSrc = "https://core.phidias.co/interface/xhtml/img/countries/co.png";

<UiIcon :value="imgSrc" />
<UiIcon :value="imgSrc" style="font-size: 2em" />
<UiIcon :value="imgSrc" style="font-size: 3em" />

<div>
  <h1>Un texto <UiIcon :value="imgSrc" /> por aqui</h1>
  <h2>Un texto <UiIcon :value="imgSrc" /> por aqui</h2>
  <h3>Un texto <UiIcon :value="imgSrc" /> por aqui</h3>
  <h4>Un texto <UiIcon :value="imgSrc" /> por aqui</h4>
  <p>Un texto <UiIcon :value="imgSrc" /> por aqui</p>
</div>

<div style="font-size: 12px">
  <h1>Un texto <UiIcon :value="imgSrc" /> por aqui</h1>
  <h2>Un texto <UiIcon :value="imgSrc" /> por aqui</h2>
  <h3>Un texto <UiIcon :value="imgSrc" /> por aqui</h3>
  <h4>Un texto <UiIcon :value="imgSrc" /> por aqui</h4>
  <p>Un texto <UiIcon :value="imgSrc" /> por aqui</p>
</div>
```