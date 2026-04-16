import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { FormInput } from '@/components/ui/FormInput';
import { Checkbox } from '@/components/ui/Checkbox';
import FieldError from '@/components/ui/FieldError';
import Card from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { measurementListTitle } from '@/common/tailoringMeasurement';
import { OrderService } from '@/services/orderService';
import { createOrderSchema, type OrderFormValues } from '@/validation-schema/order.schema';
import { AppConstants } from '@/common/AppConstants';
import { useTailoringStore } from '@/stores/tailoringStore';

interface OrderFormProps {
  onCreated?: () => void;
  onUpdated?: () => void;
  editingOrderId?: string | null;
}

export default function OrderForm({
  onCreated,
  onUpdated,
  editingOrderId,
}: OrderFormProps) {
  const { t } = useTranslation(AppConstants.Tailoring.I18nNs);
  const customers = useTailoringStore(s => s.customers);
  const measurements = useTailoringStore(s => s.measurements);
  const orders = useTailoringStore(s => s.orders);
  const editing = orders.find(o => o.id === (editingOrderId ?? ''));
  const schema = useMemo(
    () =>
      createOrderSchema({
        customerRequired: t('validation.order.customerRequired'),
        dressTypeRequired: t('validation.order.dressTypeRequired'),
        stitchingInvalid: t('validation.order.stitchingInvalid'),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: '',
      measurementId: undefined,
      dressType: '',
      stitchingCost: 0,
      embroidery: false,
      pocketStyle: '',
      buttonType: '',
      deliveryDate: '',
      isUrgent: false,
    },
  });

  const customerId = watch('customerId');
  const customerMeasurements = measurements.filter(m => m.customerId === customerId);

  useEffect(() => {
    if (!editingOrderId || !editing) {
      reset({
        customerId: '',
        measurementId: undefined,
        dressType: '',
        stitchingCost: 0,
        embroidery: false,
        pocketStyle: '',
        buttonType: '',
        deliveryDate: '',
        isUrgent: false,
      });

      return;
    }

    reset({
      customerId: editing.customerId,
      measurementId: editing.measurementId,
      dressType: editing.dressType,
      stitchingCost: editing.stitchingCost,
      embroidery: editing.embroidery ?? false,
      pocketStyle: editing.pocketStyle ?? '',
      buttonType: editing.buttonType ?? '',
      deliveryDate: editing.deliveryDate ?? '',
      isUrgent: editing.isUrgent ?? false,
    });
  }, [editing, editingOrderId, reset]);

  const onSubmit = async (values: OrderFormValues) => {
    const payload = {
      customerId: values.customerId,
      measurementId: values.measurementId?.trim() || undefined,
      dressType: values.dressType,
      stitchingCost: values.stitchingCost,
      embroidery: values.embroidery,
      pocketStyle: values.pocketStyle?.trim() || undefined,
      buttonType: values.buttonType?.trim() || undefined,
      deliveryDate: values.deliveryDate?.trim() || undefined,
      isUrgent: values.isUrgent,
    };

    if (editingOrderId && editing) {
      await OrderService.update(editingOrderId, payload);
      onUpdated?.();
    } else {
      await OrderService.create(payload);
      reset({
        customerId: values.customerId,
        measurementId: undefined,
        dressType: '',
        stitchingCost: 0,
        embroidery: false,
        pocketStyle: '',
        buttonType: '',
        deliveryDate: '',
        isUrgent: false,
      });
      onCreated?.();
    }
  };

  const isEdit = Boolean(editingOrderId && editing);

  return (
    <Card className="p-4 sm:p-6" shadow="md" radius="xl">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? t('orders.editTitle') : t('orders.formTitle')}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-1">
          <Label>{t('orders.fields.customer')}</Label>
          <Select
            value={customerId || undefined}
            onValueChange={(v) => {
              setValue('customerId', v, { shouldValidate: true });
              setValue('measurementId', '');
            }}
            disabled={isEdit}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('orders.placeholders.customer')} />
            </SelectTrigger>
            <SelectContent>
              {customers.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError msg={errors.customerId?.message} />
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label>{t('orders.fields.measurement')}</Label>
          <Select
            value={watch('measurementId') ? watch('measurementId') : '__none__'}
            onValueChange={v =>
              setValue('measurementId', v === '__none__' ? undefined : v, { shouldValidate: true })}
            disabled={!customerId || isEdit}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('orders.placeholders.measurement')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">{t('orders.noneMeasurement')}</SelectItem>
              {customerMeasurements.map(m => (
                <SelectItem key={m.id} value={m.id}>
                  {measurementListTitle(m, t(`measurements.stitchType.${m.stitchType}`))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError msg={errors.measurementId?.message} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="order-dress">{t('orders.fields.dressType')}</Label>
          <FormInput
            id="order-dress"
            placeholder={t('orders.placeholders.dressType')}
            {...register('dressType')}
          />
          <FieldError msg={errors.dressType?.message} />
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="order-cost">{t('orders.fields.stitchingCost')}</Label>
          <FormInput
            id="order-cost"
            type="number"
            min={0}
            step="1"
            inputMode="numeric"
            {...register('stitchingCost', { valueAsNumber: true })}
          />
          <FieldError msg={errors.stitchingCost?.message} />
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="order-delivery">{t('orders.fields.deliveryDate')}</Label>
          <FormInput id="order-delivery" type="date" {...register('deliveryDate')} />
          <FieldError msg={errors.deliveryDate?.message} />
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="order-pocket">{t('orders.fields.pocketStyle')}</Label>
          <FormInput id="order-pocket" {...register('pocketStyle')} />
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="order-button">{t('orders.fields.buttonType')}</Label>
          <FormInput id="order-button" {...register('buttonType')} />
        </div>
        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
          <Controller
            name="embroidery"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={v => field.onChange(v === true)}
                />
                {t('orders.fields.embroidery')}
              </label>
            )}
          />
          <Controller
            name="isUrgent"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={v => field.onChange(v === true)}
                />
                {t('orders.fields.isUrgent')}
              </label>
            )}
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={isSubmitting || customers.length === 0} className="w-full sm:w-auto">
            {isSubmitting
              ? t('actions.saving')
              : isEdit
                ? t('orders.saveUpdate')
                : t('orders.create')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
