import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import MeasurementForm from '@/components/tailoring/MeasurementForm';
import { AppConstants } from '@/common/AppConstants';

export default function MeasurementCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { t } = useTranslation(AppConstants.Tailoring.I18nNs);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {editId ? t('measurements.editTitle') : t('measurements.formTitle')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('measurements.formPageHint')}
        </p>
      </div>
      <MeasurementForm
        editingMeasurementId={editId}
        onCreated={() => {
          toast.success(t('measurements.createdToast'));
          navigate(AppConstants.Routes.Private.MeasurementsList);
        }}
        onUpdated={() => {
          toast.success(t('measurements.updatedToast'));
          navigate(AppConstants.Routes.Private.MeasurementsList);
        }}
      />
    </div>
  );
}
