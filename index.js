// Import stylesheets
import './style.css';

let myChart;
let colors = {
  mainFirst: 'rgba(54, 50, 133, 1)', // main 系列
  shadow: 'rgba(40, 26, 112, 0.6)',
  nowNoRain: 'rgba(255, 210, 89, 1)', // nowNoRain 系列
  nowNoRainSec: 'rgba(255, 210, 89, 0.6)',
  nowNoRainThird: 'rgba(255, 210, 89, 0)',
  nowRain: 'rgba(0, 181, 255, 1)', // nowRain 系列
  nowRainSec: 'rgba(0, 181, 255, 0.4)',
  nowRainThird: 'rgba(0, 181, 255, 0)',
  pastNoRain: 'rgba(255, 177, 57, 1)', // pastNoRain 系列
  pastRain: 'rgba(64, 208, 203, 1)', // pastRain 系列
  lightFirst: 'rgba(255, 255, 255, 1)', // light 系列
  lightSec: 'rgba(255, 255, 255, 0.5)',
  lightThird: 'rgba(255, 255, 255, 0.2)',
  lightForth: 'rgba(255, 255, 255, 0.15)',
  lightZero: 'rgba(255, 255, 255, 0)',
  gradientFirstStart: 'rgba(255, 159, 162, 1)', // gradient 系列
  gradientFirstEnd: 'rgba(109, 37, 244, 1)',
  gradientSecStart: 'rgba(255, 159, 162, 0.2)',
  gradientSecEnd: 'rgba(109, 37, 244, 0.2)',
  gradientThirdStart: 'rgba(110, 86, 140, 1)',
  gradientThirdEnd: 'rgba(65, 53, 155, 1)',
};
let _datazoom = {
  start: 25,
  end: 75,
};
let option = {
  title: {
    text: '房價指數與重貼現率',
    textAlign: 'auto',
    padding: [5, 20],
    left: 'center',
    top: 'auto',
    textStyle: {
      color: '#fff',
      with: '100%',
    },
  },
  color: colors.nowNoRain,
  grid: {
    top: '15%',
    left: '5%',
    right: '5%',
    bottom: '5%',
    containLabel: true,
  },
  legend: {
    show: false,
    selected: {
      'now-rain': true,
      'now-no-rain': true,
      'past-rain': true,
      'past-no-rain': true,
    },
  },
  tooltip: {
    order: 'valueDesc', // tooltip 依照數值高低排序
    // trigger: 'axis',
    formatter: function (params) {
      return params.length > 0
        ? params.map((m) => m.marker + ' ' + m.value).join('<br />')
        : '';
    },
    // borderWidth: 1,
    // borderRadius: 12,
    // borderColor: colors.lightThird,
    // backgroundColor: colors.mainFirst,
    // shadowColor: colors.shadow,
    // shadowBlur: 10,
    // shadowOffsetY: 12,
    // textStyle: {
    //   color: colors.lightFirst,
    // },
    position: function (pos, params, dom, rect, size) {
      // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
      var obj = { top: 60 };
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
      return obj;
    },
  },
  xAxis: {
    axisLine: {
      // x 軸線
      onZero: true,
      lineStyle: {
        color: colors.lightForth,
        shadowColor: colors.lightFirst,
      },
    },
    axisLabel: {
      // x 軸文字
      formatter: '{value}',
      color: colors.lightSec,
      margin: 12,
    },
    // position: 'top',
    // offset: 0,
    // nameLocation: 'center',
    axisTick: {
      show: true, // 顯示刻度
    },
    axisPointer: {
      // focus 區域
      value: '',
      snap: true,
      lineStyle: {
        type: 'solid',
        cap: 'butt', // or 'round'
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: colors.gradientSecStart,
          },
          {
            offset: 1,
            color: colors.gradientSecEnd,
          },
        ]),
        width: 30,
      },
      label: {
        // focus 標籤區域
        show: true,
        formatter: '{value}',
        margin: 7,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
          {
            offset: 0,
            color: colors.gradientFirstStart,
          },
          {
            offset: 1,
            color: colors.gradientFirstEnd,
          },
        ]),
        backgroundColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: colors.gradientThirdStart,
          },
          {
            offset: 1,
            color: colors.gradientThirdEnd,
          },
        ]),
        // shadowColor:  colors.shadow,
        shadowBlur: 0,
        // shadowOffsetY: 12,
        textStyle: {
          color: colors.lightFirst,
        },
      },
      handle: {
        show: true, // 手把
        icon: 'image://../../../../images/rain/h5/charts-handle.svg',
        size: [32, 3],
        margin: -250,
        // color: '#7581BD',
        color: colors.lightFirst,
        shadowColor: colors.lightZero,
      },
    },
    type: 'category',
    data: (() => {
      let years = [];
      for (let i = 0; i < 21; i++) {
        years.push(i + 2000);
      }
      return years;
    })(),
  },
  yAxis: [
    {
      splitLine: {
        // 刻度線
        show: true,
        lineStyle: {
          color: colors.lightThird,
        },
      },
      show: true,
      type: 'value',
      min: function (value) {
        return value.min - 10;
      },
      max: function (value) {
        return value.max + 5;
      },
    },
  ],
  // dataZoom: [
  //   {
  //     type: 'inside',
  //     show: false,
  //     start: _datazoom.start,
  //     end: _datazoom.end,
  //   },
  // ],
  series: [
    {
      name: 'now-no-rain',
      type: 'line',
      showSymbol: false,
      smooth: true,
      data: getRandomData(45, 55, 24),
      color: colors.nowNoRain,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: colors.nowNoRainSec,
          },
          {
            offset: 1,
            color: colors.nowNoRainThird,
          },
        ]),
      },
      emphasis: {
        itemStyle: {
          color: colors.nowNoRain,
          borderColor: colors.nowNoRain,
          borderWidth: 5,
          shadowBlur: 3,
          shadowColor: colors.shadow,
        },
      },
    },
  ],
};

function initChart() {
  let chartDom = document.getElementById('mychart');
  myChart = echarts.init(chartDom);
  option = updateXaxisPointer(option);
  renderChart(option);
}

// 設定資料 handle & 底線 & axisPointer
function updateXaxisPointer(option) {
  option.xAxis.axisLine.lineStyle = Object.assign(
    option.xAxis.axisLine.lineStyle,
    {
      shadowOffsetY: Number(calculatePosition()),
    }
  );
  option.xAxis.axisPointer.handle = Object.assign(
    option.xAxis.axisPointer.handle,
    {
      margin: Number(-calculatePosition()),
    }
  );
  option.xAxis.axisPointer = Object.assign(option.xAxis.axisPointer, {
    value: findMinDataLength() - 1,
  });

  return option;
}

// 計算 handle & 底線 客製化在圖表底部的比例
function calculatePosition() {
  let scalePosition;
  let HEIGHT = document.getElementById('mychart').offsetHeight;
  let WIDTH = document.getElementById('mychart').offsetWidth;
  // 減去的比例
  let SCALE = (WIDTH / HEIGHT) * 55;
  scalePosition = HEIGHT - SCALE;

  return scalePosition;
}

// 計算 axisPointer 最初顯示於資料當天資料最末端
function findMinDataLength() {
  let minDataLen = Infinity;
  option.series.forEach((series) => {
    if (series.data.length < minDataLen) {
      minDataLen = series.data.length;
    }
  });
  return minDataLen;
}

function renderChart(option) {
  return option && myChart.setOption(option);
}

function changeChartSeries(series) {
  let newOption = Object.assign(option, {
    series,
  });
  return newOption;
}

function bindEvent() {
  // $('.btn').on('click', clickHandler);
  // $('.btn').on('click', clickDateHandler);
  myChart.on('datazoom', function (params) {
    const data = params.batch[0];
    _datazoom.start = data.start;
    _datazoom.end = data.end;
  });
}

//- click Odds to toggle
function clickHandler(event) {
  let $target = $(event.currentTarget);
  let name = $target.data('name');
  if (name) {
    option.legend.selected[name] = !option.legend.selected[name];
    option.dataZoom[0] = Object.assign(option.dataZoom[0], _datazoom);
    $target.toggleClass('active');
    renderChart(option);
  }
}

//- click Date to change data
function clickDateHandler(event) {
  let $target = $(event.currentTarget);
  $('.select-date li').removeClass('active');
  $target.toggleClass('active');
  let randomData = {
    series: [
      {
        name: 'now-no-rain',
        data: getRandomData(45, 55, 24),
      },
      {
        name: 'now-rain',
        data: getRandomData(40, 50, 24),
      },
      {
        name: 'past-no-rain',
        data: getRandomData(35, 45, 48),
      },
      {
        name: 'past-rain',
        data: getRandomData(30, 40, 48),
      },
    ],
  };
  option = changeChartSeries(randomData.series);
  renderChart(option);
}

//- for demo random data
function getRandomData(min, max, count) {
  let arr = [];
  let num;

  for (let i = 0; i < count; i++) {
    num = Math.floor(Math.random() * (max - min + 1) + min);
    arr.push(num);
  }
  return arr;
}

initChart();
bindEvent();
