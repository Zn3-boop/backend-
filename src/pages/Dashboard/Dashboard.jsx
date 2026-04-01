import React, { memo } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ShoppingOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useStatistics } from '../../context/StatisticsContext';
import { formatMoney } from '../../utils/format';
import './Dashboard.css';

const Dashboard = memo(() => {
  const { coreData, salesTrend, categoryRatio, loading } = useStatistics();

  // 销售趋势折线图配置
  const salesTrendOption = {
    title: {
      text: '销售趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: salesTrend.months
    },
    yAxis: {
      type: 'value',
      name: '销售额（万元）',
      axisLabel: {
        formatter: '{value}万'
      }
    },
    series: [{
      data: salesTrend.data,
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.3
      }
    }]
  };

  // 商品分类饼图配置
  const categoryRatioOption = {
    title: {
      text: '商品分类占比',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}% ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [{
      name: '商品分类',
      type: 'pie',
      radius: '50%',
      data: categoryRatio,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  return (
    <div className="dashboard">
      {/* 核心数据卡片 */}
      <Row gutter={16} className="stats-row">
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="总订单数"
              value={coreData.totalOrders}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="销售额"
              value={coreData.totalSales}
              prefix={<DollarOutlined />}
              formatter={(value) => formatMoney(value)}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="用户数"
              value={coreData.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} className="charts-row">
        <Col span={16}>
          <Card title="销售趋势" loading={loading}>
            <ReactECharts option={salesTrendOption} style={{ height: 400 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="商品分类占比" loading={loading}>
            <ReactECharts option={categoryRatioOption} style={{ height: 400 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default Dashboard;
