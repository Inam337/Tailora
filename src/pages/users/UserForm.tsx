import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

import SuspenseLoading from '@/components/ui/SuspenseLoading';
import { cn } from '@/libs/utils';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import Card from '@/components/ui/Card';
import { Button, Label, LoadingButton } from '@/components/ui/index';
import { Switch } from '@/components/ui/index';
import { AppConstants } from '@/common/AppConstants';
import type { UserFormProps } from '@/models/User';
import { FormInput } from '@/components/ui/FormInput';
import PasswordInput from '@/components/ui/PasswordInput';
import { DatePicker } from '@/components/ui/AppDatePicker';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown';
import FieldError from '@/components/ui/FieldError';
import { useRoleStore } from '@/stores/roleStore';
import { useUserStore } from '@/stores/userStore';
import { lookupService, type LookupItem } from '@/services/lookup.service';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/Tooltip';
import { RbIcon } from '@/components/icons/common/RbIcon';
import { IconColors } from '@/components/icons/types/RbIcon.types';
// Simplified form data interface
interface SimpleUserFormData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  designation?: string;
  missionsEmbassies?: string[];
  password: string;
  confirmPassword?: string; // Optional - only required when password is provided
  role: string;
  branches?: string[];
  isActive?: boolean;
}

// Cognito password policy regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
// Note: Currently not used, but kept for future password validation requirements
// const PASSWORD_REGEX
//   = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,
// .<>?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{8,}$/;
// Validation schema factory - needs to be created inside component to access translations
// Validation rules match backend API validation
const createUserFormSchema = (t: (key: string, defaultValue?: string) =>
string, namespace: string, isEdit: boolean = false) => z.object({
  fullName: z
    .string()
    .min(1, t(`${namespace}.validation.fullNameRequired`, 'Full name is required.'))
    .max(100, t(`${namespace}.validation.fullNameMaxLength`, 'Full name cannot exceed 100 characters.')),
  email: z
    .string()
    .min(1, t(`${namespace}.validation.emailRequired`, 'Email is required.'))
    .max(255, t(`${namespace}.validation.emailMaxLength`, 'Email cannot exceed 255 characters.'))
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t(`${namespace}.validation.emailInvalid`, 'Invalid email format.')),
  phoneNumber: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      // Backend validation: optional, maxLength: 15, pattern: ^\+?[0-9]{7,15}$
      if (!val || val.length === 0) return; // Optional field

      if (val.length > 15) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t(`${namespace}.validation.phoneNumberMaxLength`, 'Phone number cannot exceed 15 characters.'),
        });

        return;
      }

      if (!/^\+?[0-9]{7,15}$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t(`${namespace}.validation.phoneNumberInvalid`,
            'Invalid phone number format. Must be 7-15 digits with optional + prefix.'),
        });
      }
    }),
  dateOfBirth: z
    .string()
    .optional(),
  designation: z
    .string()
    .optional()
    .refine(
      val => !val || val.length <= 200,
      t(`${namespace}.validation.designationMaxLength`, 'Designation cannot exceed 200 characters.'),
    ),
  missionsEmbassies: z
    .array(z.string())
    .optional(),
  // Password is required only in create mode, optional in edit mode
  // Backend validation: required in create, optional in edit, minLength: 6
  // Note: Cognito may have additional requirements (8+ chars with complexity), but form validation matches backend API
  password: isEdit
    ? z.string().optional().refine(
        (val) => {
          // If password is provided in edit mode, validate it
          if (!val || val.length === 0) return true;

          // Backend validation: minLength: 6
          return val.length >= 6;
        },
        {
          message: t(`${namespace}.validation.passwordMinLength`, 'Password must be at least 6 characters long.'),
        },
      )
    : z
        .string()
        .min(1, t(`${namespace}.validation.passwordRequired`, 'Password is required.'))
        .min(6, t(`${namespace}.validation.passwordMinLength`, 'Password must be at least 6 characters long.')),
  // Confirm password is required only if password is provided
  confirmPassword: z.string().optional(),
  role: z
    .string()
    .min(1, t(`${namespace}.validation.roleRequired`)),
  branches: z
    .array(z.string())
    .optional(),
  isActive: z
    .boolean()
    .default(true),
}).refine((data) => {
  // Only validate password match if password is provided
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }

  return true;
}, {
  message: t(`${namespace}.validation.passwordsDoNotMatch`),
  path: ['confirmPassword'],
});

export default function UserForm({
  initialValues,
  isEdit = false,
}: UserFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const editId = params.id ? parseInt(params.id) : null;
  const actualIsEdit = isEdit || !!editId;
  const namespace = actualIsEdit ? 'pages.users.edit' : 'pages.users.create';
  const userFormSchema = createUserFormSchema(
    (key: string, defaultValue?: string) => t(key, defaultValue),
    namespace,
    actualIsEdit,
  );
  // Fetch roles from store
  const { allRoles, fetchAllRoles, isLoadingAllRoles } = useRoleStore();
  // Use user store for create/update operations
  const {
    createUser,
    updateUser,
    fetchUserById,
    selectedUser,
    isLoadingUser,
    userError,
  } = useUserStore();
  // State for branches and embassies
  const [branches, setBranches] = useState<LookupItem[]>([]);
  const [embassies, setEmbassies] = useState<LookupItem[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [isLoadingEmbassies, setIsLoadingEmbassies] = useState(false);

  // Fetch roles on component mount
  // Edit mode: fetch roles FIRST, then user - so roles are ready when form populates
  // Create mode: fetch active roles only
  useEffect(() => {
    if (actualIsEdit && editId) {
      // Edit mode: fetch roles first, then user - roles will already be available when user data loads
      fetchAllRoles()
        .then(() => fetchUserById(editId).catch((error) => {
          toast.error(error instanceof Error ? error.message : 'Failed to load user');
        }))
        .catch((error) => {
          console.error('Failed to fetch roles:', error);
          toast.error('Failed to load roles');
        });
    } else if (!actualIsEdit) {
      // Create mode: fetch active roles only
      fetchAllRoles({ active: true }).catch((error) => {
        console.error('Failed to fetch roles:', error);
        toast.error('Failed to load roles');
      });
    }
  }, [actualIsEdit, editId, fetchAllRoles, fetchUserById]);

  // Fetch branches on component mount
  useEffect(() => {
    setIsLoadingBranches(true);
    lookupService.fetchBranches({ page: 1, pageSize: 100 })
      .then((response) => {
        if (response.response?.data) {
          setBranches(response.response.data);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch branches:', error);
        toast.error('Failed to load branches');
      })
      .finally(() => {
        setIsLoadingBranches(false);
      });
  }, []);

  // Fetch embassies on component mount
  useEffect(() => {
    setIsLoadingEmbassies(true);
    lookupService.fetchEmbassies({ page: 1, pageSize: 100 })
      .then((response) => {
        if (response.response?.data) {
          setEmbassies(response.response.data);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch embassies:', error);
        toast.error('Failed to load embassies');
      })
      .finally(() => {
        setIsLoadingEmbassies(false);
      });
  }, []);

  // Map embassies to missions/embassies format (for MultiSelectDropdown)
  const missionsEmbassies = embassies.map(embassy => ({
    id: embassy.id.toString(),
    name: embassy.name,
  }));
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<SimpleUserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: initialValues?.fullName || '',
      email: initialValues?.email || '',
      phoneNumber: initialValues?.phoneNumber || '',
      dateOfBirth: initialValues?.dateOfBirth || '',
      designation: initialValues?.designationName || '',
      missionsEmbassies: [],
      password: '',
      confirmPassword: '',
      role: '',
      branches: [],
      isActive: true,
    },
    mode: 'onChange',
  }); // Map roles to dropdown format
  // Only show active roles, but in edit mode also include the user's role (even if inactive)
  // Use selectedUser.roleIds so the option exists before form value is set - fixes server timing
  const currentRoleId = watch('role');
  const userRoleIds = actualIsEdit && selectedUser?.id === editId && selectedUser.roleIds
    ? selectedUser.roleIds.map(id => id.toString())
    : [];
  const roles = allRoles
    .filter((role) => {
      // Always include active roles
      if (role.isActive) return true;

      // In edit mode, include the user's role from selectedUser (ensures option exists on preselect)
      // and the form's current value (for when user changes selection)
      const roleIdStr = role.id?.toString();

      if (actualIsEdit && roleIdStr && (currentRoleId === roleIdStr || userRoleIds.includes(roleIdStr))) {
        return true;
      }

      return false;
    })
    .map(role => ({
      id: role.id?.toString() || '',
      name: role.roleName || '',
    })); // Helper function to convert date from ISO format (YYYY-MM-DD) to DD/MM/YYYY for display
  const convertDateToDisplayFormat = (dateString: string): string => {
    if (!dateString) {
      return '';
    }

    // Check if date is in ISO format (YYYY-MM-DD)
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');

      return `${day}/${month}/${year}`;
    }

    // If already in DD/MM/YYYY format, return as is
    return dateString;
  };

  // Populate form when user data is loaded in edit mode
  // Wait for branches and roles to be loaded before populating fields
  useEffect(() => {
    if (
      selectedUser
      && actualIsEdit
      && editId
      && selectedUser.id === editId
      && branches.length > 0
      && allRoles.length > 0
    ) {
      // Map missions/embassies from API format to form format (array of string IDs)
      const missionsEmbassiesIds = selectedUser.missionsEmbassies
        ? selectedUser.missionsEmbassies.map(embassy => embassy.id.toString())
        : [];
      // Convert date from ISO to display format
      const displayDate = convertDateToDisplayFormat(selectedUser.dateOfBirth);
      // Get the first role ID (assuming single role selection for now)
      const roleId = selectedUser.roleIds && selectedUser.roleIds.length > 0
        ? selectedUser.roleIds[0].toString()
        : '';

      reset({
        fullName: selectedUser.fullName || '',
        email: selectedUser.email || '',
        phoneNumber: selectedUser.mobileNumber || '',
        dateOfBirth: displayDate,
        designation: selectedUser.designation || '',
        missionsEmbassies: missionsEmbassiesIds,
        password: '', // Keep password empty in edit mode
        confirmPassword: '', // Keep confirm password empty in edit mode
        role: roleId,
        branches: (selectedUser.branchIds && selectedUser.branchIds.length > 0)
          ? selectedUser.branchIds.map(id => id.toString())
          : (selectedUser.branchId ? [selectedUser.branchId.toString()] : []), // Fallback to legacy branchId
        isActive: selectedUser.isActive ?? true,
      });
    }
  }, [selectedUser, actualIsEdit, editId, reset, branches, allRoles]);

  // Update branches field when branches are loaded (in case branches load after user data)
  useEffect(() => {
    if (
      selectedUser
      && actualIsEdit
      && editId
      && selectedUser.id === editId
      && branches.length > 0
      && ((selectedUser.branchIds && selectedUser.branchIds.length > 0) || selectedUser.branchId)
    ) {
      // Only update branches if they're not already set correctly
      const currentBranches = watch('branches') || [];
      // Handle both new format (branchIds array) and old format (branchId number)
      const expectedBranches = (selectedUser.branchIds && selectedUser.branchIds.length > 0)
        ? selectedUser.branchIds.map(id => id.toString())
        : (selectedUser.branchId ? [selectedUser.branchId.toString()] : []); // Check if arrays are different
      const currentSet = new Set(currentBranches);
      const isDifferent = currentBranches.length !== expectedBranches.length
        || !expectedBranches.every(id => currentSet.has(id));

      if (isDifferent) {
        setValue('branches', expectedBranches, {
          shouldValidate: true,
          shouldDirty: false,
        });
      }
    }
  }, [branches, selectedUser, actualIsEdit, editId, setValue, watch]);

  // Track that we've passed initial role population - once true, never go back to loading
  // (avoids infinite loading when user changes role in dropdown)
  const hasInitiallyPopulatedRoleRef = useRef(false);

  // Reset ref when editing a different user
  useEffect(() => {
    hasInitiallyPopulatedRoleRef.current = false;
  }, [editId]);

  // Update role field when roles are loaded (in case roles load after user data)
  useEffect(() => {
    if (
      selectedUser
      && actualIsEdit
      && editId
      && selectedUser.id === editId
      && allRoles.length > 0
      && selectedUser.roleIds
      && selectedUser.roleIds.length > 0
    ) {
      // Only update role if it's not already set correctly
      const currentRole = watch('role');
      const expectedRole = selectedUser.roleIds[0].toString();

      if (currentRole !== expectedRole) {
        setValue('role', expectedRole, {
          shouldValidate: true,
          shouldDirty: false,
        });
      } else {
        hasInitiallyPopulatedRoleRef.current = true;
      }
    }
  }, [allRoles, selectedUser, actualIsEdit, editId, setValue, watch]);

  // Mark initial population complete when role matches (so we don't re-enter loading on user change)
  useEffect(() => {
    const expectedRoleId = selectedUser
      && selectedUser.id === editId
      && selectedUser.roleIds?.length
      ? selectedUser.roleIds[0].toString()
      : '';

    if (expectedRoleId && currentRoleId === expectedRoleId) {
      hasInitiallyPopulatedRoleRef.current = true;
    }
  }, [selectedUser, editId, currentRoleId]);

  // Show loading state while fetching user data and roles in edit mode
  // Wait until role value is populated in dropdown before showing form (only on initial load)
  const expectedRoleId = selectedUser
    && selectedUser.id === editId
    && selectedUser.roleIds?.length
    ? selectedUser.roleIds[0].toString()
    : '';
  const canPopulateRole = allRoles.length > 0;
  const isRolePopulated = hasInitiallyPopulatedRoleRef.current
    || !expectedRoleId
    || !canPopulateRole
    || currentRoleId === expectedRoleId;
  const isEditLoading = actualIsEdit && (
    isLoadingUser
    || isLoadingAllRoles
    || (editId && !selectedUser)
    || !isRolePopulated
  );

  if (isEditLoading) {
    return (
      <div className="fixed top-0 left-0 w-full inset-0 bg-white/60 h-screen flex items-center justify-center z-60">
        <SuspenseLoading size="lg" />
      </div>
    );
  }

  // Show error state if user fetch failed
  if (actualIsEdit && userError) {
    return (
      <div className="p-4">
        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600 mb-2">
              {t('pages.users.edit.errorLoading', 'Error Loading User')}
            </h3>
            <p className="text-gray-600 mb-4">{userError}</p>
            <Button onClick={() => navigate(AppConstants.Routes.Private.Users.LIST)}>
              {t('common.actions.back', 'Back to List')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Helper function to convert date from DD/MM/YYYY to ISO 8601 format (YYYY-MM-DD)
  const convertDateFormat = (dateString: string): string => {
    // Check if date is already in ISO format
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }

    // Convert from DD/MM/YYYY to YYYY-MM-DD
    const parts = dateString.split('/');

    if (parts.length === 3) {
      const [day, month, year] = parts;

      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // If format is not recognized, return as is (API might handle it)
    return dateString;
  };

  const onSubmit: SubmitHandler<SimpleUserFormData> = async (data) => {
    try {
      const isValid = await trigger();

      if (!isValid) {
        toast.error(t(`${namespace}.messages.fillRequiredFields`));

        return;
      }

      if (actualIsEdit && editId) {
        // EDIT FLOW: Update existing user using PUT API
        // Only include password if it's provided (user wants to change password)
        const updateData: {
          id: number;
          fullName: string;
          email: string;
          phoneNumber?: string;
          dateOfBirth?: string;
          designation?: string;
          missionsEmbassies?: Array<{ id: number; name: string }>;
          password?: string;
          confirmPassword?: string;
          roleIds?: number[];
          branchIds?: number[];
          isActive?: boolean;
        } = {
          id: editId,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber || undefined,
          dateOfBirth: data.dateOfBirth
            ? convertDateFormat(data.dateOfBirth)
            : undefined,
          designation: data.designation,
          missionsEmbassies: data.missionsEmbassies
            ? data.missionsEmbassies.map((id) => {
                const embassy = embassies.find(e => e.id.toString() === id);

                return embassy ? { id: embassy.id, name: embassy.name } : null;
              }).filter((item): item is { id: number; name: string } => item !== null)
            : undefined,
          roleIds: data.role ? [parseInt(data.role, 10)] : [],
          branchIds: data.branches && data.branches.length > 0
            ? data.branches.map(id => parseInt(id, 10))
            : undefined,
          isActive: data.isActive ?? true,
        };

        // Only include password fields if password is provided
        if (data.password && data.password.length > 0) {
          updateData.password = data.password;
          updateData.confirmPassword = data.confirmPassword;
        }

        await updateUser(updateData);

        toast.success(
          t(`${namespace}.messages.userUpdated`, 'User updated successfully!'),
          {
            duration: 3000,
            position: 'top-right',
          },
        );
      } else {
        // CREATE FLOW: Create new user using POST API
        await createUser({
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber || '',
          dateOfBirth: data.dateOfBirth
            ? convertDateFormat(data.dateOfBirth)
            : '',
          designation: data.designation,
          missionsEmbassies: data.missionsEmbassies
            ? data.missionsEmbassies.map((id) => {
                const embassy = embassies.find(e => e.id.toString() === id);

                return embassy ? { id: embassy.id, name: embassy.name } : null;
              }).filter((item): item is { id: number; name: string } => item !== null)
            : undefined,
          password: data.password,
          confirmPassword: data.confirmPassword,
          roleIds: data.role ? [parseInt(data.role, 10)] : [],
          branchIds: data.branches && data.branches.length > 0
            ? data.branches.map(id => parseInt(id, 10))
            : [],
          isActive: data.isActive ?? true,
        });

        toast.success(
          t(`${namespace}.messages.userCreated`, 'User created successfully!'),
          {
            duration: 3000,
            position: 'top-right',
          },
        );
      }

      // Wait a bit before navigating to ensure toast is visible
      setTimeout(() => {
        navigate(AppConstants.Routes.Private.Users.LIST);
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : t(`${namespace}.messages.submitFailed`, 'Failed to submit form');

      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  const getErrorMessage = (fieldName: keyof SimpleUserFormData) => {
    const error = errors[fieldName];

    return (error?.message as string) || '';
  };

  const errorBorder = (fieldName: keyof SimpleUserFormData) =>
    getErrorMessage(fieldName)
      ? 'border-red-500 focus-visible:ring-red-500'
      : '';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground">
            {t(`${namespace}.title`)}
          </h2>
          <p className="text-sm text-black mt-1">
            {t(`${namespace}.subtitle`)}
          </p>
        </div>
        <Card className="pt-4 pb-4">

          <div className="px-4">

            {/* Basic Information Section */}
            <div className="space-y-4 mb-4">
              <h3 className="text-lg font-medium text-black dark:text-white pb-2">
                {t(`${namespace}.sections.basicInformation`)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    {t(`${namespace}.fields.fullName`)}
                    {' '}
                    <span className="text-red-400">*</span>
                  </Label>
                  <FormInput
                    id="fullName"
                    {...register('fullName', {
                      onChange: (e) => {
                        const value = e.target.value;
                        const alphabeticValue = value.replace(/[^a-zA-Z\s]/g, '');

                        if (value !== alphabeticValue) {
                          e.target.value = alphabeticValue;
                          setValue('fullName', alphabeticValue, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      },
                    })}
                    error={getErrorMessage('fullName')}
                    placeholder={t(`${namespace}.placeholders.fullName`)}
                    className={cn('w-full', errorBorder('fullName'))}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t(`${namespace}.fields.email`)}
                    {' '}
                    <span className="text-red-400">*</span>
                  </Label>
                  <FormInput
                    id="email"
                    type="email"
                    {...register('email')}
                    error={getErrorMessage('email')}
                    placeholder={t(`${namespace}.placeholders.email`)}
                    className={cn('w-full', errorBorder('email'))}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    {t(`${namespace}.fields.phoneNumber`)}
                  </Label>
                  <FormInput
                    id="phoneNumber"
                    {...register('phoneNumber', {
                      onChange: (e) => {
                        // Remove spaces and dashes, keep only digits
                        const value = e.target.value.replace(/[^\d]/g, '');

                        if (value !== e.target.value) {
                          e.target.value = value;
                          setValue('phoneNumber', value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      },
                    })}
                    error={getErrorMessage('phoneNumber')}
                    placeholder={t(`${namespace}.placeholders.phoneNumber`)}
                    className={cn('w-full', errorBorder('phoneNumber'))}
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    {t(`${namespace}.fields.dateOfBirth`)}
                  </Label>
                  <DatePicker
                    onDateSelect={(date) => {
                      setValue('dateOfBirth', date, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    initialDate={watch('dateOfBirth') ? new Date(watch('dateOfBirth')) : undefined}
                  />
                  {getErrorMessage('dateOfBirth') && (
                    <p className="text-sm text-red-500">
                      {getErrorMessage('dateOfBirth')}
                    </p>
                  )}
                </div>

                {/* Designation */}
                <div className="space-y-2">
                  <Label htmlFor="designation">
                    {t(`${namespace}.fields.designation`)}
                  </Label>
                  <FormInput
                    id="designation"
                    type="text"
                    {...register('designation')}
                    error={getErrorMessage('designation')}
                    placeholder={t(`${namespace}.placeholders.designation`)}
                    className={cn('w-full', errorBorder('designation'))}
                  />
                </div>

                {/* Missions / Embassies */}
                <div className="space-y-2">
                  <Label htmlFor="missionsEmbassies">
                    {t(`${namespace}.fields.missionsEmbassies`)}
                  </Label>
                  <MultiSelectDropdown
                    options={isLoadingEmbassies
                      ? []
                      : missionsEmbassies.map(item => ({
                          value: item.id,
                          label: item.name,
                        }))}
                    showSelectAll
                    selectAllLabel="Select all embassies"
                    selectedValues={(() => {
                      const value = watch('missionsEmbassies');
                      const ids = Array.isArray(value) ? value : (value ? [value] : []);

                      return ids.map((id) => {
                        const item = missionsEmbassies.find(m => m.id === id);

                        return item
                          ? { value: item.id, label: item.name }
                          : { value: id, label: id };
                      });
                    })()}
                    onSelectionChange={(selected) => {
                      setValue(
                        'missionsEmbassies',
                        selected.map(option => option.value),
                        { shouldValidate: true },
                      );
                    }}
                    placeholder={isLoadingEmbassies
                      ? 'Loading embassies...'
                      : t(`${namespace}.placeholders.missionsEmbassies`)}
                    className={cn(errorBorder('missionsEmbassies'))}
                    width="100%"
                  />
                  <FieldError msg={getErrorMessage('missionsEmbassies')} />
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-black dark:text-white pb-2">
                {t(`${namespace}.sections.accountInformation`)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 relative">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-1"
                    >
                      {t(`${namespace}.fields.password`)}
                      {!actualIsEdit && (
                        <>
                          {' '}
                          <span className="text-red-400">*</span>
                        </>
                      )}
                      {actualIsEdit && (
                        <span className="text-xs text-black ml-1">
                          (
                          {t('pages.users.edit.passwordOptional', 'Optional - leave empty to keep current password')}
                          )
                        </span>
                      )}
                    </Label>
                    {!actualIsEdit && (
                      <Tooltip>
                        <TooltipTrigger
                          asChild
                          className="absolute right-1 top-0 "
                        >
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-full outline-0 shadow-none
                            focus:outline-none cursor-pointer"
                            aria-label="Password requirements"
                          >
                            <RbIcon
                              name="info"
                              size={20}
                              color={IconColors.GRAY_COLOR_ICON}
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="max-w-xs"
                        >
                          {t(`${namespace}.hints.passwordRequirements`)}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <PasswordInput
                    id="password"
                    name="password"
                    register={register('password', {
                      onChange: () => {
                        // Trigger validation on change for real-time feedback
                        trigger('password');
                      },
                    })}
                    error={getErrorMessage('password')}
                    placeholder={actualIsEdit
                      ? t('pages.users.edit.passwordPlaceholder', 'Leave empty to keep current password')
                      : t(`${namespace}.placeholders.password`)}
                    className={cn('w-full', errorBorder('password'))}
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {t(`${namespace}.fields.confirmPassword`)}
                    {!actualIsEdit && (
                      <>
                        {' '}
                        <span className="text-red-400">*</span>
                      </>
                    )}
                  </Label>
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    register={register('confirmPassword')}
                    error={getErrorMessage('confirmPassword')}
                    placeholder={actualIsEdit
                      ? t('pages.users.edit.confirmPasswordPlaceholder', 'Leave empty to keep current password')
                      : t(`${namespace}.placeholders.password`)}
                    className={cn('w-full', errorBorder('confirmPassword'))}
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">
                    {t(`${namespace}.fields.role`)}
                    {' '}
                    <span className="text-red-400">*</span>
                  </Label>
                  <SearchableDropdown
                    value={watch('role') || ''}
                    onChange={value => setValue('role', value)}
                    options={roles.map(role => ({
                      value: role.id,
                      label: role.name,
                    }))}
                    placeholder={t(`${namespace}.placeholders.role`)}
                  />
                  {getErrorMessage('role') && (
                    <p className="text-sm text-red-500">
                      {getErrorMessage('role')}
                    </p>
                  )}
                </div>

                {/* Branches */}
                <div className="space-y-2">
                  <Label htmlFor="branches">
                    {t(`${namespace}.fields.branch`)}
                  </Label>
                  <MultiSelectDropdown
                    options={isLoadingBranches
                      ? []
                      : branches.map(branch => ({
                          value: branch.id.toString(),
                          label: branch.name,
                        }))}
                    showSelectAll
                    selectAllLabel="Select all branches"
                    selectedValues={(() => {
                      const value = watch('branches');
                      const ids = Array.isArray(value) ? value : (value ? [value] : []);

                      return ids.map((id) => {
                        const branch = branches.find(b => b.id.toString() === id);

                        return branch
                          ? { value: branch.id.toString(), label: branch.name }
                          : { value: id, label: id };
                      });
                    })()}
                    onSelectionChange={(selected) => {
                      setValue(
                        'branches',
                        selected.map(option => option.value),
                        { shouldValidate: true },
                      );
                    }}
                    placeholder={isLoadingBranches
                      ? 'Loading branches...'
                      : t(`${namespace}.placeholders.location`)}
                    className={cn(errorBorder('branches'))}
                    width="100%"
                  />
                  <FieldError msg={getErrorMessage('branches')} />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg
            shadow-sm border border-gray-300"
              >
                <div>
                  <label className="text-sm font-medium text-black">
                    {t(`${namespace}.fields.activeStatus`)}
                  </label>
                  <p className="text-sm font-medium text-gray-700">
                    {t(`${namespace}.hints.userCanLoginImmediately`)}
                  </p>
                </div>
                <Switch
                  checked={watch('isActive')}
                  onChange={checked => setValue('isActive', checked)}
                />
              </div>
            </div>

          </div>
        </Card>

      </div>
      {/* Form Actions */}
      <div className="flex justify-end p-4 w-full
         bg-white border-t border-gray-200 shadow-lg"
      >
        <div className="w-full flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(AppConstants.Routes.Private.Users.LIST)}
          >
            {t(`${namespace}.actions.cancel`)}
          </Button>
          <LoadingButton
            variant="default"
            type="submit"
            loading={isSubmitting}
            loadingText={actualIsEdit
              ? t(`${namespace}.actions.updating`)
              : t(`${namespace}.actions.creating`)}
          >
            {actualIsEdit
              ? t(`${namespace}.actions.update`)
              : t(`${namespace}.actions.create`)}
          </LoadingButton>
        </div>
      </div>
    </form>
  );
}
