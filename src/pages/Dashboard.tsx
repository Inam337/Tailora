import { useNavigate } from 'react-router-dom';

import { AppConstants } from '@/common/AppConstants';
import AppButton from '@/components/ui/AppButton';
import { useAuthStore } from '@/stores/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const onClickLogout = () => {
    logout();

    navigate(AppConstants.Routes.Public.Login);
  };

  return (
    <div>
      <div className="flex justify-end">
        <AppButton
          color="warning"
          onClick={onClickLogout}
        >
          Logout
        </AppButton>
      </div>

      <h1 className="text-2xl mb-3">Dashboard</h1>
    </div>
  );
}
