import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { FormInput } from '@/components/ui/FormInput';
import FieldError from '@/components/ui/FieldError';
import Card from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { PaymentService } from '@/services/paymentService';
import { createPaymentSchema, type PaymentFormValues } from '@/validation-schema/payment.schema';
import { AppConstants } from '@/common/AppConstants';
import { useTailoringStore } from '@/stores/tailoringStore';

interface PaymentFormProps {
  onCreated?: () => void;
  onUpdated?: () => void;
  editingPaymentId?: string | null;
}

export default function PaymentForm({
  onCreated,
  onUpdated,
  editingPaymentId,
}: PaymentFormProps) {
  const { t } = useTranslation(AppConstants.Tailoring.I18nNs);
  const orders = useTailoringStore(s => s.orders);
  const payments = useTailoringStore(s => s.payments);
  const editing = payments.find(p => p.id === (editingPaymentId ?? ''));
  const schema = useMemo(
    () =>
      createPaymentSchema({
        orderRequired: t('validation.payment.orderRequired'),
        amountInvalid: t('validation.payment.amountInvalid'),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orderId: '',
      amount: 0,
      paymentMethod: 'CASH',
    },
  });

  const orderId = watch('orderId');

  useEffect(() => {
    if (!editingPaymentId || !editing) {
      reset({ orderId: '', amount: 0, paymentMethod: 'CASH' });

      return;
    }

    reset({
      orderId: editing.orderId,
      amount: editing.amount,
      paymentMethod: editing.paymentMethod,
    });
  }, [editing, editingPaymentId, reset]);

  const onSubmit = async (values: PaymentFormValues) => {
    if (editingPaymentId && editing) {
      await PaymentService.update(editingPaymentId, {
        amount: values.amount,
        paymentMethod: values.paymentMethod,
      });
      onUpdated?.();
    } else {
      await PaymentService.create({
        orderId: values.orderId,
        amount: values.amount,
        paymentMethod: values.paymentMethod,
      });
      reset({ orderId: values.orderId, amount: 0, paymentMethod: 'CASH' });
      onCreated?.();
    }
  };

  const isEdit = Boolean(editingPaymentId && editing);

  return (
    <Card className="p-4 sm:p-6" shadow="md" radius="xl">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? t('payments.editTitle') : t('payments.formTitle')}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label>{t('payments.fields.order')}</Label>
          <Select
            value={orderId || undefined}
            onValueChange={v => setValue('orderId', v, { shouldValidate: true })}
            disabled={isEdit}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('payments.placeholders.order')} />
            </SelectTrigger>
            <SelectContent>
              {orders.map(o => (
                <SelectItem key={o.id} value={o.id}>
                  {o.dressType}
                  {' '}
                  —
                  {' '}
                  {o.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError msg={errors.orderId?.message} />
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="pay-amount">{t('payments.fields.amount')}</Label>
          <FormInput
            id="pay-amount"
            type="number"
            min={1}
            step="1"
            inputMode="numeric"
            {...register('amount', { valueAsNumber: true })}
          />
          <FieldError msg={errors.amount?.message} />
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label>{t('payments.fields.method')}</Label>
          <Select
            value={watch('paymentMethod')}
            onValueChange={v =>
              setValue('paymentMethod', v as PaymentFormValues['paymentMethod'], { shouldValidate: true })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AppConstants.Tailoring.PaymentMethods.map(method => (
                <SelectItem key={method} value={method}>
                  {t(`payments.methods.${method}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError msg={errors.paymentMethod?.message} />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={isSubmitting || orders.length === 0} className="w-full sm:w-auto">
            {isSubmitting
              ? t('actions.saving')
              : isEdit
                ? t('payments.saveUpdate')
                : t('payments.submit')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
