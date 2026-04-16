import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { FormInput } from '@/components/ui/FormInput';
import { Textarea } from '@/components/ui/Textarea';
import FieldError from '@/components/ui/FieldError';
import Card from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { CustomerService } from '@/services/customerService';
import { createCustomerSchema, type CustomerFormValues } from '@/validation-schema/customer.schema';
import { AppConstants } from '@/common/AppConstants';
import { useTailoringStore } from '@/stores/tailoringStore';
import { CUSTOMER_GENDER_VALUES, type CustomerGender } from '@/models/tailoring';

interface CustomerFormProps {
  onCreated?: () => void;
  onUpdated?: () => void;
  editingCustomerId?: string | null;
}

export default function CustomerForm({
  onCreated,
  onUpdated,
  editingCustomerId,
}: CustomerFormProps) {
  const { t } = useTranslation(AppConstants.Tailoring.I18nNs);
  const customers = useTailoringStore(s => s.customers);
  const editingCustomer = customers.find(c => c.id === (editingCustomerId ?? ''));
  const schema = useMemo(
    () =>
      createCustomerSchema({
        nameMin: t('validation.customer.nameMin'),
        phoneMin: t('validation.customer.phoneMin'),
        emailInvalid: t('validation.customer.emailInvalid'),
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
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      gender: undefined,
    },
  });

  useEffect(() => {
    if (!editingCustomerId || !editingCustomer) {
      reset({ name: '', phone: '', email: '', address: '', gender: undefined });

      return;
    }

    reset({
      name: editingCustomer.name,
      phone: editingCustomer.phone,
      email: editingCustomer.email ?? '',
      address: editingCustomer.address ?? '',
      gender: editingCustomer.gender,
    });
  }, [editingCustomer, editingCustomerId, reset]);

  const onSubmit = async (values: CustomerFormValues) => {
    const payload = {
      name: values.name,
      phone: values.phone,
      email: values.email?.trim() || undefined,
      address: values.address?.trim() || undefined,
      gender: values.gender,
    };

    if (editingCustomerId && editingCustomer) {
      await CustomerService.update(editingCustomerId, payload);
      onUpdated?.();
    } else {
      await CustomerService.create(payload);
      reset();
      onCreated?.();
    }
  };

  const isEdit = Boolean(editingCustomerId && editingCustomer);

  return (
    <Card className="p-4 sm:p-6" shadow="md" radius="xl">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? t('customers.editTitle') : t('customers.formTitle')}
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="customer-name">{t('customers.fields.name')}</Label>
          <FormInput
            id="customer-name"
            autoComplete="name"
            placeholder={t('customers.placeholders.name')}
            {...register('name')}
          />
          <FieldError msg={errors.name?.message} />
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="customer-phone">{t('customers.fields.phone')}</Label>
          <FormInput
            id="customer-phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder={t('customers.placeholders.phone')}
            {...register('phone')}
          />
          <FieldError msg={errors.phone?.message} />
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label>{t('customers.fields.gender')}</Label>
          <Select
            value={watch('gender') ?? '__none__'}
            onValueChange={v =>
              setValue(
                'gender',
                v === '__none__' ? undefined : (v as CustomerGender),
                { shouldValidate: true },
              )}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('customers.placeholders.gender')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">{t('customers.genderNotSpecified')}</SelectItem>
              {CUSTOMER_GENDER_VALUES.map(g => (
                <SelectItem key={g} value={g}>
                  {t(`customers.gender.${g}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError msg={errors.gender?.message} />
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="customer-email">{t('customers.fields.email')}</Label>
          <FormInput
            id="customer-email"
            type="email"
            autoComplete="email"
            placeholder={t('customers.placeholders.email')}
            {...register('email')}
          />
          <FieldError msg={errors.email?.message} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="customer-address">{t('customers.fields.address')}</Label>
          <Textarea
            id="customer-address"
            rows={2}
            placeholder={t('customers.placeholders.address')}
            {...register('address')}
          />
          <FieldError msg={errors.address?.message} />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting
              ? t('actions.saving')
              : isEdit
                ? t('customers.saveUpdate')
                : t('customers.save')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
