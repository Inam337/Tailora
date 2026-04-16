import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { RbIcon } from '@/components/icons/common/RbIcon';
import { IconColors } from '@/components/icons/types/RbIcon.types';

interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
  className?: string;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
}

export default function FileUpload({
  onFilesSelected,
  className = '',
  accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg',
  maxSize = 5 * 1024 * 1024, // 5MB
  disabled = false,
}: FileUploadProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const namespace = 'pages.applications.payment';
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / 1024 / 1024);

      toast.error(t(`${namespace}.validation.fileTooLarge`,
        `File size must be less than ${maxSizeMB}MB`));

      return;
    }

    // Validate file type
    const allowedExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;

    if (!allowedExtensions.includes(fileExtension)) {
      toast.error(t(`${namespace}.validation.invalidFileType`, 'Invalid file type'));

      return;
    }

    if (onFilesSelected) {
      onFilesSelected([file]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between border border-dashed border-gray-300
        rounded-lg p-4 bg-gray-50"
      >
        <div className="flex items-center gap-3 flex-1">
          <RbIcon
            name="upload"
            size={24}
            color={IconColors.GRAY_COLOR_ICON}
          />
          <span className="text-gray-700 text-sm">
            {t(`${namespace}.fields.uploadAttachment`, 'Upload an attachment (if any)')}
          </span>
        </div>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleUploadClick}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <RbIcon
            name="upload"
            size={16}
            color={IconColors.WHITE_COLOR_ICON}
          />
          {t(`${namespace}.actions.upload`, 'Upload')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
