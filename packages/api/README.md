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