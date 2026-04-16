import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PaymentForm from '@/components/tailoring/PaymentForm';
import { AppConstants } from '@/common/AppConstants';

export default function PaymentCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { t } = useTranslation(AppConstants.Tailoring.I18nNs);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full">
      <PaymentForm
        editingPaymentId={editId}
        onCreated={() => {
          toast.success(t('payments.createdToast'));
          navigate(AppConstants.Routes.Private.PaymentsList);
        }}
        onUpdated={() => {
          toast.success(t('payments.updatedToast'));
          navigate(AppConstants.Routes.Private.PaymentsList);
        }}
      />
    </div>
  );
}
