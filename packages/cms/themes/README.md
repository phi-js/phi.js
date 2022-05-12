# Theming

Un story puede definir uno (O MAS) "Themes".
Al final los Themes son archivos CSS a importar.  
El theme debe definir TODOS los estilos pertinentes a la historia, incluyendo el color de fondo del body





# Block props

Para cada bloque se pueden definir las propiedades STYLE y CLASS

STYLE es straightforward.  Se proporciona un editor (JSON raw) para establecer el valor de la prop "style"
del componente (que p[uede ser un arreglo, objeto o cadena, segun lo interpreta Vue)

CLASS es un poco mas abstracto.  Primero debe existir una lista de clases disponibles (y tambien la opcion de definir clases propias)
y debe existir una hoja de estilos que defina cada clase.

El foco del modulo de Theming es la definicion de clases.  Se define una lista de CLASES, cada una con un nombre y descripcion,
posiblemente thumbnail(?) y un CSS base.

Los temas son posibles interpretaciones de cada clase.

Las clases base principales estan definidas en
/packages/cms/style/classes/

cada una en un archivo JS que especifica:

{
  "name": "bigBlackBox",  (nombre de la clase a asignar al componente)

  "text": "Big, Black Box",
  "subtext": "Gives the element a dark background and high contrast font",

  "css": `
    .bigBlackBox {
      background: black;
      color: #eee;
    }

    .bigBlackBox h1,
    .bigBlackBox h2,
    .bigBlackBox h3,
    .bigBlackBox p {
      color: #fff;
    }
  `,

  // Subclases asociadas.  Solo se puede aplicar una variacion a la vez
  // se recomienda que el nombre de la clase de la variacion obedezca las reglas de modificadores de BEM (ParentClass--variationName)
  "variations": [
    {
      "name": "bigBlackBox--huge",
      "text": "Huge",
      "css": `
        .bigBlackBox--huge {
          font-size: 3em;
        }

        .bigBlackBox--huge h1,
        .bigBlackBox--huge h2,
        .bigBlackBox--huge h3,
        .bigBlackBox--huge p {
          font-size: 3em;
        }
      `
    }
  ]
}