import { defineAsyncComponent } from 'vue'
const ChartJs = defineAsyncComponent(() => import('./components/ChartJs.vue'))
const ChartJsSettings = defineAsyncComponent(() => import('./components/ChartJsSettings.vue'))

const sampleData = {
  labels: [2010, 2011, 2012, 2013, 2014, 2015, 2016],
  datasets: [
    {
      label: 'Acquisitions by year',
      data: [10, 20, 15, 25, 22, 30, 28],
    },
  ],
}

export default {
  blocks: [
    {
      title: 'Chart.js',
      children: [
        {
          private: true, // hide from CmsBlockPicker
          name: 'ChartJs',
          title: 'Chart',
          icon: 'mdi:chart-bar',

          block: {
            component: ChartJs,
            props: { type: 'bar', data: sampleData },
          },

          editor: {
            actions: [
              {
                id: 'ChartJsSettings',
                title: 'Settings',
                component: ChartJsSettings,
              },
            ],
          },
        },

        {
          name: 'ChartJsBar',
          title: 'Bar',
          icon: 'mdi:chart-bar',
          block: {
            component: 'ChartJs',
            props: { type: 'bar', data: sampleData },
          },
        },

        {
          name: 'ChartJsPie',
          title: 'Pie',
          icon: 'mdi:chart-pie',
          block: {
            component: 'ChartJs',
            props: { type: 'pie', data: sampleData },
          },
        },

        {
          name: 'ChartJsLine',
          title: 'Line',
          icon: 'mdi:chart-line',
          block: {
            component: 'ChartJs',
            props: { type: 'line', data: sampleData },
          },
        },

        {
          name: 'ChartJsPolar',
          title: 'Polar area',
          icon: 'mdi:chart-arc',
          block: {
            component: 'ChartJs',
            props: { type: 'polarArea', data: sampleData },
          },
        },

        {
          name: 'ChartJsDonut',
          title: 'Doughnut',
          icon: 'mdi:chart-donut',
          block: {
            component: 'ChartJs',
            props: { type: 'doughnut', data: sampleData },
          },
        },

        {
          name: 'ChartJsBubble',
          title: 'Bubble',
          icon: 'mdi:chart-bubble',
          block: {
            component: 'ChartJs',
            props: { type: 'doughnut', data: sampleData },
          },
        },

        {
          name: 'ChartJsScatter',
          title: 'Scatter',
          icon: 'mdi:chart-scatter-plot',
          block: {
            component: 'ChartJs',
            props: { type: 'scatter', data: sampleData },
          },
        },
      ],
    },
  ],
}