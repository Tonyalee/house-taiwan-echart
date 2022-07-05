// Import stylesheets
import './style.css';

let myChart;
let colors = {
  mainFirst: 'rgba(60, 158, 205, 1)', // main 系列
  shadow: 'rgba(122, 212, 255, 0.6)',
  gradientFirst: 'rgba(60, 158, 205, 1)', // gradient 系列
  gradientSec: 'rgba(60, 158, 205, 0.5)',
  // gradientThird: 'rgba(110, 86, 140, 1)',
  lightFirst: 'rgba(255, 255, 255, 1)', // light 系列
  lightSec: 'rgba(255, 255, 255, 0.6)',
  lightThird: 'rgba(255, 255, 255, 0.2)',
  lightForth: 'rgba(255, 255, 255, 0.15)',
  lightZero: 'rgba(255, 255, 255, 0)',
  color1: 'rgba(255, 210, 89, 1)', // color1 系列
  color1Sec: 'rgba(255, 210, 89, 0.6)',
  color1Third: 'rgba(255, 210, 89, 0)',
  color2: 'rgba(0, 181, 255, 1)', // color2 系列
  color2Sec: 'rgba(0, 181, 255, 0.4)',
  color2Third: 'rgba(0, 181, 255, 0)',
  // pastNoRain: 'rgba(255, 177, 57, 1)', // pastNoRain 系列
  // pastRain: 'rgba(64, 208, 203, 1)', // pastRain 系列
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
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.lightThird,
    backgroundColor: colors.gradientFirst,
    // shadowColor: colors.shadow,
    shadowBlur: 10,
    shadowOffsetY: 12,
    textStyle: {
      color: colors.lightFirst,
    },
    position: function (pos, params, dom, rect, size) {
      // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
      var obj = { top: 60 };
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
      return obj;
    },
  },
  xAxis: {
    axisLine: {
      onZero: true, // x 軸線
      lineStyle: {
        color: colors.lightForth,
        shadowColor: colors.lightFirst,
      },
    },
    axisLabel: {
      formatter: '{value}', // x 軸文字
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
      value: '', // focus 區域
      snap: true,
      label: {
        // focus 標籤區域
        show: true,
        formatter: '{value}',
        margin: 7,
        backgroundColor: colors.mainFirst,
        shadowColor: colors.shadow,
        shadowBlur: 0,
      },
      handle: {
        show: true, // 手把
        icon: 'image:/images/charts-handle.svg',
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
      show: true,
      type: 'value',
      axisLabel: {
        formatter: '{value}',
        color: colors.lightSec, // y 軸文字
        margin: 12,
      },
      splitLine: {
        show: true, // 刻度線
        lineStyle: {
          color: colors.lightThird,
        },
      },
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
      name: 'Taiwan Cathay Real Estate Index', // 國泰房地產指數
      type: 'line',
      showSymbol: false,
      smooth: true,
      data: getRandomData(45, 55, 24),
      color: colors.color1,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: colors.color1Sec,
          },
          {
            offset: 1,
            color: colors.color1Third,
          },
        ]),
      },
      emphasis: {
        itemStyle: {
          color: colors.color1,
          borderColor: colors.color1,
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
