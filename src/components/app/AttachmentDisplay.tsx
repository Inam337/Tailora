import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { RbIcon } from '@/components/icons/common/RbIcon';
import { IconColors } from '@/components/icons/types/RbIcon.types';
import { cn } from '@/libs/utils';
import {
  FileTypes,
  DefaultNotAvailableText,
  AttachmentDisplayConfig,
} from '@/models/attachment';

interface Attachment {
  id: string | number;
  name: string;
  type: string;
  size?: string | number;
  url?: string;
  fileName?: string;
  fileTitle?: string;
  presignedUrl?: string;
  title?: string; // For backward compatibility
  file?: File; // For draft attachments
  path?: string; // For server attachments
}

interface AttachmentDisplayProps {
  attachments: Attachment[];
  onDownload?: (attachment: Attachment) => void;
  onRemove?: (attachment: Attachment) => void;
  noAttachmentsText?: string;
  className?: string;
  gridCols?: '1' | '2' | '3' | '4';
  iconSize?: number;
  downloadIconSize?: number;
  showFilePath?: boolean; // New prop to show file path/URL
  showFileType?: boolean; // New prop to show file type
  showRemove?: boolean; // New prop to show remove button
}

export default function AttachmentDisplay({
  attachments,
  onDownload,
  onRemove,
  noAttachmentsText,
  className = '',
  gridCols = AttachmentDisplayConfig.defaults.gridCols as '1' | '2' | '3' | '4',
  iconSize = AttachmentDisplayConfig.defaults.iconSize,
  downloadIconSize = AttachmentDisplayConfig.defaults.downloadIconSize,
  showFilePath = false, // Default to false
  showFileType = false, // Default to false
  showRemove = false, // Default to false
}: AttachmentDisplayProps) {
  const { t } = useTranslation();
  const [thumbnailUrls, setThumbnailUrls] = useState<Map<string | number, string>>(new Map());

  // Generate thumbnails for image files
  useEffect(() => {
    const newThumbnailUrls = new Map<string | number, string>();

    attachments.forEach((attachment) => {
      // Check if it's an image file
      const isImage = attachment.file
        ? attachment.file.type.startsWith('image/')
        : attachment.type?.startsWith('image/')
          || /\.(jpg|jpeg|png|gif|webp)$/i.test(
            attachment.fileName || attachment.name || '',
          );

      if (isImage) {
        // If we have a File object, create object URL
        if (attachment.file) {
          const url = URL.createObjectURL(attachment.file);

          newThumbnailUrls.set(attachment.id, url);
        } else if (attachment.url || attachment.presignedUrl) {
          // If we have a URL, use it directly
          newThumbnailUrls.set(attachment.id, attachment.url || attachment.presignedUrl || '');
        }
      }
    });

    setThumbnailUrls(newThumbnailUrls);

    // Cleanup object URLs on unmount
    return () => {
      newThumbnailUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [attachments]);

  const getFileIconName = (fileType: string): string => {
    const type = fileType.toLowerCase();

    if (type.includes('pdf') || type === FileTypes.APPLICATION_PDF) {
      return 'attachment'; // Use attachment icon for PDF
    } else if (
      type.includes('doc')
      || type === FileTypes.APPLICATION_MSWORD
      || type === FileTypes.APPLICATION_DOCX
    ) {
      return 'attachment'; // Use attachment icon for Word
    } else if (
      type.includes('xls')
      || type === FileTypes.APPLICATION_MSEXCEL
      || type === FileTypes.APPLICATION_XLSX
    ) {
      return 'attachment'; // Use attachment icon for Excel
    } else if (
      type.includes('image')
      || type.includes('png')
      || type.includes('jpg')
      || type.includes('jpeg')
    ) {
      return 'attachment'; // Use attachment icon for images (we'll show thumbnail instead)
    }

    return 'attachment'; // Default
  };

  const getFileIcon = (attachment: Attachment) => {
    const fileType = getFileTypeForIcon(attachment);
    const iconName = getFileIconName(fileType);
    const thumbnailUrl = thumbnailUrls.get(attachment.id);

    // Show thumbnail for images if available
    if (thumbnailUrl) {
      return (
        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={thumbnailUrl}
            alt={getDisplayName(attachment)}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to icon if image fails to load
              const parent = e.currentTarget.parentElement;

              if (parent) {
                parent.innerHTML = '';

                const fallbackDiv = document.createElement('div');
                const p1 = 'M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22';
                const p2 = 'H18C19.1 22 20 21.1 20 20V8L14 2Z';
                const svgPath = `${p1}${p2}`;

                fallbackDiv.className
                  = 'w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center';
                fallbackDiv.innerHTML
                  = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none">
                  <path d="${svgPath}" fill="#9CA3AF"/>
                </svg>`;

                parent.appendChild(fallbackDiv);
              }
            }}
          />
        </div>
      );
    }

    // Show icon for non-image files or when thumbnail is not available
    return (
      <div
        className={cn(
          'w-12 h-12 rounded-lg bg-gray-100 border border-gray-200',
          'flex items-center justify-center',
        )}
      >
        <RbIcon
          name={iconName as 'attachment'}
          size={iconSize}
          color={IconColors.GRAY_COLOR_ICON}
        />
      </div>
    );
  };

  // Helper function to format file size
  const formatFileSize = (size: string | number): string => {
    if (typeof size === 'string') {
      // If already formatted, return as is
      if (size.includes('KB') || size.includes('MB') || size.includes('GB')) {
        return size;
      }

      // Try to parse as number
      const numSize = parseFloat(size);

      if (!isNaN(numSize)) {
        return formatBytes(numSize);
      }

      return size; // Return original if can't parse
    }

    if (typeof size === 'number') {
      return formatBytes(size);
    }

    return DefaultNotAvailableText.NOT_AVAILABLE;
  };

  // Helper function to convert bytes to human readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to get the best display name for the attachment
  const getDisplayName = (attachment: Attachment): string => {
    // Priority: fileTitle > fileName > name > title
    return (
      attachment.fileTitle
      || attachment.fileName
      || attachment.name
      || attachment.title
      || DefaultNotAvailableText.UNTITLED
    );
  };

  // Helper function to get the file path/URL for display
  const getFilePath = (attachment: Attachment): string | null => {
    // Priority: url > presignedUrl > path
    return attachment.url || attachment.presignedUrl || attachment.path || null;
  };

  // Helper function to get the file type for display
  const getFileTypeForDisplay = (attachment: Attachment): string => {
    if (attachment.file && attachment.file.type) {
      return attachment.file.type;
    }

    if (attachment.type) {
      return attachment.type;
    }

    // Try to infer from actual filename, not display name
    const actualFileName = attachment.fileName || attachment.name || '';
    const extension = actualFileName.split('.').pop()?.toLowerCase();

    if (extension) {
      return `.${extension}`;
    }

    return DefaultNotAvailableText.NOT_AVAILABLE;
  };

  // Helper function to get the best file type for icon display
  const getFileTypeForIcon = (attachment: Attachment): string => {
    // If we have a file object, use its type
    if (attachment.file && attachment.file.type) {
      return attachment.file.type;
    }

    // Try to infer from actual filename first, not display name
    const actualFileName = attachment.fileName || attachment.name || '';
    const extension = actualFileName.split('.').pop()?.toLowerCase();

    if (extension) {
      // Map common extensions to MIME types for better pattern matching
      const extensionMap: Record<string, string> = {
        pdf: FileTypes.APPLICATION_PDF,
        doc: FileTypes.APPLICATION_MSWORD,
        docx: FileTypes.APPLICATION_DOCX,
        xls: FileTypes.APPLICATION_MSEXCEL,
        xlsx: FileTypes.APPLICATION_XLSX,
        csv: 'text/csv',
        jpg: FileTypes.IMAGE_JPEG,
        jpeg: FileTypes.IMAGE_JPEG,
        png: FileTypes.IMAGE_PNG,
        gif: 'image/gif',
        bmp: 'image/bmp',
        webp: 'image/webp',
        svg: 'image/svg+xml',
        txt: 'text/plain',
        rtf: 'application/rtf',
      };

      // For PNG files, return the exact MIME type to ensure proper icon display
      if (extension === 'png') {
        return FileTypes.IMAGE_PNG;
      }

      if (extension === 'jpeg') {
        return 'image/jpeg';
      }

      return extensionMap[extension] || `application/${extension}`;
    }

    // If we have a type field, use it
    if (attachment.type) {
      return attachment.type;
    }

    return FileTypes.APPLICATION_OCTET_STREAM; // Default fallback
  };

  const getGridColsClass = () => {
    const cols = Number(gridCols) as keyof typeof AttachmentDisplayConfig.gridCols;

    return AttachmentDisplayConfig.gridCols[cols] || AttachmentDisplayConfig.gridCols[3];
  };

  const handleDownload = (attachment: Attachment) => {
    if (onDownload) {
      onDownload(attachment);
    } else {
      // Default download behavior
      if (attachment.url || attachment.presignedUrl) {
        const link = document.createElement('a');

        link.href = attachment.url || attachment.presignedUrl || '';
        link.download = attachment.name || attachment.fileName || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (attachment.file) {
        // For File objects, create download link
        const url = URL.createObjectURL(attachment.file);
        const link = document.createElement('a');

        link.href = url;
        link.download = attachment.file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }
  };

  const ATTACHMENT_ICON_SIZE = 48;

  return (
    <div className={className}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-gray-900">
          {t('attachments.text.title', 'Attachments')}
        </h2>
      </div>

      {/* Attachments Grid */}
      {attachments && attachments.length > 0
        ? (
            <div className={`grid ${getGridColsClass()} gap-4`}>
              {attachments.map(attachment => (
                <div
                  key={attachment.id}
                  className={cn(
                    'relative flex items-start gap-3 p-3 rounded-lg border border-gray-200',
                    'bg-white hover:bg-gray-50 transition-colors',
                  )}
                >
                  {/* File Icon/Thumbnail */}
                  <div className="shrink-0">
                    {getFileIcon(attachment)}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    {/* File Name - Primary display */}
                    <p
                      className="text-sm font-semibold text-gray-900 truncate mb-1"
                      title={getDisplayName(attachment)}
                    >
                      {getDisplayName(attachment)}
                    </p>

                    {/* File Name - Show actual filename if different from display name */}
                    {(attachment.fileName || attachment.name) && (
                      <p
                        className="text-xs text-gray-500 truncate mb-1"
                        title={attachment.fileName || attachment.name || ''}
                      >
                        {t('attachments.text.file', 'File')}
                        :
                        {' '}
                        {attachment.fileName || attachment.name}
                      </p>
                    )}

                    {/* File Size */}
                    {attachment.size && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.size)}
                      </p>
                    )}

                    {/* File Type - Show when enabled */}
                    {showFileType && (
                      <p className="text-xs text-gray-400 mt-1">
                        {t('attachments.text.type', 'Type')}
                        :
                        {' '}
                        {getFileTypeForDisplay(attachment)}
                      </p>
                    )}

                    {/* File Path/URL - Show when enabled */}
                    {showFilePath && getFilePath(attachment) && (
                      <p
                        className="text-xs text-gray-400 mt-1 truncate"
                        title={getFilePath(attachment) || ''}
                      >
                        {t('attachments.text.path', 'Path')}
                        :
                        {' '}
                        {getFilePath(attachment)}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Download Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="p-2 hover:bg-primary/10 border-primary/30"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDownload(attachment);
                      }}
                      title={t('attachments.text.download', 'Download')}
                    >
                      <RbIcon
                        name="download"
                        size={downloadIconSize}
                        color={IconColors.PRIMARY_COLOR_ICON}
                      />
                    </Button>

                    {/* Remove Button */}
                    {showRemove && onRemove && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="p-2 hover:bg-red-50 border-red-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onRemove(attachment);
                        }}
                        title={t('attachments.text.remove', 'Remove')}
                      >
                        <RbIcon
                          name="trash"
                          size={downloadIconSize}
                          color={IconColors.RED_COLOR_ICON}
                        />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        : (
            <div
              className="w-full flex flex-col justify-center items-center gap-4 text-center py-8"
              style={{ color: '#6B7280' }}
            >
              <div className="bg-gray-100 p-4 rounded-md">
                <RbIcon
                  name="attachment"
                  size={ATTACHMENT_ICON_SIZE}
                  color={IconColors.GRAY_COLOR_ICON}
                />
              </div>
              <p className="text-sm mb-0 text-gray-500 font-italic">
                {noAttachmentsText
                  || t(
                    'attachments.text.noAttachments',
                    AttachmentDisplayConfig.notAvailable.noAttachments,
                  )}
              </p>
            </div>
          )}
    </div>
  );
}
