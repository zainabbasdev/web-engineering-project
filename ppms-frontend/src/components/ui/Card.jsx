import React from 'react';
import clsx from 'clsx';

/**
 * Card Component - Container with rounded corners and shadow
 */
export const Card = ({ className, children, ...props }) => (
  <div
    className={clsx('bg-white rounded-xl shadow-sm border border-neutral-100', className)}
    {...props}
  >
    {children}
  </div>
);

/**
 * StatCard - Displays a statistic with title, value, and optional trend
 */
export const StatCard = ({ title, value, icon: Icon, trend, trendLabel, className }) => {
  const trendColor = trend > 0 ? 'text-success-600' : 'text-danger-600';

  return (
    <Card className={clsx('p-6 flex items-start justify-between', className)}>
      <div>
        <p className="text-sm text-neutral-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-neutral-900">{value}</p>
        {trend !== undefined && (
          <p className={clsx('text-sm mt-2', trendColor)}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel}
          </p>
        )}
      </div>
      {Icon && <Icon className="w-12 h-12 text-primary-100" />}
    </Card>
  );
};

/**
 * Badge Component - Small label/tag
 */
export const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-50 text-primary-700',
    success: 'bg-success-50 text-success-700',
    warning: 'bg-warning-50 text-warning-700',
    danger: 'bg-danger-50 text-danger-700',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

/**
 * LoadingSpinner - Animated loading spinner
 */
export const Loader = ({ size = 'md', className }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div className={clsx(sizeClass, className)}>
      <div className={clsx(sizeClass, 'border-2 border-primary-100 border-t-primary-600 rounded-full animate-spin')} />
    </div>
  );
};

/**
 * Skeleton Loader - Placeholder for loading content
 */
export const SkeletonLoader = ({ lines = 3, className }) => (
  <div className={clsx('space-y-3', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-neutral-200 rounded animate-pulse" />
    ))}
  </div>
);

/**
 * EmptyState - Display when no data available
 */
export const EmptyState = ({ title, description, icon: Icon, action }) => (
  <div className="flex flex-col items-center justify-center py-12">
    {Icon && <Icon className="w-16 h-16 text-neutral-300 mb-4" />}
    <h3 className="text-lg font-medium text-neutral-900 mb-2">{title}</h3>
    <p className="text-sm text-neutral-600 mb-6">{description}</p>
    {action && action}
  </div>
);

export default Card;
