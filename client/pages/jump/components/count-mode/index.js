import * as echarts from '../../../../ec-canvas/echarts';
import sqbComponent from '../../../../components/common/component.js'

const app = getApp();

function initChart(canvas, width, height, dpr) {
  console.log('###canvas is ', canvas, width, height, dpr)

  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3"],
    series: [{
      name: '业务指标',
      type: 'gauge',
      detail: {
        formatter: '{value}%'
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 30,
          shadowBlur: 0,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      data: [{
        value: 40,
      }]

    }]
  };

  chart.setOption(option, true);

  return chart;
}

sqbComponent({

  data: {
    ec: {
      onInit: initChart
    }
  },
});
