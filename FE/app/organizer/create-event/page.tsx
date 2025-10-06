"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EventStepper from "@/src/components/stepper/EventStepper";
import CreateEventForm from "./CreateEventForm";
import { createEventWithFiles, updateEvent } from "@/src/apis/events";

type StepKey = "info" | "showing" | "setting" | "payment";

const stepKeyToIndex: Record<StepKey, number> = {
  info: 1,
  showing: 2,
  setting: 3,
  payment: 4,
};
const indexToStepKey = (idx: number): StepKey => {
  switch (idx) {
    case 1: return 'info';
    case 2: return 'showing';
    case 3: return 'setting';
    default: return 'payment';
  }
};

interface ValidationErrors {
  thumbnail?: string;
  banner?: string;
  eventName?: string;
  venueName?: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  categoryId?: string;
  description?: string;
  eventType?: string;
  orgThumbnail?: string;
  orgName?: string;
  orgDescription?: string;
}

export default function CreateEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStepParam = (searchParams.get("step") as StepKey) || "info";
  const [currentStep, setCurrentStep] = useState<number>(stepKeyToIndex[initialStepParam] || 1);
  const [maxNavigableStep, setMaxNavigableStep] = useState<number>(1);
  const [eventName, setEventName] = useState<string>("");
  const [eventType, setEventType] = useState<string>("offline");
  const [venueName, setVenueName] = useState<string>("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [description, setDescription] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  
  // Image states
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [orgThumbnail, setOrgThumbnail] = useState<File | null>(null);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  
  const status = 'draft';

  // Validation function for Step 1
  const validateStep1 = (): boolean => {
    const errors: ValidationErrors = {};
    
    // Check required fields
    if (!thumbnail) errors.thumbnail = 'Vui lòng upload ảnh thumbnail';
    if (!banner) errors.banner = 'Vui lòng upload ảnh banner';
    if (!eventName || eventName.trim() === '') errors.eventName = 'Vui lòng nhập tên sự kiện';
    if (!venueName || venueName.trim() === '') errors.venueName = 'Vui lòng nhập tên địa điểm';
    if (!province || province === '') errors.province = 'Vui lòng chọn tỉnh/thành';
    if (!district || district === '') errors.district = 'Vui lòng chọn quận/huyện';
    if (!ward || ward === '') errors.ward = 'Vui lòng chọn phường/xã';
    if (!street || street.trim() === '') errors.street = 'Vui lòng nhập số nhà, đường';
    if (!categoryId || categoryId === 0) errors.categoryId = 'Vui lòng chọn thể loại sự kiện';
    if (!description || description.trim() === '') errors.description = 'Vui lòng nhập thông tin sự kiện';
    if (!eventType || eventType === '') errors.eventType = 'Vui lòng chọn loại sự kiện';
    if (!orgThumbnail) errors.orgThumbnail = 'Vui lòng upload logo ban tổ chức';
    if (!orgName || orgName.trim() === '') errors.orgName = 'Vui lòng nhập tên ban tổ chức';
    if (!orgDescription || orgDescription.trim() === '') errors.orgDescription = 'Vui lòng nhập thông tin ban tổ chức';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enforce locking even if URL param tries to jump ahead
  useEffect(() => {
    if (currentStep > maxNavigableStep) {
      const adjusted = maxNavigableStep;
      setCurrentStep(adjusted);
      const qs = new URLSearchParams(Array.from(searchParams.entries()));
      const stepKey = indexToStepKey(adjusted);
      qs.set("step", stepKey);
      router.replace(`/organizer/create-event?${qs.toString()}`);
    }
  }, [currentStep, maxNavigableStep, router, searchParams]);
  const [eventId, setEventId] = useState<string | number | null>(null);

  // Keep URL step param in sync and support reload persistence
  useEffect(() => {
    const stepKey = indexToStepKey(currentStep);
    const qs = new URLSearchParams(Array.from(searchParams.entries()));
    if (qs.get("step") !== stepKey) {
      qs.set("step", stepKey);
      router.replace(`/organizer/create-event?${qs.toString()}`);
    }
  }, [currentStep, router, searchParams]);

  const handleStepChange = useCallback((step: number) => {
    // Cho phép quay lại Step 1 để chỉnh sửa
    if (step === 1) {
      setCurrentStep(step);
      // Khi quay lại Step 1, clear validation errors để user có thể sửa
      setShowValidationErrors(false);
      setValidationErrors({});
      return;
    }
    
    // Nếu đang ở Step 1 và muốn đi tiếp, kiểm tra validation
    if (currentStep === 1 && step > 1) {
      if (!validateStep1()) {
        setShowValidationErrors(true);
        return; // Không cho phép đi tiếp nếu có lỗi
      }
    }
    
    setCurrentStep(step);
  }, [currentStep]);

  const saveHandlers = useMemo(() => ({
    save: async () => {
      // Step-specific save; only Step 1 creates the event
      if (currentStep === 1) {
        try {
          if (!validateStep1()) {
            setShowValidationErrors(true);
            return;
          }
          
          const res = await createEventWithFiles({
            name: eventName,
            description,
            type: eventType,
            status,
            name_address: venueName,
            province,
            district,
            ward, 
            street,
            category_id: categoryId,
            org_name: orgName,
            org_description: orgDescription,
            thumbnailFile: thumbnail,
            bannerFile: banner,
            orgThumbnailFile: orgThumbnail,
          });
          if (res?.id) {
            setEventId(res.id);
            setMaxNavigableStep((prev) => Math.max(prev, 2));
            // Move to step 2 only on Continue, not here
          }
        } catch {
          // stay on current step on error
        }
      } else if (eventId != null) {
        try {
          await updateEvent(eventId, {});
        } catch {
          // stay on current step on error
        }
      }
    },
    continue: async () => {
      await (async () => {
        if (currentStep === 1) {
          try {
            // Validate Step 1 before proceeding
            if (!validateStep1()) {
              setShowValidationErrors(true);
              return;
            }
            
            const res = await createEventWithFiles({
              name: eventName,
              description,
              type: eventType,
              status,
              name_address: venueName,
              province,
              district,
              ward,
              street,
              category_id: categoryId,
              org_name: orgName,
              org_description: orgDescription,
              thumbnailFile: thumbnail,
              bannerFile: banner,
              orgThumbnailFile: orgThumbnail,
            });
            if (res?.id) {
              // Navigate immediately to avoid local effect rewriting URL back to create-event
              router.replace(`/organizer/create-event/${res.id}?step=showing`);
              return;
            }
          } catch {
            // do not advance
          }
          return;
        }
        if (eventId != null) {
          try {
            await updateEvent(eventId, {});
            const next = Math.min(currentStep + 1, 4);
            setMaxNavigableStep((prev) => Math.max(prev, next));
            setCurrentStep(next);
            const nextKey = indexToStepKey(next);
            router.replace(`/organizer/create-event/${eventId}/?step=${nextKey}`);
          } catch {
            // do not advance
          }
        }
      })();
    }
  }), [currentStep, eventId, router, eventName, eventType, venueName, province, district, ward, street, categoryId, description, orgName, orgDescription, thumbnail, banner, orgThumbnail]);

  // Clear validation errors when user starts typing
  const clearValidationErrors = () => {
    if (showValidationErrors) {
      setShowValidationErrors(false);
      setValidationErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6">
        <EventStepper
          currentStep={currentStep}
          onStepChange={handleStepChange}
          maxNavigableStep={maxNavigableStep}
          onSave={saveHandlers.save}
          onContinue={saveHandlers.continue}
        />
        
        {/* Validation Error Summary for Step 1 */}
        {currentStep === 1 && showValidationErrors && Object.keys(validationErrors).length > 0 && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold text-red-400">
                  Vui lòng hoàn thành tất cả các trường bắt buộc
                </h3>
              </div>
              <button
                onClick={clearValidationErrors}
                className="text-red-300 hover:text-red-200 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-red-300">
              {Object.entries(validationErrors).map(([field, error]) => (
                <div key={field} className="flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <CreateEventForm
          currentStep={currentStep}
          eventName={eventName}
          setEventName={setEventName}
          eventType={eventType}
          setEventType={setEventType}
          venueName={venueName}
          setVenueName={setVenueName}
          province={province}
          setProvince={setProvince}
          district={district}
          setDistrict={setDistrict}
          ward={ward}
          setWard={setWard}
          street={street}
          setStreet={setStreet}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          description={description}
          setDescription={setDescription}
          orgName={orgName}
          setOrgName={setOrgName}
          orgDescription={orgDescription}
          setOrgDescription={setOrgDescription}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          banner={banner}
          setBanner={setBanner}
          orgThumbnail={orgThumbnail}
          setOrgThumbnail={setOrgThumbnail}
          // validationErrors={showValidationErrors ? validationErrors : {}}
          onValidationChange={(isValid) => {
            if (isValid) {
              setShowValidationErrors(false);
            }
          }}
        />
      </div>
    </div>
  );
}
