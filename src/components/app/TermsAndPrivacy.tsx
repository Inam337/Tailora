import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Logo from '@/assets/images/logos/logo.svg';
import { Button } from '@/components/ui/Button';
import { AppConstants } from '@/common/AppConstants';
import { RbIcon } from '@/components/icons/common/RbIcon';
import { IconColors } from '@/components/icons/types/RbIcon.types';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold text-blue-900 mb-4">
      {title}
    </h2>
    <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
      {children}
    </div>
  </section>
);
const SubSection = ({ number, title, children }: {
  number: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h3 className="text-base font-semibold text-blue-700 mb-2">
      {number}
      {' '}
      {title}
    </h3>
    <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
      {children}
    </div>
  </div>
);
const SubSubSection = ({ number, title, children }: {
  number: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-4 ml-4">
    <h4 className="text-sm font-semibold text-gray-900 mb-2">
      {number}
      {' '}
      {title}
    </h4>
    <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
      {children}
    </div>
  </div>
);
const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc pl-5 space-y-1.5">
    {items.map((item, i) => (
      <li
        key={i}
        className="text-sm text-gray-700"
      >
        {item}
      </li>
    ))}
  </ul>
);

export default function TermsAndPrivacy() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      {/* Header with Back Button and Logo */}
      <div className="max-w-4xl mx-auto mb-2 px-0">
        <div className="w-full flex items-center justify-between">
          {/* Back to Login Button - Left */}
          <Button
            variant="outline"
            onClick={() => navigate(AppConstants.Routes.Public.Login)}
          >
            <RbIcon
              name="arrowChevronLeft"
              size={16}
              color={IconColors.PRIMARY_COLOR_ICON}
            />
            {t('privacyPolicy.button.backToLogin')}
          </Button>
          {/* Logo - Centered */}
          <div className="flex items-center justify-center">
            <img
              src={Logo}
              width={150}
              height={50}
              alt="RAHBER Logo"
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white shadow-lg border border-gray-200 rounded-lg px-8 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('privacyPolicy.header.title')}
          </h1>
          <p className="text-lg text-gray-700">
            {t('privacyPolicy.header.subtitle')}
          </p>
        </div>

        {/* Metadata Table */}
        <div className="mb-10">
          <table className="w-full border border-gray-300 border-collapse mb-6">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium
                  text-gray-500 uppercase tracking-wider"
                >
                  {t('privacyPolicy.metadata.complianceReference')}
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium
                  text-gray-500 uppercase tracking-wider"
                >
                  {t('privacyPolicy.metadata.documentStatus')}
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium
                  text-gray-500 uppercase tracking-wider"
                >
                  {t('privacyPolicy.metadata.effectiveDate')}
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium
                  text-gray-500 uppercase tracking-wider"
                >
                  {t('privacyPolicy.metadata.documentCode')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  {t('privacyPolicy.metadata.gdprAlignedControls')}
                  <br />
                  <strong>{t('privacyPolicy.metadata.version')}</strong>
                  <br />
                  1.1
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  {t('privacyPolicy.metadata.approvedInternalUse')}
                  <br />
                  <strong>{t('privacyPolicy.metadata.lastUpdated')}</strong>
                  <br />
                  21 Jan 2026
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  15 Jan 2026
                  <br />
                  <strong>{t('privacyPolicy.metadata.owner')}</strong>
                  <br />
                  {t('privacyPolicy.metadata.dataProtectionOfficer')}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  RFS-Global-DP-1.1
                  <br />
                  <strong>{t('privacyPolicy.metadata.audience')}</strong>
                  <br />
                  {t('privacyPolicy.metadata.employeesContractorsUsers')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick Summary */}
        <Section title={t('privacyPolicy.sections.quickSummary')}>
          <p>
            This document sets the rules for using the RFS Global Customer Relationship Management (CRM)
            system (the &apos;System&apos;) and the minimum privacy and data-handling standards that apply when you
            access or process applicant, customer, or partner information. It is intended for internal users only. By
            accessing the System, you agree to comply with these requirements and with all applicable laws,
            policies, and procedures.
          </p>
          <p className="mb-3">
            <strong className="font-bold text-gray-900">Key points (read first):</strong>
          </p>
          <List
            items={[
              'Use the CRM system only for approved business purposes within your assigned role.',
              'Never share passwords or authentication tokens. Use MFA where enabled.',
              'Do not export, screenshot, or store personal data outside approved RFS systems.',
              'Report any suspected security incident or data breach immediately.',
              'Route all privacy-related requests to the DPO / Compliance team.',
            ]}
          />
        </Section>

        {/* Definitions */}
        <Section title={t('privacyPolicy.sections.definitions')}>
          <ul className="list-disc pl-5 space-y-1.5">
            <li className="text-sm text-gray-900">
              <strong>System:</strong>
              {' '}
              RFS Global CRM platform and related modules.
            </li>
            <li className="text-sm text-gray-900">
              <strong>Personal Data:</strong>
              {' '}
              Any information relating to an identifiable individual.
            </li>
            <li className="text-sm text-gray-900">
              <strong>Special category data:</strong>
              {' '}
              Sensitive personal data such as biometrics or health data.
            </li>
            <li className="text-sm text-gray-900">
              <strong>Processing:</strong>
              {' '}
              Any operation performed on personal data.
            </li>
            <li className="text-sm text-gray-900">
              <strong>DPO/Compliance:</strong>
              {' '}
              Data Protection Officer or Compliance team.
            </li>
          </ul>
        </Section>

        {/* Terms of Use */}
        <Section title={t('privacyPolicy.sections.termsOfUse')}>
          <p className="mb-4">
            The CRM system is proprietary to RFS Global and is provided solely to
            support legitimate business activities including visa processing,
            appointment management, customer service, and reporting.
          </p>

          <SubSection
            number="1.1"
            title={t('privacyPolicy.subsections.purposeAndScope')}
          >
            <p>
              The System is proprietary to RFS Global and is provided solely to support
              legitimate business activities including visa processing, appointment
              management, customer service, and reporting. You may not use the System
              for personal purposes or any activity not authorized by your role.
            </p>
          </SubSection>

          <SubSection
            number="1.2"
            title={t('privacyPolicy.subsections.authorizedUsersAndAcceptance')}
          >
            <p>
              Access is granted only to employees, contractors, and authorized third
              parties who have completed required training and signed applicable
              agreements. By accessing the System, you acknowledge that you have read,
              understood, and agree to comply with this document.
            </p>
          </SubSection>

          <SubSection
            number="1.3"
            title={t('privacyPolicy.subsections.accountsCredentialsAndAccessControl')}
          >
            <List
              items={[
                'Unique credentials: Each user must have a unique account. Sharing accounts is prohibited.',
                'Least privilege: Access is granted based on role and business need. '
                + 'Do not request access beyond your role requirements.',
                'Session security: Log out when not in use, especially on shared devices.',
                'Account lifecycle: Report changes in role or termination immediately to IT/HR.',
              ]}
            />
          </SubSection>

          <SubSection
            number="1.4"
            title={t('privacyPolicy.subsections.permittedUse')}
          >
            <p className="mb-2">You may use the System only to:</p>
            <List
              items={[
                'Create, update, and manage cases and appointments within your authorized scope.',
                'Communicate with applicants through approved channels (e.g., official email, SMS via the System).',
                'Perform verification and due diligence tasks as part of your role.',
                'Generate role-approved reports and dashboards.',
              ]}
            />
          </SubSection>

          <SubSection
            number="1.5"
            title={t('privacyPolicy.subsections.prohibitedUse')}
          >
            <p className="mb-2">The following actions are strictly prohibited (non-exhaustive):</p>
            <List
              items={[
                'Accessing records without a valid business need or outside your authorized scope.',
                'Exporting, downloading, or sharing personal data without explicit authorization.',
                'Using personal email, WhatsApp, or social media to share System data.',
                'Storing personal data on local devices, USB drives, or cloud storage not approved by IT.',
                'Altering records to conceal mistakes, incidents, or unauthorized actions.',
                'Bypassing security controls or attempting to gain unauthorized access.',
                'Using automated tools or scripts not approved by IT.',
              ]}
            />
          </SubSection>
          <SubSection
            number="1.6"
            title={t('privacyPolicy.subsections.monitoringText')}
          >
            <p>
              RFS Global may monitor and log System activity (including access logs, changes, exports
              , and administrative actions) to protect the System, investigate incidents,
              and demonstrate compliance. Users have no expectation of privacy
              in System usage to the extent permitted by law.
            </p>
          </SubSection>
          <SubSection
            number="1.7"
            title={t('privacyPolicy.subsections.changeTerms')}
          >
            <p className="mb-4">
              RFS Global may update this document from time to time. Updates will be communicated through official
              channels. Continued use of the System after publication of an updated version
              constitutes acceptance of the updated terms.
            </p>
          </SubSection>
        </Section>

        {/* Privacy & Data Handling */}
        <Section title={t('privacyPolicy.sections.privacyDataHandling')}>
          <SubSection
            number="2.1"
            title={t('privacyPolicy.subsections.rolesResponsibilities')}
          >
            <p>
              RFS Global determines the purposes and means of processing personal data in the System for its
              services and operations. Users act under RFS Global authority and must process personal data only on
              documented instructions, approved workflows, and applicable procedures. If you are unsure whether an
              action is permitted, stop and contact the DPO/Compliance team.
            </p>
          </SubSection>

          <SubSection
            number="2.2"
            title={t('privacyPolicy.subsections.personalDataSystem')}
          >
            <p>
              The System may contain (depending on service and case type):
            </p>
            <List
              items={[
                'Regular personal data: identity and contact details, passport and travel document data',
                'travel history, family details, payment-related or service-related information,',
                'and case correspondence.',
                'Special category data (where required by the relevant mission/visa category): biometric data,',
                'limited health information for medical-check requirements, or other sensitive data strictly necessary',
                'for the service. ',
              ]}
            />
            <p>
              Data minimization: Collect and record only the information necessary for the specific service/case. Do
              not record free-form notes containing unnecessary sensitive details.
            </p>
          </SubSection>

          <SubSection
            number="2.3"
            title={t('privacyPolicy.subsections.lawfulBasisAndPurposeLimitation')}
          >
            <p>
              Personal data must be processed only for documented, legitimate business
              purposes. You must not use data collected for one purpose (e.g., visa
              processing) for another purpose (e.g., marketing) without explicit
              authorization and a lawful basis. All processing activities must be
              documented and approved.
            </p>
          </SubSection>

          <SubSection
            number="2.4"
            title={t('privacyPolicy.subsections.dataAccuracyAndIntegrity')}
          >
            <List
              items={[
                'Enter accurate and up-to-date information. Verify data when possible using '
                + 'approved verification steps.',
                'Correct errors promptly when identified or when requested by a data subject '
                + '(via DPO/Compliance).',
                'Do not alter historical records unless correcting a documented error and with '
                + 'proper authorization.',
              ]}
            />
          </SubSection>

          <SubSection
            number="2.5"
            title={t('privacyPolicy.subsections.dataSharingAndRecipients')}
          >
            <p className="mb-2">Personal data may be shared only with:</p>
            <List
              items={[
                'Embassies/consulates as required for visa processing (authorized sharing).',
                'Approved service providers who have signed Data Processing Agreements (DPAs).',
                'Internal teams with a legitimate need-to-know (on a need-to-know basis).',
              ]}
            />
            <p className="mt-3">
              Do not disclose personal data to third parties, including family members,
              friends, or external contacts, without explicit authorization from DPO/Compliance.
            </p>
          </SubSection>

          <SubSection
            number="2.6"
            title={t('privacyPolicy.subsections.internationalTransfers')}
          >
            <p>
              Cross-border data transfers must follow RFS Global&apos;s approved transfer
              mechanisms (e.g., Standard Contractual Clauses, adequacy decisions). Do
              not initiate transfers to countries not covered by approved mechanisms.
              Contact DPO/Compliance if a transfer is required.
            </p>
          </SubSection>

          <SubSection
            number="2.7"
            title={t('privacyPolicy.subsections.technicalAndOrganizationalSecurityMeasures')}
          >
            <p className="mb-2">Minimum security measures you must follow:</p>
            <List
              items={[
                'Use strong, unique passwords and enable MFA where available.',
                'Access the System only from approved devices and networks.',
                'Avoid public Wi-Fi unless using an approved VPN.',
                'Do not install unapproved software or browser extensions.',
                'Keep devices updated with security patches.',
                'Securely dispose of printed materials containing personal data.',
                'Report lost devices or suspected compromises immediately.',
              ]}
            />
          </SubSection>

          <SubSection
            number="2.8"
            title={t('privacyPolicy.subsections.dataRetentionAndDeletion')}
          >
            <p>
              Follow RFS Global&apos;s data retention policies. Do not delete records unless
              instructed by DPO/Compliance or as part of an approved retention schedule.
              If a data subject requests deletion, forward the request to DPO/Compliance
              and do not delete until authorized.
            </p>
          </SubSection>

          <SubSection
            number="2.9"
            title={t('privacyPolicy.subsections.vendorAndThirdPartyControls')}
          >
            <p>
              If vendors or third parties require access to personal data, ensure they
              have signed DPAs and are onboarded through the approved vendor management
              process. Do not grant access or share data outside this process.
            </p>
          </SubSection>

          <SubSection
            number="2.10"
            title={t('privacyPolicy.subsections.dataProtectionImpactAssessments')}
          >
            <p>
              DPIAs are required for high-risk processing activities. If you are
              involved in a new processing activity that may be high-risk, coordinate
              with DPO/Compliance to determine if a DPIA is needed and provide input as
              requested.
            </p>
          </SubSection>
        </Section>

        {/* Data Subject Requests */}
        <Section title={t('privacyPolicy.sections.dataSubjectRequests')}>
          <SubSection
            number="3.1"
            title={t('privacyPolicy.subsections.recognizingARequest')}
          >
            <p>
              Data subjects (applicants/customers) may request access to their data,
              correction, deletion, restriction of processing, data portability, or
              object to processing. Requests may be received via email, phone, in
              person, or through the System. Treat any such request seriously and
              forward it immediately to DPO/Compliance.
            </p>
          </SubSection>

          <SubSubSection
            number="3.2"
            title={t('privacyPolicy.subsections.whatYouMustDo')}
          >
            <List
              items={[
                'Do not respond directly to the data subject. Forward the request to '
                + 'DPO/Compliance immediately.',
                'Do not delete or modify records unless explicitly instructed by DPO/Compliance.',
                'Assist with identity verification if requested by DPO/Compliance.',
                'Maintain confidentiality about the request and do not discuss it with '
                + 'unauthorized parties.',
              ]}
            />
            <p className="mt-3">
              <strong>Timeline:</strong>
              {' '}
              DPO/Compliance will respond within the legally
              required timeframe (typically 30 days under GDPR). Do not make commitments
              about response times.
            </p>
          </SubSubSection>
        </Section>

        {/* Incident Reporting */}
        <Section title={t('privacyPolicy.sections.incidentBreachReporting')}>
          <SubSection
            number="4.1"
            title={t('privacyPolicy.subsections.whatToReport')}
          >
            <p>
              Report immediately: unauthorized access, data loss, data breaches,
              suspected security incidents, lost devices containing System data, or
              any activity that may compromise personal data or System security.
            </p>
          </SubSection>

          <SubSection
            number="4.2"
            title={t('privacyPolicy.subsections.internalReportingSteps')}
          >
            <p className="mb-2">If you discover or suspect an incident:</p>
            <List
              items={[
                'Report immediately to Information Security (usman.khalid@rahberglobal.com) '
                + 'and DPO/Compliance (rehan.ahmed@rahberglobal.com).',
                'Do not attempt to conceal the incident or delete evidence.',
                'Document what happened, when, and what data may be affected (if known).',
                'Follow instructions from Information Security and DPO/Compliance.',
              ]}
            />
          </SubSection>

          <SubSection
            number="4.3"
            title={t('privacyPolicy.subsections.externalNotifications')}
          >
            <p>
              Only authorized teams (typically DPO/Compliance and Information Security)
              may contact external authorities (e.g., data protection authorities) or
              notify affected data subjects. Do not make external notifications yourself.
            </p>
          </SubSection>
        </Section>

        {/* Compliance */}
        <Section title={t('privacyPolicy.sections.trainingComplianceEnforcement')}>
          <SubSection
            number="5.1"
            title={t('privacyPolicy.subsections.trainingAndAwareness')}
          >
            <p>
              You must complete mandatory privacy and security training as required by
              RFS Global. Stay informed about updates to this document and related
              policies. Training records may be maintained for compliance purposes.
            </p>
          </SubSection>

          <SubSection
            number="5.2"
            title={t('privacyPolicy.subsections.enforcement')}
          >
            <p>
              Violations of this document may result in access suspension, disciplinary
              action, or termination, depending on the severity. RFS Global reserves the
              right to monitor System usage for compliance and security purposes.
            </p>
          </SubSection>

          <SubSection
            number="5.3"
            title={t('privacyPolicy.subsections.acknowledgement')}
          >
            <p>
              By accessing the System, you acknowledge that you have read, understood,
              and agree to comply with this document. Electronic acknowledgement may be
              required as part of the login process or training completion.
            </p>
          </SubSection>
        </Section>

        {/* Appendix A */}
        <Section title={t('privacyPolicy.sections.appendixA')}>
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">{t('privacyPolicy.appendix.do')}</h4>
            <List
              items={[
                'Use the System only for approved business purposes.',
                'Keep your credentials secure and use MFA when available.',
                'Report security incidents immediately.',
                'Follow data retention and deletion policies.',
                'Verify data accuracy before entry.',
                'Route privacy requests to DPO/Compliance.',
              ]}
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">{t('privacyPolicy.appendix.doNot')}</h4>
            <List
              items={[
                'Share your account or credentials.',
                'Export or store personal data outside approved systems.',
                'Use personal communication channels for System data.',
                'Access records without a business need.',
                'Alter records to conceal mistakes.',
                'Respond directly to data subject requests.',
              ]}
            />
          </div>
        </Section>

        {/* Appendix B */}
        <Section title={t('privacyPolicy.sections.appendixB')}>
          <p className="mb-4 text-sm text-gray-700">
            Use the contact points below for privacy, security, and CRM support. If a
            local SOP specifies a different channel, follow the SOP.
          </p>
          <table className="w-full border border-gray-300 border-collapse mb-6">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium
                  text-gray-500 uppercase tracking-wider"
                >
                  {t('privacyPolicy.appendix.function')}
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium
                  text-gray-500 uppercase tracking-wider"
                >
                  {t('privacyPolicy.appendix.contactDetails')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  DPO / Compliance
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  rehan.ahmed@rahberglobal.com
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  Information Security
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  usman.khalid@rahberglobal.com
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  CRM Support
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  support@rahberglobal.com
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* End of document */}
        <div className="mt-10 text-center text-gray-600 text-sm">
          <p>{t('privacyPolicy.endOfDocument')}</p>
        </div>
      </div>
    </div>
  );
}
