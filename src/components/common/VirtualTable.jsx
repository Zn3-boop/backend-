import React, { useMemo, useRef, useState } from 'react';
import { Table } from 'antd';
import { FixedSizeList as List } from 'react-window';
import { debounce } from '../../utils/format';
import './VirtualTable.css';

// 虚拟表格行组件
const VirtualRow = ({ index, style, data }) => {
  const { columns, dataSource } = data;
  const record = dataSource[index];

  return (
    <div className="virtual-table-row" style={style}>
      {columns.map((column, colIndex) => (
        <div
          key={colIndex}
          className="virtual-table-cell"
          style={{ width: column.width || 'auto' }}
        >
          {column.render ? column.render(record[column.dataIndex], record, index) : record[column.dataIndex]}
        </div>
      ))}
    </div>
  );
};

// 虚拟滚动表格组件
const VirtualTable = ({ 
  columns, 
  dataSource, 
  loading, 
  rowKey = 'id',
  rowHeight = 60,
  height = 600,
  onScroll,
  hasMore,
  loadMore,
}) => {
  const listRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  // 处理滚动事件
  const handleScroll = debounce(({ scrollOffset, scrollDirection }) => {
    setScrollTop(scrollOffset);

    // 检查是否需要加载更多
    if (hasMore && scrollDirection === 'forward' && listRef.current) {
      const { scrollHeight, clientHeight } = listRef.current._outerRef;
      if (scrollHeight - scrollOffset - clientHeight < 200) {
        loadMore();
      }
    }

    if (onScroll) {
      onScroll({ scrollOffset, scrollDirection });
    }
  }, 100);

  // 计算表格总宽度
  const tableWidth = useMemo(() => {
    return columns.reduce((sum, column) => sum + (column.width || 150), 0);
  }, [columns]);

  // 列表数据
  const listData = useMemo(() => ({ columns, dataSource }), [columns, dataSource]);

  return (
    <div className="virtual-table-container">
      <div className="virtual-table-header" style={{ width: tableWidth }}>
        {columns.map((column, index) => (
          <div
            key={index}
            className="virtual-table-header-cell"
            style={{ width: column.width || 'auto' }}
          >
            {column.title}
          </div>
        ))}
      </div>
      <List
        ref={listRef}
        className="virtual-table-body"
        height={height}
        itemCount={dataSource.length}
        itemSize={rowHeight}
        width={tableWidth}
        itemData={listData}
        onScroll={handleScroll}
      >
        {VirtualRow}
      </List>
      {loading && (
        <div className="virtual-table-loading">加载中...</div>
      )}
    </div>
  );
};

export default VirtualTable;
