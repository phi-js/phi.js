<script setup></script>

<template>
  <section>
    <h1>Styling</h1>
    <p>Los componentes vienen SIN estilos, pero todos tienen clases CSS bajo el etandar BEM,</p>
    <p>Y tambien usan variables CSS predefinidas</p>
  </section>

  <section>
    <h1>Variables</h1>
    <pre><code>
      --ui-color-primary: #41b883;
      --ui-color-danger: #ea5455;

      /* Componente UiItem */
      --ui-item-padding: 0;
    </code></pre>
  </section>

  <section>
    <h1>Clases</h1>
    <pre><code>
      --ui--clickable

      .UiInput   para usar junto a elementos nativos input, textarea, select

      .UiButton  Para usar junto a botones nativos
        --main
        --cancel

      .UiGroup   Agrupar -hijos- 
        --block (default)
        --inline
    </code></pre>
  </section>
</template>