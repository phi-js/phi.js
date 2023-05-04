<script setup>
import { UiOutput } from '.'

</script>

<template>
  <div class="Docs">
    <h1>UiOutput</h1>
    <code>import { UiOutput } from '@/packages/ui'</code>
    <p>A flexible component for outputting data in various formats. Supports a variety of types, including currency, date, datetime, email, enum, geo, image, time, upload, url, and more. Can also handle arrays and objects.</p>

    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Description</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>value</td>
          <td>The value to be outputted</td>
          <td>Any</td>
          <td>false</td>
          <td>null</td>
        </tr>
        <tr>
          <td>type</td>
          <td>The type of output to use. Supported types include currency, date, datetime, email, enum, geo, image, time, upload, url, and more.</td>
          <td>String</td>
          <td>false</td>
          <td>null</td>
        </tr>
        <tr>
          <td>component</td>
          <td>The component to use for rendering the output. If specified, overrides the <strong>type</strong> prop.</td>
          <td>Object</td>
          <td>false</td>
          <td>null</td>
        </tr>
        <tr>
          <td>props</td>
          <td>The props to pass to the specified <strong>component</strong>.</td>
          <td>Object</td>
          <td>false</td>
          <td>null</td>
        </tr>
        <tr>
          <td>items</td>
          <td>The props to pass to each item in the array when using <strong>type="array"</strong>.</td>
          <td>Object</td>
          <td>false</td>
          <td>null</td>
        </tr>
        <tr>
          <td>...attrs</td>
          <td>Any additional attributes to be passed to the component.</td>
          <td>Any</td>
          <td>false</td>
          <td>null</td>
        </tr>
      </tbody>
    </table>

    Examples:
    <pre><code>&lt;UiOutput value="Hello, world!" /&gt;&lt;br&gt;
&lt;UiOutput type="currency" value="1000" /&gt;&lt;br&gt;
&lt;UiOutput type="date" value="2022-01-01" /&gt;&lt;br&gt;
&lt;UiOutput type="datetime" value="2022-01-01T12:00:00" /&gt;&lt;br&gt;
&lt;UiOutput type="email" value="example@example.com" /&gt;&lt;br&gt;
&lt;UiOutput type="enum" :enum="['foo', 'bar']" value="foo" /&gt;&lt;br&gt;
&lt;UiOutput type="geo" :value="{lat: 37.7749, lng: -122.4194}" /&gt;&lt;br&gt;
&lt;UiOutput type="image" value="https://via.placeholder.com/150" /&gt;&lt;br&gt;
&lt;UiOutput type="upload" :value="{ url: 'https://example.com/files/123', name: 'example.pdf' }" /&gt;&lt;br&gt;
&lt;UiOutput type="url" value="https://example.com" /&gt;&lt;br&gt;
&lt;UiOutput type="array" :value="[ 'foo', 'bar' ]" /&gt;&lt;br&gt;</code></pre>

    <UiOutput value="Hello, world!" /><br>
    <UiOutput
      type="currency"
      value="1000"
    /><br>
    <UiOutput
      type="date"
      value="2022-01-01"
    /><br>
    <UiOutput
      type="datetime"
      value="2022-01-01T12:00:00"
    /><br>
    <UiOutput
      type="email"
      value="example@example.com"
    /><br>
    <UiOutput
      type="enum"
      :enum="['foo', 'bar']"
      value="foo"
    /><br>
    <UiOutput
      type="geo"
      :value="{lat: 37.7749, lng: -122.4194}"
    /><br>
    <UiOutput
      type="image"
      value="https://via.placeholder.com/150"
    /><br>
    <UiOutput
      type="upload"
      :value="{ url: 'https://example.com/files/123', name: 'example.pdf' }"
    /><br>
    <UiOutput
      type="url"
      value="https://example.com"
    /><br>
    <UiOutput
      type="array"
      :value="[ 'foo', 'bar' ]"
    /><br>
  </div>
</template>