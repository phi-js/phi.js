Este componente administra la lista de ecommerce/gateways de una instancia (via API)

```js
<GatewayManager>
  <template #data="{data, setData}">
    <h3>Custom slot data :)</h3>
    <input
      type="text"
      :value="data.micosa"
      @input="setData('micosa', $event.target.value)"
    />
  </template>
</GatewayManager>
```