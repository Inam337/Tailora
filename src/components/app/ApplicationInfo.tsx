import { useTranslation } from 'react-i18next';

import type { ApplicantInfo } from '@/models/Applications';

export interface ApplicationInfoProps {
  applicantInfo: ApplicantInfo | null;
  className?: string;

  /** @deprecated Use hiddenFields instead */
  hideAln?: boolean;

  applicantNameLabel?: string;

  /** Only keys from ApplicantInfo are allowed (type-safe) */
  hiddenFields?: readonly (keyof ApplicantInfo)[];
}

const NAMESPACE = 'pages.applications';

export function ApplicationInfo({
  applicantInfo,
  className = '',
  hideAln = false,
  applicantNameLabel,
  hiddenFields,
}: ApplicationInfoProps) {
  const { t } = useTranslation();

  if (!applicantInfo) {
    return null;
  }

  const shouldShow = (field: keyof ApplicantInfo) =>
    !hiddenFields?.includes(field);

  return (
    <div
      className={`p-6 mb-4 bg-yellow-50 border border-gray-200 rounded-xl ${className}`}
    >
      <h3 className="text-md font-semibold text-gray-700 mb-4">
        {t(`${NAMESPACE}.applicantInfo.title`)}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {shouldShow('applicantName') && (
          <div>
            <p className="text-xs text-gray-600 mb-1">
              {applicantNameLabel
                || t(`${NAMESPACE}.applicantInfo.fields.applicantName`)}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {applicantInfo.applicantName}
            </p>
          </div>
        )}

        {shouldShow('visaType') && (
          <div>
            <p className="text-xs text-gray-600 mb-1">
              {t(`${NAMESPACE}.applicantInfo.fields.visaType`)}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {applicantInfo.visaType}
            </p>
          </div>
        )}

        {shouldShow('docketNumber') && (
          <div>
            <p className="text-xs text-gray-600 mb-1">
              {t(`${NAMESPACE}.applicantInfo.fields.docketNumber`)}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {applicantInfo.docketNumber}
            </p>
          </div>
        )}

        {shouldShow('embassy') && (
          <div>
            <p className="text-xs text-gray-600 mb-1">
              {t(`${NAMESPACE}.applicantInfo.fields.embassy`)}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {applicantInfo.embassy}
            </p>
          </div>
        )}

        {shouldShow('aln') && !hideAln && (
          <div>
            <p className="text-xs text-gray-600 mb-1">
              {t(`${NAMESPACE}.applicantInfo.fields.aln`)}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {applicantInfo.aln}
            </p>
          </div>
        )}

        {shouldShow('passportNo') && (
          <div>
            <p className="text-xs text-gray-600 mb-1">
              {t(`${NAMESPACE}.applicantInfo.fields.passportNo`)}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {applicantInfo.passportNo}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
