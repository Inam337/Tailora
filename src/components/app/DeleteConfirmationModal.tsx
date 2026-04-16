import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { RbIcon } from '@/components/icons/common/RbIcon';
import { IconColors } from '@/components/icons/types/RbIcon.types';

export interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordId: string | number;
  onConfirm: () => Promise<void>;
  title?: string;
  message?: string;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  recordId,
  title,
  message,
}: DeleteConfirmationModalProps) {
  const { t } = useTranslation('common');
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // Parent may toast errors
    } finally {
      setIsLoading(false);
    }
  };

  const bodyText = message
    ?? t('modals.delete.messageWithId', { id: String(recordId) });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md bg-white p-0">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {title ?? t('modals.delete.title')}
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex flex-col items-center space-y-6 pt-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <RbIcon
                name="trash"
                size={32}
                color={IconColors.RED_COLOR_ICON}
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {title ?? t('modals.delete.title')}
              </h3>
              <p className="text-sm text-gray-600 px-6">
                {bodyText}
              </p>
            </div>
            <div className="flex justify-end gap-3 w-full pt-4 px-6 pb-6">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="min-w-[100px]"
              >
                {t('text.no')}
              </Button>
              <LoadingButton
                loading={isLoading}
                onClick={handleConfirm}
                variant="destructive"
              >
                {t('text.yes')}
              </LoadingButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
