'use client';
import { useState } from "react";
import Step1EventInfo from "./Step1EventInfo";
import Step2Introduction from "./Step2Introduction/Step2Introduction";
import Step3Organizer from "./Step3Organizer";
import Step4Payment from "./Step4Payment";
import type { Performance } from "./Step2Introduction/types";

interface CreateEventFormProps {
  currentStep: number;
  eventName?: string;
  setEventName?: React.Dispatch<React.SetStateAction<string>>;
  eventType?: string;
  setEventType?: React.Dispatch<React.SetStateAction<string>>;
  venueName?: string;
  setVenueName?: React.Dispatch<React.SetStateAction<string>>;
  province?: string;
  setProvince?: React.Dispatch<React.SetStateAction<string>>;
  district?: string;
  setDistrict?: React.Dispatch<React.SetStateAction<string>>;
  ward?: string;
  setWard?: React.Dispatch<React.SetStateAction<string>>;
  street?: string;
  setStreet?: React.Dispatch<React.SetStateAction<string>>;
  categoryId?: number;
  setCategoryId?: React.Dispatch<React.SetStateAction<number>>;
  description?: string;
  setDescription?: React.Dispatch<React.SetStateAction<string>>;
  orgName?: string;
  setOrgName?: React.Dispatch<React.SetStateAction<string>>;
  orgDescription?: string;
  setOrgDescription?: React.Dispatch<React.SetStateAction<string>>;
  performances?: Performance[];
  performanceActions?: {
    create?: () => void;
    remove?: (id: number) => void;
    toggle?: (id: number) => void;
    update?: (id: number, payload: Performance) => void;
    addTicket?: (performanceId: number, ticket: any) => void;
    clearPerformances?: () => void;
    resetTempIds?: () => void;
  };
  message?: string;
  setMessage?: React.Dispatch<React.SetStateAction<string>>;
  type?: string;
  setType?: React.Dispatch<React.SetStateAction<string>>;
  link?: string;
  setLink?: React.Dispatch<React.SetStateAction<string>>;
  eventId?: string | number;
  settingsUrl?: string;
  // Step 4: payment props
  accountName?: string;
  setAccountName?: React.Dispatch<React.SetStateAction<string>>;
  accountNumber?: string;
  setAccountNumber?: React.Dispatch<React.SetStateAction<string>>;
  bankName?: string;
  setBankName?: React.Dispatch<React.SetStateAction<string>>;
  localBranch?: string;
  setLocalBranch?: React.Dispatch<React.SetStateAction<string>>;
  businessType?: string;
  setBusinessType?: React.Dispatch<React.SetStateAction<string>>;
  // Image uploads
  thumbnail?: File | null;
  setThumbnail?: React.Dispatch<React.SetStateAction<File | null>>;
  banner?: File | null;
  setBanner?: React.Dispatch<React.SetStateAction<File | null>>;
  orgThumbnail?: File | null;
  setOrgThumbnail?: React.Dispatch<React.SetStateAction<File | null>>;

  // Validation props
  validationErrors?: Record<string, string>;
  onValidationChange?: (isValid: boolean) => void;
}

export default function CreateEventForm({ 
  currentStep, 
  eventName, 
  setEventName, 
  eventType, 
  setEventType, 
  venueName, 
  setVenueName, 
  province, 
  setProvince, 
  district, 
  setDistrict, 
  ward, 
  setWard, 
  street, 
  setStreet, 
  categoryId, 
  setCategoryId, 
  description, 
  setDescription, 
  orgName, 
  setOrgName, 
  orgDescription, 
  setOrgDescription,
  performances,
  performanceActions,
  message,
  setMessage,
  type,
  setType,
  link,
  setLink,
  eventId,
  settingsUrl,
  accountName,
  setAccountName,
  accountNumber,
  setAccountNumber,
  bankName,
  setBankName,
  localBranch,
  setLocalBranch,
  businessType,
  setBusinessType,
  thumbnail,
  setThumbnail,
  banner,
  setBanner,
  orgThumbnail,
  setOrgThumbnail,
  validationErrors = {},
  onValidationChange
}: CreateEventFormProps) {
  
  
  // Shared state
  const [localEventName, setLocalEventName] = useState("");
  const [localEventType, setLocalEventType] = useState("offline");
  const [localVenueName, setLocalVenueName] = useState("");
  const [localProvince, setLocalProvince] = useState("");
  const [localDistrict, setLocalDistrict] = useState("");
  const [localWard, setLocalWard] = useState("");
  const [localStreet, setLocalStreet] = useState("");
  const [localCategoryId, setLocalCategoryId] = useState<number>(1);
  const [localDescription, setLocalDescription] = useState("");
  const [localOrgName, setLocalOrgName] = useState("");
  const [localOrgDescription, setLocalOrgDescription] = useState("");

  const [localMessage, setLocalMessage] = useState("");
  const [localType, setLocalType] = useState("public");
  const [localLink, setLocalLink] = useState("");
  // Step 4 local states
  const [localAccountName, setLocalAccountName] = useState("");
  const [localAccountNumber, setLocalAccountNumber] = useState("");
  const [localBankName, setLocalBankName] = useState("");
  const [localLocalBranch, setLocalLocalBranch] = useState("");
  const [localBusinessType, setLocalBusinessType] = useState("company");
  
  // Image local states
  const [localThumbnail, setLocalThumbnail] = useState<File | null>(null);
  const [localBanner, setLocalBanner] = useState<File | null>(null);
  const [localOrgThumbnail, setLocalOrgThumbnail] = useState<File | null>(null);

  const eventNameValue = eventName ?? localEventName;
  const setEventNameFn = setEventName ?? setLocalEventName;
  const eventTypeValue = eventType ?? localEventType;
  const setEventTypeFn = setEventType ?? setLocalEventType;
  const venueNameValue = venueName ?? localVenueName;
  const setVenueNameFn = setVenueName ?? setLocalVenueName;
  const provinceValue = province ?? localProvince;
  const setProvinceFn = setProvince ?? setLocalProvince;
  const districtValue = district ?? localDistrict;
  const setDistrictFn = setDistrict ?? setLocalDistrict;
  const wardValue = ward ?? localWard;
  const setWardFn = setWard ?? setLocalWard;
  const streetValue = street ?? localStreet;
  const setStreetFn = setStreet ?? setLocalStreet;
  const categoryIdValue = categoryId ?? localCategoryId;
  const setCategoryIdFn = setCategoryId ?? setLocalCategoryId;
  const descriptionValue = description ?? localDescription;
  const setDescriptionFn = setDescription ?? setLocalDescription;
  const orgNameValue = orgName ?? localOrgName;
  const setOrgNameFn = setOrgName ?? setLocalOrgName;
  const orgDescriptionValue = orgDescription ?? localOrgDescription;
  const setOrgDescriptionFn = setOrgDescription ?? setLocalOrgDescription;

  const messageValue = message ?? localMessage;
  const setMessageFn = setMessage ?? setLocalMessage;
  const typeValue = type ?? localType;
  const setTypeFn = setType ?? setLocalType;
  const linkValue = link ?? localLink;
  const setLinkFn = setLink ?? setLocalLink;
  const accountNameValue = accountName ?? localAccountName;
  const setAccountNameFn = setAccountName ?? setLocalAccountName;
  const accountNumberValue = accountNumber ?? localAccountNumber;
  const setAccountNumberFn = setAccountNumber ?? setLocalAccountNumber;
  const bankNameValue = bankName ?? localBankName;
  const setBankNameFn = setBankName ?? setLocalBankName;
  const localBranchValue = localBranch ?? localLocalBranch;
  const setLocalBranchFn = setLocalBranch ?? setLocalLocalBranch;
  const businessTypeValue = businessType ?? localBusinessType;
  const setBusinessTypeFn = setBusinessType ?? setLocalBusinessType;
  
  // Image values
  const thumbnailValue = thumbnail ?? localThumbnail;
  const setThumbnailFn = setThumbnail ?? setLocalThumbnail;
  const bannerValue = banner ?? localBanner;
  const setBannerFn = setBanner ?? setLocalBanner;
  const orgThumbnailValue = orgThumbnail ?? localOrgThumbnail;
  const setOrgThumbnailFn = setOrgThumbnail ?? setLocalOrgThumbnail;
  return (
    <div className="mt-8 space-y-8">
      {currentStep === 1 && (
        <Step1EventInfo
          eventName={eventNameValue}
          setEventName={setEventNameFn}
          eventType={eventTypeValue}
          setEventType={setEventTypeFn}
          venueName={venueNameValue}
          setVenueName={setVenueNameFn}
          province={provinceValue}
          setProvince={setProvinceFn}
          district={districtValue}
          setDistrict={setDistrictFn}
          ward={wardValue}
          setWard={setWardFn}
          street={streetValue}
          setStreet={setStreetFn}
          categoryId={categoryIdValue}
          setCategoryId={setCategoryIdFn}
          description={descriptionValue}
          setDescription={setDescriptionFn}
          orgName={orgNameValue}
          setOrgName={setOrgNameFn}
          orgDescription={orgDescriptionValue}
          setOrgDescription={setOrgDescriptionFn}
          thumbnail={thumbnailValue}
          setThumbnail={setThumbnailFn}
          banner={bannerValue}
          setBanner={setBannerFn}
          orgThumbnail={orgThumbnailValue}
          setOrgThumbnail={setOrgThumbnailFn}
          validationErrors={validationErrors}
          onValidationChange={onValidationChange}
        />
      )}

      {currentStep === 2 && (
        <Step2Introduction
          performances={performances}
          performanceActions={performanceActions}
        />
      )}

      {currentStep === 3 && (
        <Step3Organizer
          message={messageValue}
          setMessage={setMessageFn}
          type={typeValue}
          setType={setTypeFn}
          link={linkValue}
          setLink={setLinkFn}
          eventName={eventNameValue}
          eventId={eventId as string | number}
          initialUrl={settingsUrl}
        />
      )}

      {currentStep === 4 && (
        <Step4Payment
          accountName={accountNameValue}
          setAccountName={setAccountNameFn}
          accountNumber={accountNumberValue}
          setAccountNumber={setAccountNumberFn}
          bankName={bankNameValue}
          setBankName={setBankNameFn}
          localBranch={localBranchValue}
          setLocalBranch={setLocalBranchFn}
          businessType={businessTypeValue}
          setBusinessType={setBusinessTypeFn}
        />
      )}
    </div>
  );
}