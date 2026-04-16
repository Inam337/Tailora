import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import OrderForm from '@/components/tailoring/OrderForm';
import { AppConstants } from '@/common/AppConstants';

export default function OrderCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { t } = useTranslation(AppConstants.Tailoring.I18nNs);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
      <OrderForm
        editingOrderId={editId}
        onCreated={() => {
          toast.success(t('orders.createdToast'));
          navigate(AppConstants.Routes.Private.OrdersList);
        }}
        onUpdated={() => {
          toast.success(t('orders.updatedToast'));
          navigate(AppConstants.Routes.Private.OrdersList);
        }}
      />
    </div>
  );
}
