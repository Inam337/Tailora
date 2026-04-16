import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import CustomerForm from '@/components/tailoring/CustomerForm';
import { AppConstants } from '@/common/AppConstants';

export default function CustomerCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { t } = useTranslation(AppConstants.Tailoring.I18nNs);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full">
      <CustomerForm
        editingCustomerId={editId}
        onCreated={() => {
          toast.success(t('customers.createdToast'));
          navigate(AppConstants.Routes.Private.CustomersList);
        }}
        onUpdated={() => {
          toast.success(t('customers.updatedToast'));
          navigate(AppConstants.Routes.Private.CustomersList);
        }}
      />
    </div>
  );
}
