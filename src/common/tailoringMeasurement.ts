import type { Measurement, MeasurementGarmentSections } from '@/models/tailoring';
import {
  COAT_MEASURE_KEYS,
  getSectionKeysForStitchType,
  isMultiSectionStitchType,
  KAMEEZ_MEASURE_KEYS,
  SHALWAR_SECTION_KEYS,
  TROUSER_SECTION_KEYS,
  WAISTCOAT_SECTION_KEYS,
} from '@/models/tailoring';

function appendNumericFields(
  parts: string[],
  obj: Record<string, number | undefined> | undefined,
  keys: readonly string[],
  labelField: (k: string) => string,
  sectionTag: string,
) {
  if (!obj) {
    return;
  }

  for (const key of keys) {
    const val = obj[key];

    if (val != null) {
      parts.push(`${labelField(key)} (${sectionTag}): ${val}`);
    }
  }
}

/** Human-readable size summary for tables and search. */
export function measurementSizeSummary(
  m: Measurement,
  labelField: (k: string) => string,
): string {
  const parts: string[] = [];
  const allowed = new Set(getSectionKeysForStitchType(m.stitchType));

  if (m.sections && isMultiSectionStitchType(m.stitchType)) {
    const s = m.sections as MeasurementGarmentSections;

    if (allowed.has('kameez')) {
      appendNumericFields(
        parts,
        s.kameez as Record<string, number | undefined> | undefined,
        KAMEEZ_MEASURE_KEYS as unknown as string[],
        labelField,
        'K',
      );
    }

    if (allowed.has('shalwar')) {
      appendNumericFields(
        parts,
        s.shalwar as Record<string, number | undefined> | undefined,
        SHALWAR_SECTION_KEYS as unknown as string[],
        labelField,
        'S',
      );
    }

    if (allowed.has('waistcoat')) {
      appendNumericFields(
        parts,
        s.waistcoat as Record<string, number | undefined> | undefined,
        WAISTCOAT_SECTION_KEYS as unknown as string[],
        labelField,
        'W',
      );
    }

    if (allowed.has('trouser')) {
      appendNumericFields(
        parts,
        s.trouser as Record<string, number | undefined> | undefined,
        TROUSER_SECTION_KEYS as unknown as string[],
        labelField,
        'T',
      );
    }
  }

  if (!isMultiSectionStitchType(m.stitchType)) {
    appendNumericFields(
      parts,
      m.simple as Record<string, number | undefined> | undefined,
      COAT_MEASURE_KEYS as unknown as string[],
      labelField,
      'C',
    );
  }

  return parts.length ? parts.join(' · ') : '—';
}

function collectNumericBlob(obj: Record<string, number | undefined> | undefined, keys: readonly string[]) {
  if (!obj) {
    return '';
  }

  return keys.map(k => (obj[k] != null ? String(obj[k]) : '')).filter(Boolean).join(' ');
}

/** Flat string used for global filtering in lists. */
export function measurementSearchBlob(m: Measurement): string {
  const bits: string[] = [m.id, m.customerId, m.name ?? ''];
  const allowed = new Set(getSectionKeysForStitchType(m.stitchType));

  if (m.sections && isMultiSectionStitchType(m.stitchType)) {
    if (allowed.has('kameez')) {
      bits.push(
        collectNumericBlob(
          m.sections.kameez as Record<string, number | undefined> | undefined,
          KAMEEZ_MEASURE_KEYS as unknown as string[],
        ),
      );
    }

    if (allowed.has('shalwar')) {
      bits.push(
        collectNumericBlob(
          m.sections.shalwar as Record<string, number | undefined> | undefined,
          SHALWAR_SECTION_KEYS as unknown as string[],
        ),
      );
    }

    if (allowed.has('waistcoat')) {
      bits.push(
        collectNumericBlob(
          m.sections.waistcoat as Record<string, number | undefined> | undefined,
          WAISTCOAT_SECTION_KEYS as unknown as string[],
        ),
      );
    }

    if (allowed.has('trouser')) {
      bits.push(
        collectNumericBlob(
          m.sections.trouser as Record<string, number | undefined> | undefined,
          TROUSER_SECTION_KEYS as unknown as string[],
        ),
      );
    }
  }

  if (!isMultiSectionStitchType(m.stitchType)) {
    bits.push(
      collectNumericBlob(
        m.simple as Record<string, number | undefined> | undefined,
        COAT_MEASURE_KEYS as unknown as string[],
      ),
    );
  }

  return bits.join(' ');
}

export function measurementListTitle(m: Measurement, stitchLabel: string): string {
  if (m.name?.trim()) {
    return m.name.trim();
  }

  return stitchLabel;
}
