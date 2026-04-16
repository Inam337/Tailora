import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import type { FieldErrors, Resolver, UseFormRegister } from 'react-hook-form';

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
import { MeasurementService } from '@/services/measurementService';
import {
  createMeasurementSchema,
  type MeasurementFormValues,
} from '@/validation-schema/measurement.schema';
import { AppConstants } from '@/common/AppConstants';
import { useTailoringStore } from '@/stores/tailoringStore';
import {
  COAT_MEASURE_KEYS,
  getSectionKeysForStitchType,
  isMultiSectionStitchType,
  KAMEEZ_MEASURE_KEYS,
  MEASUREMENT_STITCH_TYPES,
  SHALWAR_SECTION_KEYS,
  TROUSER_SECTION_KEYS,
  type CoatMeasures,
  type Measurement,
  type MeasurementGarmentSections,
  type MeasurementSectionKey,
  type MeasurementStitchType,
  type ShalwarKameezSectionMeasures,
  type ShalwarSectionMeasures,
  type TrouserSectionMeasures,
  type WaistcoatSectionMeasures,
  WAISTCOAT_SECTION_KEYS,
} from '@/models/tailoring';
import type { MeasurementInput } from '@/stores/tailoringStore';

interface MeasurementFormProps {
  onCreated?: () => void;
  onUpdated?: () => void;
  editingMeasurementId?: string | null;
}

function pickNumericSection<T extends Record<string, number | undefined>>(
  g: Partial<T> | undefined,
  keys: ReadonlyArray<keyof T & string>,
): Partial<T> | undefined {
  if (!g) {
    return undefined;
  }

  const out = {} as Partial<T>;

  for (const key of keys) {
    const v = g[key];

    if (v != null && Number.isFinite(v)) {
      (out as Record<string, number>)[key as string] = v;
    }
  }

  return Object.keys(out).length ? out : undefined;
}

function mergeKameez(patch?: ShalwarKameezSectionMeasures): ShalwarKameezSectionMeasures {
  return { ...{}, ...patch };
}

function mergeShalwar(patch?: ShalwarSectionMeasures): ShalwarSectionMeasures {
  return { ...{}, ...patch };
}

function mergeWaistcoat(patch?: WaistcoatSectionMeasures): WaistcoatSectionMeasures {
  return { ...{}, ...patch };
}

function mergeTrouser(patch?: TrouserSectionMeasures): TrouserSectionMeasures {
  return { ...{}, ...patch };
}

function mergeCoat(patch?: CoatMeasures): CoatMeasures {
  return { ...{}, ...patch };
}

function buildDefaultFormValues(): MeasurementFormValues {
  return {
    customerId: '',
    stitchType: 'SHALWAR_KAMEEZ',
    name: '',
    sections: {
      kameez: {},
      shalwar: {},
      waistcoat: {},
      trouser: {},
    },
    simple: {},
  };
}

function pruneSectionsForStitch(
  stitchType: MeasurementStitchType,
  sec: NonNullable<MeasurementFormValues['sections']>,
): MeasurementGarmentSections | undefined {
  const allowed = new Set<MeasurementSectionKey>(getSectionKeysForStitchType(stitchType));
  const out: MeasurementGarmentSections = {};

  if (allowed.has('kameez')) {
    const kameez = pickNumericSection(sec.kameez, [...KAMEEZ_MEASURE_KEYS]);

    if (kameez) {
      out.kameez = kameez;
    }
  }

  if (allowed.has('shalwar')) {
    const shalwar = pickNumericSection(sec.shalwar, [...SHALWAR_SECTION_KEYS]);

    if (shalwar) {
      out.shalwar = shalwar;
    }
  }

  if (allowed.has('waistcoat')) {
    const waistcoat = pickNumericSection(sec.waistcoat, [...WAISTCOAT_SECTION_KEYS]);

    if (waistcoat) {
      out.waistcoat = waistcoat;
    }
  }

  if (allowed.has('trouser')) {
    const trouser = pickNumericSection(sec.trouser, [...TROUSER_SECTION_KEYS]);

    if (trouser) {
      out.trouser = trouser;
    }
  }

  return Object.keys(out).length ? out : undefined;
}

function measurementToFormValues(m: Measurement): MeasurementFormValues {
  return {
    customerId: m.customerId,
    stitchType: m.stitchType,
    name: m.name ?? '',
    sections: {
      kameez: mergeKameez(m.sections?.kameez),
      shalwar: mergeShalwar(m.sections?.shalwar),
      waistcoat: mergeWaistcoat(m.sections?.waistcoat),
      trouser: mergeTrouser(m.sections?.trouser),
    },
    simple: mergeCoat(m.simple),
  };
}

function valuesToPayload(values: MeasurementFormValues): MeasurementInput {
  const base = {
    customerId: values.customerId,
    stitchType: values.stitchType as MeasurementStitchType,
    name: values.name?.trim() || undefined,
  };

  if (isMultiSectionStitchType(values.stitchType)) {
    return {
      ...base,
      sections: values.sections
        ? pruneSectionsForStitch(values.stitchType as MeasurementStitchType, values.sections)
        : undefined,
      simple: undefined,
    };
  }

  return {
    ...base,
    sections: undefined,
    simple: pickNumericSection(values.simple, [...COAT_MEASURE_KEYS]),
  };
}

type SectionErrors = FieldErrors<Record<string, unknown>> | undefined;

function SectionFieldsBlock(props: {
  title: string;
  namePrefix: string;
  fields: readonly string[];
  register: UseFormRegister<MeasurementFormValues>;
  errors: SectionErrors;
  fieldLabel: (k: string) => string;
  numberPlaceholder: string;
}) {
  const { title, namePrefix, fields, register, errors, fieldLabel, numberPlaceholder } = props;
  const regField = register as (name: string) => ReturnType<UseFormRegister<MeasurementFormValues>>;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => {
          const id = `${namePrefix}-${field}`;

          return (
            <div
              key={field}
              className="space-y-2"
            >
              <Label htmlFor={id}>{fieldLabel(field)}</Label>
              <FormInput
                id={id}
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder={numberPlaceholder}
                {...regField(`${namePrefix}.${field}`)}
              />
              <FieldError
                msg={errors?.[field]?.message as string | undefined}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MeasurementForm({
  onCreated,
  onUpdated,
  editingMeasurementId,
}: MeasurementFormProps) {
  const { t } = useTranslation(AppConstants.Tailoring.I18nNs);
  const customers = useTailoringStore(s => s.customers);
  const measurements = useTailoringStore(s => s.measurements);
  const editing = measurements.find(m => m.id === (editingMeasurementId ?? ''));
  const schema = useMemo(
    () =>
      createMeasurementSchema({
        customerRequired: t('validation.measurement.customerRequired'),
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
  } = useForm<MeasurementFormValues>({
    resolver: zodResolver(schema) as Resolver<MeasurementFormValues>,
    defaultValues: buildDefaultFormValues(),
    mode: 'onChange',
  });
  const customerId = watch('customerId');
  const stitchType = watch('stitchType');
  const outfitSections = isMultiSectionStitchType(stitchType as MeasurementStitchType);
  const sectionSet = useMemo(
    () => new Set(getSectionKeysForStitchType(stitchType as MeasurementStitchType)),
    [stitchType],
  );

  useEffect(() => {
    if (!editingMeasurementId || !editing) {
      reset(buildDefaultFormValues());

      return;
    }

    reset(measurementToFormValues(editing));
  }, [editing, editingMeasurementId, reset]);

  const onSubmit = async (values: MeasurementFormValues) => {
    const payload = valuesToPayload(values);

    if (editingMeasurementId && editing) {
      await MeasurementService.update(editingMeasurementId, payload);
      onUpdated?.();
    } else {
      await MeasurementService.create(payload);
      reset({
        ...buildDefaultFormValues(),
        customerId: values.customerId,
      });
      onCreated?.();
    }
  };

  const isEdit = Boolean(editingMeasurementId && editing);
  const fieldLabel = (key: string) => t(`measurements.fields.${key}`);

  return (
    <Card
      className="p-4 sm:p-6"
      shadow="md"
      radius="xl"
    >
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? t('measurements.editTitle') : t('measurements.formTitle')}
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>{t('measurements.fields.customer')}</Label>
            <Select
              value={customerId || undefined}
              onValueChange={v => setValue('customerId', v, { shouldValidate: true })}
              disabled={isEdit}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('measurements.placeholders.customer')} />
              </SelectTrigger>
              <SelectContent>
                {customers.map(c => (
                  <SelectItem
                    key={c.id}
                    value={c.id}
                  >
                    {c.name}
                    {' '}
                    <span className="text-muted-foreground text-xs">
                      (
                      {c.phone}
                      )
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError msg={errors.customerId?.message} />
          </div>
          <div className="space-y-2">
            <Label>{t('measurements.fields.stitchType')}</Label>
            <Controller
              name="stitchType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('measurements.placeholders.stitchType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {MEASUREMENT_STITCH_TYPES.map(st => (
                      <SelectItem
                        key={st}
                        value={st}
                      >
                        {t(`measurements.stitchType.${st}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError msg={errors.stitchType?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="measurement-name">{t('measurements.fields.name')}</Label>
            <FormInput
              id="measurement-name"
              placeholder={t('measurements.placeholders.name')}
              {...register('name')}
            />
            <FieldError msg={errors.name?.message} />
          </div>
        </div>

        {outfitSections
          ? (
              <div
                key={stitchType}
                className="grid grid-cols-1 gap-8"
              >
                {sectionSet.has('kameez') && (
                  <SectionFieldsBlock
                    title={t('measurements.sections.kameez')}
                    namePrefix="sections.kameez"
                    fields={KAMEEZ_MEASURE_KEYS as unknown as string[]}
                    register={register}
                    errors={errors.sections?.kameez as SectionErrors}
                    fieldLabel={fieldLabel}
                    numberPlaceholder={t('measurements.placeholders.number')}
                  />
                )}
                {sectionSet.has('shalwar') && (
                  <SectionFieldsBlock
                    title={t('measurements.sections.shalwar')}
                    namePrefix="sections.shalwar"
                    fields={SHALWAR_SECTION_KEYS as unknown as string[]}
                    register={register}
                    errors={errors.sections?.shalwar as SectionErrors}
                    fieldLabel={fieldLabel}
                    numberPlaceholder={t('measurements.placeholders.number')}
                  />
                )}
                {sectionSet.has('waistcoat') && (
                  <SectionFieldsBlock
                    title={t('measurements.sections.waistcoat')}
                    namePrefix="sections.waistcoat"
                    fields={WAISTCOAT_SECTION_KEYS as unknown as string[]}
                    register={register}
                    errors={errors.sections?.waistcoat as SectionErrors}
                    fieldLabel={fieldLabel}
                    numberPlaceholder={t('measurements.placeholders.number')}
                  />
                )}
                {sectionSet.has('trouser') && (
                  <SectionFieldsBlock
                    title={t('measurements.sections.trouser')}
                    namePrefix="sections.trouser"
                    fields={TROUSER_SECTION_KEYS as unknown as string[]}
                    register={register}
                    errors={errors.sections?.trouser as SectionErrors}
                    fieldLabel={fieldLabel}
                    numberPlaceholder={t('measurements.placeholders.number')}
                  />
                )}
              </div>
            )
          : (
              <SectionFieldsBlock
                title={t('measurements.sections.coatBlock')}
                namePrefix="simple"
                fields={COAT_MEASURE_KEYS as unknown as string[]}
                register={register}
                errors={errors.simple as SectionErrors}
                fieldLabel={fieldLabel}
                numberPlaceholder={t('measurements.placeholders.number')}
              />
            )}

        <div>
          <Button
            type="submit"
            disabled={isSubmitting || customers.length === 0}
            className="w-full sm:w-auto"
          >
            {isSubmitting
              ? t('actions.saving')
              : isEdit
                ? t('measurements.saveUpdate')
                : t('measurements.save')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
