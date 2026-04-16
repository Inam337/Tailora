import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { AppConstants } from '@/common/AppConstants';

type PaymentSlipDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slipText: string;
  whatsappUrl: string | null;
};

export function PaymentSlipDialog({
  open,
  onOpenChange,
  slipText,
  whatsappUrl,
}: PaymentSlipDialogProps) {
  const { t } = useTranslation(AppConstants.Tailoring.I18nNs);

  const copySlip = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(slipText);
      toast.success(t('payments.slip.copiedToast'));
    } catch {
      toast.error(AppConstants.Strings.Errors.Global);
    }
  }, [slipText, t]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('payments.slip.title')}</DialogTitle>
        </DialogHeader>
        <pre
          className="text-xs bg-muted/50 rounded-lg p-4 whitespace-pre-wrap font-mono border
          border-gray-200 max-h-[40vh] overflow-y-auto"
        >
          {slipText}
        </pre>
        <div className="flex flex-col sm:flex-row gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => void copySlip()}
          >
            {t('payments.slip.copySlip')}
          </Button>
          {whatsappUrl
            ? (
                <Button
                  type="button"
                  asChild
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('payments.slip.openWhatsApp')}
                  </a>
                </Button>
              )
            : (
                <p className="text-sm text-muted-foreground self-center">
                  {t('payments.slip.missingPhone')}
                </p>
              )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
