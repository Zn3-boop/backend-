import { Card as AntCard } from 'antd';

/**
 * 通用卡片组件
 * @param {Object} props - 组件属性
 * @param {string} props.title - 卡片标题
 * @param {React.ReactNode} props.children - 卡片内容
 * @param {boolean} props.bordered - 是否显示边框
 * @param {boolean} props.hoverable - 是否可悬浮
 * @param {Object} props.extra - 卡片右上角额外内容
 * @param {Object} props.style - 自定义样式
 * @param {string} props.className - 自定义类名
 */
const Card = ({
  title,
  children,
  bordered = true,
  hoverable = false,
  extra,
  style,
  className
}) => {
  return (
    <AntCard
      title={title}
      bordered={bordered}
      hoverable={hoverable}
      extra={extra}
      style={style}
      className={className}
    >
      {children}
    </AntCard>
  );
};

export default Card;
