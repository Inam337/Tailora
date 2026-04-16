import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import InsightsCard, { type InsightsCardVariant } from '@/components/app/InsightsCard';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { RbIcon } from '@/components/icons/common/RbIcon';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth';
import { useTailoringStore } from '@/stores/tailoringStore';
import { AppConstants } from '@/common/AppConstants';
import { cn } from '@/libs/utils';

const CARD_VARIANTS: InsightsCardVariant[] = ['blue', 'amber', 'green', 'violet'];
const VARIANT_ICON_COLORS: Record<InsightsCardVariant, string> = {
  blue: '#0284c7',
  amber: '#d97706',
  green: '#0d9488',
  violet: '#4f46e5',
  rose: '#e11d48',
  orange: '#ea580c',
  purple: '#8b5cf6',
  gray: '#6b7280',
  yellow: '#eab308',
  pink: '#c026d3',
};

export default function Dashboard() {
  const { t } = useTranslation('dashboard');
  const { userEmail } = useAuthStore();
  const customerCount = useTailoringStore(s => s.customers.length);
  const measurementCount = useTailoringStore(s => s.measurements.length);
  const orderCount = useTailoringStore(s => s.orders.length);
  const paymentCount = useTailoringStore(s => s.payments.length);
  const hour = new Date().getHours();
  const greeting = hour < 12
    ? t('goodMorning')
    : hour < 17
      ? t('goodAfternoon')
      : t('goodEvening');
  const greetingColor = hour < 12
    ? 'text-green-600'
    : hour < 17
      ? 'text-amber-500'
      : 'text-orange-600';
  const displayName = useMemo(() => {
    if (!userEmail) {
      return t('guestName');
    }

    const local = userEmail.split('@')[0] || userEmail;

    return local.replace(/\./g, ' ');
  }, [t, userEmail]);
  const initials = useMemo(() => {
    const parts = displayName.trim().split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
    }

    return displayName.slice(0, 2).toUpperCase() || 'U';
  }, [displayName]);
  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="p-4">
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6',
          'rounded-xl border border-primary/20 bg-linear-to-r',
          'from-primary/10 via-primary/5 to-background px-5 py-4 shadow-sm',
        )}
      >
        <div className="flex items-center gap-4 min-w-0">
          <Avatar className="h-12 w-12 shrink-0 rounded-xl border-2 border-background shadow-sm">
            <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-base font-medium">
              <span className={greetingColor}>{greeting}</span>
              {' · '}
              <span className="text-base font-medium text-muted-foreground">
                {t('welcomeBack')}
              </span>
            </span>
            <h1 className="text-xl font-semibold text-foreground truncate">{displayName}</h1>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const variant = card.variant;
          const iconColor = VARIANT_ICON_COLORS[variant];

          return (
            <InsightsCard
              key={card.key}
              title={t(`stats.${card.key}`)}
              value="—"
              icon={(
                <RbIcon
                  name={card.icon}
                  size={24}
                  color={iconColor}
                />
              )}
              variant={variant}
              tooltipDescription={t(`stats.${card.key}Hint`)}
            />
          );
        })}
      </div> */}

      <section className="mt-8 space-y-3">
        <div>
          <h2 className="text-base font-semibold">{t('workshop.title')}</h2>
          <p className="text-sm text-muted-foreground">{t('workshop.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            {
              href: AppConstants.Routes.Private.CustomersList,
              titleKey: 'workshop.customers',
              hintKey: 'workshop.customersHint',
              count: customerCount,
              icon: 'users' as const,
              variant: CARD_VARIANTS[0],
            },
            {
              href: AppConstants.Routes.Private.MeasurementsList,
              titleKey: 'workshop.measurements',
              hintKey: 'workshop.measurementsHint',
              count: measurementCount,
              icon: 'categories' as const,
              variant: CARD_VARIANTS[2],
            },
            {
              href: AppConstants.Routes.Private.OrdersList,
              titleKey: 'workshop.orders',
              hintKey: 'workshop.ordersHint',
              count: orderCount,
              icon: 'openBox' as const,
              variant: CARD_VARIANTS[1],
            },
            {
              href: AppConstants.Routes.Private.PaymentsList,
              titleKey: 'workshop.payments',
              hintKey: 'workshop.paymentsHint',
              count: paymentCount,
              icon: 'handDollar' as const,
              variant: CARD_VARIANTS[3],
            },
          ].map(card => (
            <div
              key={card.href}
              className="flex flex-col gap-2"
            >
              <InsightsCard
                title={t(card.titleKey)}
                value={String(card.count)}
                icon={(
                  <RbIcon
                    name={card.icon}
                    size={24}
                    color={VARIANT_ICON_COLORS[card.variant]}
                  />
                )}
                variant={card.variant}
                tooltipDescription={t(card.hintKey)}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                asChild
              >
                <Link to={card.href}>{t('workshop.open')}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
