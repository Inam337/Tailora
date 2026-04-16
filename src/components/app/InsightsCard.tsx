import React, { type FC } from 'react';

import Card from '@/components/ui/Card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import { cn } from '@/libs/utils';

export type InsightsCardVariant
  = 'blue' | 'amber' | 'green' | 'rose' | 'violet' | 'orange' | 'purple' | 'gray' | 'yellow' | 'pink';

// Elegant, distinct color palette for each card variant (exported for use in other dashboards)
export const INSIGHTS_CARD_VARIANT_STYLES: Record<
  InsightsCardVariant,
  {
    card: string;
    iconContainer: string;
    iconColor: string;
    title: string;
    value: string;
    valueBadge: string;
  }
> = {
  blue: {
    card: 'bg-gradient-to-br from-sky-50/90 via-white to-white border border-sky-200/80',
    iconContainer: 'bg-sky-100 text-sky-600',
    iconColor: 'text-sky-600',
    title: 'text-sky-800/80',
    value: 'text-gray-900',
    valueBadge: 'bg-sky-100 text-sky-700',
  },
  amber: {
    card: 'bg-gradient-to-br from-amber-50/90 via-white to-white border border-amber-200/80',
    iconContainer: 'bg-amber-100 text-amber-600',
    iconColor: 'text-amber-600',
    title: 'text-amber-800/80',
    value: 'text-gray-900',
    valueBadge: 'bg-amber-100 text-amber-700',
  },
  green: {
    card: 'bg-gradient-to-br from-teal-50/90 via-white to-white border border-teal-200/80',
    iconContainer: 'bg-teal-100 text-teal-600',
    iconColor: 'text-teal-600',
    title: 'text-teal-800/80',
    value: 'text-gray-900',
    valueBadge: 'bg-teal-100 text-teal-700',
  },
  rose: {
    card: 'bg-gradient-to-br from-rose-50/90 via-white to-white border border-rose-200/80',
    iconContainer: 'bg-rose-100 text-rose-600',
    iconColor: 'text-rose-600',
    title: 'text-rose-800/80',
    value: 'text-gray-900',
    valueBadge: 'bg-rose-100 text-rose-700',
  },
  violet: {
    card: 'bg-gradient-to-br from-indigo-50/90 via-white to-white border border-indigo-200/80',
    iconContainer: 'bg-indigo-100 text-indigo-600',
    iconColor: 'text-indigo-600',
    title: 'text-indigo-800/80',
    value: 'text-gray-900',
    valueBadge: 'bg-indigo-100 text-indigo-700',
  },
  orange: {
    card: 'bg-gradient-to-br from-orange-50/90 via-white to-white border border-orange-200/80',
    iconContainer: 'bg-orange-100 text-orange-600',
    iconColor: 'text-orange-600',
    title: 'text-orange-800/80',
    value: 'text-gray-900',
    valueBadge: 'bg-orange-100 text-orange-700',
  },
  purple: {
    card: 'bg-gradient-to-br from-purple-50/90 via-white to-white border border-purple-200/80',
    iconContainer: 'bg-purple-100 text-purple-600',
    iconColor: 'text-purple-600',
    title: 'text-purple-800/80',
    value: 'text-gray-900',
    valueBadge: 'bg-purple-100 text-purple-700',
  },
  gray: {
    card: 'bg-gradient-to-br from-gray-100/90 via-white to-white border border-gray-300/80',
    iconContainer: 'bg-gray-300 text-gray-700',
    iconColor: 'text-gray-700',
    title: 'text-gray-800',
    value: 'text-gray-900',
    valueBadge: 'bg-gray-200 text-gray-800',
  },
  yellow: {
    card: 'bg-gradient-to-br from-yellow-100/60 via-white to-white border border-yellow-300/80',
    iconContainer: 'bg-yellow-100 text-stone-700',
    iconColor: 'text-yellow-700',
    title: 'text-yellow-800',
    value: 'text-yellow-900',
    valueBadge: 'bg-yellow-100 text-yellow-800',
  },
  pink: {
    card: 'bg-gradient-to-br from-fuchsia-50/90 via-white to-white border border-fuchsia-200/80',
    iconContainer: 'bg-fuchsia-100 text-fuchsia-600',
    iconColor: 'text-fuchsia-600',
    title: 'text-fuchsia-800/80',
    value: 'text-gray-900',
    valueBadge: 'bg-fuchsia-100 text-fuchsia-700',
  },
};

// Hex colors for icons so they match card variant (e.g. for icon fill prop)
export const INSIGHTS_CARD_VARIANT_ICON_HEX: Record<InsightsCardVariant, string> = {
  blue: '#0284c7',
  amber: '#d97706',
  green: '#0d9488',
  rose: '#e11d48',
  violet: '#4f46e5',
  orange: '#ea580c',
  purple: '#7c3aed',
  gray: '#4b5563',
  yellow: '#a16207',
  pink: '#c026d3',
};

const DEFAULT_VARIANT: InsightsCardVariant = 'blue';

interface StatsCardProps {
  title: string;
  value?: string;
  icon: React.ReactElement;
  variant?: InsightsCardVariant;
  /** Optional description shown in tooltip on title and icon hover */
  tooltipDescription?: string;
  className?: string;
  iconContainerClassName?: string;
  contentClassName?: string;
}

const InsightsCard: FC<StatsCardProps> = ({
  title,
  value,
  icon,
  variant = DEFAULT_VARIANT,
  tooltipDescription,
  className,
  iconContainerClassName,
  contentClassName,
}) => {
  const styles = INSIGHTS_CARD_VARIANT_STYLES[variant];
  const showTooltip = Boolean(tooltipDescription?.trim());
  const tooltipContent = (
    <span className="flex text-left leading-relaxed">
      {tooltipDescription}
    </span>
  );
  const titleEl = (
    <p
      className={cn(
        'text-sm font-medium mb-2 ',
        'transition-colors duration-200 ease-out flex text-justify whitespace-nowrap ',
        showTooltip && 'cursor-pointer whitespace-normal',
        styles.title,
      )}
    >
      {title}
    </p>
  );
  const iconEl = (
    <div
      className={cn(
        'shrink-0 rounded-xl w-11 h-11 flex items-center justify-center',
        'transition-all duration-200 ease-out',
        showTooltip && 'cursor-pointer',
        styles.iconContainer,
        iconContainerClassName,
      )}
    >
      <span className={cn('flex items-center justify-center', styles.iconColor)}>
        {icon}
      </span>
    </div>
  );

  return (
    <Card
      className={cn(
        'relative flex items-start flex-row justify-between p-3 rounded-2xl',
        'shadow-sm border min-h-[100px] transition-shadow duration-200 hover:shadow-md',
        styles.card,
        className,
      )}
    >
      <div className={cn('flex-1 min-w-0 pr-0', contentClassName)}>
        <span className="flex">{titleEl}</span>
        <span
          className={cn(
            'inline-flex items-center rounded-full px-3 py-1 text-lg font-bold tracking-tight',
            styles.valueBadge,
          )}
        >
          {value ?? '—'}
        </span>
      </div>
      {showTooltip
        ? (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                {iconEl}
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="duration-200 w-60"
              >
                {tooltipContent}
              </TooltipContent>
            </Tooltip>
          )
        : (
            iconEl
          )}
    </Card>
  );
};

export default InsightsCard;
