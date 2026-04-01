import { Table as AntTable, Spin } from 'antd';

/**
 * 通用表格组件
 * @param {Object} props - 组件属性
 * @param {Array} props.columns - 表格列配置
 * @param {Array} props.dataSource - 表格数据源
 * @param {boolean} props.loading - 加载状态
 * @param {Object} props.pagination - 分页配置
 * @param {Function} props.onChange - 分页、筛选、排序变化时的回调
 * @param {Object} props.rowSelection - 行选择配置
 * @param {Function} props.onRow - 行点击事件
 * @param {Object} props.scroll - 表格滚动配置
 * @param {Object} props.style - 自定义样式
 * @param {string} props.className - 自定义类名
 */
const Table = ({
  columns,
  dataSource = [],
  loading = false,
  pagination = false,
  onChange,
  rowSelection,
  onRow,
  scroll,
  style,
  className
}) => {
  return (
    <Spin spinning={loading}>
      <AntTable
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={onChange}
        rowSelection={rowSelection}
        onRow={onRow}
        scroll={scroll}
        style={style}
        className={className}
        rowKey="id"
      />
    </Spin>
  );
};

export default Table;
