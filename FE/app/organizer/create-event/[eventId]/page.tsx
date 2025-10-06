"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import EventStepper from "@/src/components/stepper/EventStepper";
import CreateEventForm from "../CreateEventForm";
import usePerformances from "../Step2Introduction/hooks/usePerformances";

// Import các hook đã tạo
import { useEventStepHandler } from "@/src/hooks/useEventStepHandler";
import { useEventFormData } from "@/src/hooks/useEventFormData";
import { useStepUrlSync } from "@/src/hooks/useStepUrlSync";

export default function CreateEventWithIdPage() {
  const { eventId } = useParams<{ eventId: string }>();
  
  const { 
    currentStep, 
    setCurrentStep, 
    maxNavigableStep, 
    setMaxNavigableStep 
  } = useStepUrlSync(eventId);

  // Sử dụng các hook đã tạo
  const { 
    formData, 
    setEventName,
    setEventType,
    setVenueName,
    setProvince,
    setDistrict,
    setWard,
    setStreet,
    setCategoryId,
    setDescription,
    setOrgName,
    setOrgDescription,
    setSettingsMessage,
    setSettingsType,
    setSettingsLink,
    setAccountName,
    setAccountNumber,
    setBankName,
    setLocalBranch,
    setBusinessType,
    setThumbnail,
    setBanner,
    setOrgThumbnail,
  } = useEventFormData(eventId, currentStep);
  
  
  const { performances, actions: performanceActions } = usePerformances(eventId);
  
  const { handleStepChange, saveHandlers } = useEventStepHandler(
    eventId,
    currentStep,
    performances,
    formData,
    setCurrentStep,
    setMaxNavigableStep
  );


  // Debug log
  useEffect(() => {
  }, [currentStep, maxNavigableStep, formData]);

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
        <CreateEventForm
          currentStep={currentStep}
          performances={performances}
          performanceActions={performanceActions}
          eventId={eventId}
          // Form data
          eventName={formData.eventName}
          eventType={formData.eventType}
          venueName={formData.venueName}
          province={formData.province}
          district={formData.district}
          ward={formData.ward}
          street={formData.street}
          categoryId={formData.categoryId}
          description={formData.description}
          orgName={formData.orgName}
          orgDescription={formData.orgDescription}
          // Settings
          message={formData.settingsMessage}
          type={formData.settingsType}
          link={formData.settingsLink}
          // Payment
          accountName={formData.accountName}
          accountNumber={formData.accountNumber}
          bankName={formData.bankName}
          localBranch={formData.localBranch}
          businessType={formData.businessType}
          // Images
          thumbnail={formData.thumbnail}
          banner={formData.banner}
          orgThumbnail={formData.orgThumbnail}
          // Setters
          setEventName={setEventName}
          setEventType={setEventType}
          setVenueName={setVenueName}
          setProvince={setProvince}
          setDistrict={setDistrict}
          setWard={setWard}
          setStreet={setStreet}
          setCategoryId={setCategoryId}
          setDescription={setDescription}
          setOrgName={setOrgName}
          setOrgDescription={setOrgDescription}
          setMessage={setSettingsMessage}
          setType={setSettingsType}
          setLink={setSettingsLink}
          setAccountName={setAccountName}
          setAccountNumber={setAccountNumber}
          setBankName={setBankName}
          setLocalBranch={setLocalBranch}
          setBusinessType={setBusinessType}
          setThumbnail={setThumbnail}
          setBanner={setBanner}
          setOrgThumbnail={setOrgThumbnail}
        />
      </div>
    </div>
  );
}