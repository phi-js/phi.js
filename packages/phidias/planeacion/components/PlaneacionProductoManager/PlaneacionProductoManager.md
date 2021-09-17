```js

function getTargetHref(producto) {
  return {
    url: 'http://phidias.local/orm/productos/edit?producto=' + producto.id,
    target: null
  };
}

<PlaneacionProductoManager
  :row-href="getTargetHref"
/>
```