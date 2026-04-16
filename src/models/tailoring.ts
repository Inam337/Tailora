export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED';

export type PaymentMethod = 'CASH' | 'CARD' | 'JAZZCASH' | 'EASYPAISA';

export const CUSTOMER_GENDER_VALUES = ['MALE', 'FEMALE', 'OTHER'] as const;
export type CustomerGender = (typeof CUSTOMER_GENDER_VALUES)[number];

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gender?: CustomerGender;
}

/** Kameez / kurta top piece (multi-section outfits). */
export type ShalwarKameezSectionMeasures = {
  kurtaLength?: number;
  chest?: number;
  waist?: number;
  shoulder?: number;
  sleeveLength?: number;
  neck?: number;
  daman?: number;
  shalwarLength?: number;
  thigh?: number;
};

export const KAMEEZ_MEASURE_KEYS = [
  'kurtaLength',
  'chest',
  'waist',
  'shoulder',
  'sleeveLength',
  'neck',
  'daman',
  'shalwarLength',
  'thigh',
] as const satisfies readonly (keyof ShalwarKameezSectionMeasures)[];

export type ShalwarSectionMeasures = {
  waist?: number;
  hip?: number;
  thigh?: number;
  rise?: number;
  length?: number;
  bottom?: number;
  knee?: number;
};

export const SHALWAR_SECTION_KEYS = [
  'waist',
  'hip',
  'thigh',
  'rise',
  'length',
  'bottom',
  'knee',
] as const satisfies readonly (keyof ShalwarSectionMeasures)[];

export type TrouserSectionMeasures = {
  waist?: number;
  hip?: number;
  thigh?: number;
  knee?: number;
  bottom?: number;
  length?: number;
  rise?: number;
};

export const TROUSER_SECTION_KEYS = [
  'waist',
  'hip',
  'thigh',
  'knee',
  'bottom',
  'length',
  'rise',
] as const satisfies readonly (keyof TrouserSectionMeasures)[];

export type WaistcoatSectionMeasures = {
  chest?: number;
  waist?: number;
  shoulder?: number;
  length?: number;
  armhole?: number;
};

export const WAISTCOAT_SECTION_KEYS = [
  'chest',
  'waist',
  'shoulder',
  'length',
  'armhole',
] as const satisfies readonly (keyof WaistcoatSectionMeasures)[];

/** Waist / winter / summer coat (single block on measurement). */
export type CoatMeasures = {
  chest?: number;
  waist?: number;
  shoulder?: number;
  sleeveLength?: number;
  coatLength?: number;
  backLength?: number;
  lapelWidth?: number;
};

export const COAT_MEASURE_KEYS = [
  'chest',
  'waist',
  'shoulder',
  'sleeveLength',
  'coatLength',
  'backLength',
  'lapelWidth',
] as const satisfies readonly (keyof CoatMeasures)[];

export type MeasurementStitchType =
  | 'SHALWAR_KAMEEZ'
  | 'KURTA_SHALWAR'
  | 'KURTA_TROUSER'
  | 'SHALWAR_KAMEEZ_WAISTCOAT'
  | 'WAIST_COAT'
  | 'WINTER_COAT'
  | 'SUMMER_COAT';

export const MEASUREMENT_STITCH_TYPES: readonly MeasurementStitchType[] = [
  'SHALWAR_KAMEEZ',
  'KURTA_SHALWAR',
  'KURTA_TROUSER',
  'SHALWAR_KAMEEZ_WAISTCOAT',
  'WAIST_COAT',
  'WINTER_COAT',
  'SUMMER_COAT',
] as const;

/** Types that use kameez / shalwar / waistcoat / trouser sections. */
export const MEASUREMENT_MULTI_SECTION_STITCH_TYPES: readonly MeasurementStitchType[] = [
  'SHALWAR_KAMEEZ',
  'KURTA_SHALWAR',
  'KURTA_TROUSER',
  'SHALWAR_KAMEEZ_WAISTCOAT',
] as const;

export function isMultiSectionStitchType(stitchType: MeasurementStitchType): boolean {
  return (MEASUREMENT_MULTI_SECTION_STITCH_TYPES as readonly string[]).includes(stitchType);
}

/** Garment blocks shown in the measurement form for each outfit stitch type. */
export type MeasurementSectionKey = 'kameez' | 'shalwar' | 'waistcoat' | 'trouser';

export function getSectionKeysForStitchType(
  stitchType: MeasurementStitchType,
): readonly MeasurementSectionKey[] {
  switch (stitchType) {
    case 'SHALWAR_KAMEEZ':
    case 'KURTA_SHALWAR':
      return ['kameez', 'shalwar'];
    case 'KURTA_TROUSER':
      return ['kameez', 'trouser'];
    case 'SHALWAR_KAMEEZ_WAISTCOAT':
      return ['kameez', 'shalwar', 'waistcoat'];
    default:
      return [];
  }
}

export interface MeasurementGarmentSections {
  kameez?: ShalwarKameezSectionMeasures;
  shalwar?: ShalwarSectionMeasures;
  waistcoat?: WaistcoatSectionMeasures;
  trouser?: TrouserSectionMeasures;
}

export interface Measurement {
  id: string;
  customerId: string;
  stitchType: MeasurementStitchType;
  name?: string;
  /** Used when `isMultiSectionStitchType(stitchType)`. */
  sections?: MeasurementGarmentSections;
  /** Used for waist / winter / summer coat (single block). */
  simple?: CoatMeasures;
}

export interface Order {
  id: string;
  customerId: string;
  measurementId?: string;
  dressType: string;
  stitchingCost: number;
  embroidery?: boolean;
  pocketStyle?: string;
  buttonType?: string;
  deliveryDate?: string;
  isUrgent?: boolean;
  totalAmount: number;
  status: OrderStatus;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
}
