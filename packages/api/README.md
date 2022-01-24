La idea es facilitar el uso de multiples CLIENTES desde ui componente.

El caso mas comun:  un cliente global

Desde el componente:
```js
import { useApi } from '@/packages/api'
const myApi = useApi()

const response = await myApi.get('/foo')
```

Esto implica que el CLIENTE ha sido provide'd desde algun componente ancestro,
o que ha sido enviado directamente como un attr "apiClient"


Como attr:
```js
import { Client } from '@/packages/api'
const someClient = new Client('https://jsonplaceholder.com')

<SomeComponent :api-client="someClient" />
```

Provided:
```js
import { Client, provideApi } from '@/packages/api'
provideApi(new Client('https://jsonplaceholder.com'))

<SomeComponent :api-client="someClient" />
```


Clientes nombrados (named)

Un componente puede especifiar el cliente a usar, identificado por un NOMBRE.

Desde el componente:
```js
import { useNamedApi } from '@/packages/api' // ????
const apiOne = useNamedApi('colegio1')
const apiTwo = useNamedApi('colegio2')

const groupOne = await apiOne.get('/people')
const groupTwo = await apiTwo.get('/people')
```

Como attr:
```js
import { Client } from '@/packages/api'
const someClientOne = new Client('https://colegio1.com')
const someClientTwo = new Client('https://colegio2.com')

<SomeComponent :api-colegio1="someClientOne" />
<SomeComponent :api-colegio2="someClientTwo" />
```

Provided:
```js
import { Client, provideApi } from '@/packages/api'
provideApi('colegio1', new Client('https://colegio1.com'))
provideApi('colegio2', new Client('https://colegio2.com'))

<SomeComponent :api-client="someClient" />
```




```js
// en el setup() del componente
import { useApi } from '@/packages/api';
import { default as apiv4, grading, posts } from '@/packages/phidias/api/v4'
import { default as apiCore, permisos, facturas } from '@/packages/phidias/api/core'

const soloGrading = useApi(apiV4, grading);
soloGrading.getGrades().then();

const todoV4 = useApi(apiV4, { grading, posts });
todoV4.grading.getGrades().then();
todoV4.posts.getPost().then();

// creando un objeto complejo
const whatever = useApi(apiV4, (client) => ({
  ...grading(client),
  ...posts(client)
}));

whatever.getGrades().then()
whatever.getPost().then()


const combinedApi = useApi({
  apiV4: grading,
  apiCore: permisos
});

const combinedApi = {
  ...useApi(apiCore, { permisos }),
  ...useApi(apiV4, { grading, posts }),
};

compbinedApi.getPermisos()
compbinedApi.getGrades()
compbinedApi.getPost()

```