<script setup>
import ChartJs from './ChartJs.vue'

const data = [
  { year: 2010, count: 10 },
  { year: 2011, count: 20 },
  { year: 2012, count: 15 },
  { year: 2013, count: 25 },
  { year: 2014, count: 22 },
  { year: 2015, count: 30 },
  { year: 2016, count: 28 },
]

const coolData = {
  labels: data.map((row) => row.year),
  datasets: [
    {
      label: 'Acquisitions by year',
      data: data.map((row) => row.count),
    },
  ],
}
</script>

<template>
  <div class="ChartJs-docs">
    <h1>Chart.JS</h1>

    <pre>data: {{ coolData }}</pre>

    <ChartJs
      type="bar"
      :data="coolData"
    />
  </div>
</template>