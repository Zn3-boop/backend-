import ReactECharts from 'echarts-for-react';

/**
 * 折线图组件
 * @param {Object} props - 组件属性
 * @param {Array} props.data - 图表数据
 * @param {Array} props.xAxisData - X轴数据
 * @param {string} props.title - 图表标题
 * @param {string} props.yAxisName - Y轴名称
 * @param {Object} props.style - 自定义样式
 */
const LineChart = ({
  data = [],
  xAxisData = [],
  title = '',
  yAxisName = '',
  style = { height: '400px' }
}) => {
  const getOption = () => {
    return {
      title: {
        text: title
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData
      },
      yAxis: {
        type: 'value',
        name: yAxisName
      },
      series: [
        {
          name: title,
          type: 'line',
          stack: 'Total',
          data: data,
          smooth: true,
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          }
        }
      ]
    };
  };

  return <ReactECharts option={getOption()} style={style} />;
};

export default LineChart;
