import { useState, useEffect, useCallback } from "react";
import { getEventById, getSettings } from "@/src/apis/events";
import { loadImageFilesFromUrls } from "@/src/utils/urlToFile.utils";
import type { SetStateAction } from "react";

export const useEventFormData = (eventId: string, currentStep: number) => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "offline",
    venueName: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    categoryId: 1,
    description: "",
    orgName: "",
    orgDescription: "",
    settingsMessage: "",
    settingsType: "public",
    settingsLink: "",
    accountName: "",
    accountNumber: "",
    bankName: "",
    localBranch: "",
    businessType: "company",
    thumbnail: null as File | null,
    banner: null as File | null,
    orgThumbnail: null as File | null,
  });

  const resolveNext = <T,>(next: SetStateAction<T>, prev: T): T =>
    typeof next === "function" ? (next as (p: T) => T)(prev) : next;
  // Load event data when component mounts

  useEffect(() => {
    if (typeof currentStep === "number" && currentStep == 1) {
      const loadEventData = async () => {
        try {
          const eventData = await getEventById(eventId);
          if (eventData) {
            const imageFiles = await loadImageFilesFromUrls({
              thumbnail: eventData.thumbnail as string,
              banner: eventData.banner as string,
              org_thumbnail: eventData.org_thumbnail as string,
            });

            setFormData({
              eventName: eventData.name || "",
              eventType: eventData.type || "offline",
              venueName: eventData.name_address || "",
              province: eventData.province || "",
              district: eventData.district || "",
              ward: eventData.ward || "",
              street: eventData.street || "",
              categoryId: eventData.category_id || 0,
              description: eventData.description || "",
              orgName: eventData.org_name || "",
              orgDescription: eventData.org_description || "",
              settingsMessage: "",
              settingsType: "public",
              settingsLink: eventData?.settings?.[0]?.link || "",
              accountName: "",
              accountNumber: "",
              bankName: "",
              localBranch: "",
              businessType: "company",
              thumbnail: imageFiles.thumbnail,
              banner: imageFiles.banner,
              orgThumbnail: imageFiles.orgThumbnail,
            });
          }
        } catch (error) {
          console.error("Failed to load event data:", error);
        }
      };

      if (eventId) {
        loadEventData();
      }
    }
    if (typeof currentStep === "number" && currentStep === 3) {
      const loadDataSettingss = async () => {
        try {

          const settings = await getSettings(eventId);

          if (settings.length) {
            setFormData(prev => ({
              ...prev,
              settingsLink: settings?.[0]?.link || '',
            }));
          } else {
            const eventData = await getEventById(eventId);
            setFormData(prev => ({
              ...prev,
              settingsLink: eventData?.name || '',
            }));

          }


        } catch (error) {
          console.error("Failed to load settings data:", error);
        }
      }
      if (eventId) {
        loadDataSettingss();

      }
    }
  }, [eventId, currentStep]);

  // Tạo các setter functions cho từng field
  const setEventName = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, eventName: resolveNext(value, prev.eventName) }));
  }, []);

  const setEventType = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, eventType: resolveNext(value, prev.eventType) }));
  }, []);

  const setVenueName = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, venueName: resolveNext(value, prev.venueName) }));
  }, []);

  const setProvince = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, province: resolveNext(value, prev.province) }));
  }, []);

  const setDistrict = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, district: resolveNext(value, prev.district) }));
  }, []);

  const setWard = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, ward: resolveNext(value, prev.ward) }));
  }, []);

  const setStreet = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, street: resolveNext(value, prev.street) }));
  }, []);

  const setCategoryId = useCallback((value: SetStateAction<number>) => {
    setFormData(prev => ({ ...prev, categoryId: resolveNext(value, prev.categoryId) }));
  }, []);

  const setDescription = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, description: resolveNext(value, prev.description) }));
  }, []);

  const setOrgName = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, orgName: resolveNext(value, prev.orgName) }));
  }, []);

  const setOrgDescription = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, orgDescription: resolveNext(value, prev.orgDescription) }));
  }, []);

  const setSettingsMessage = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, settingsMessage: resolveNext(value, prev.settingsMessage) }));
  }, []);

  const setSettingsType = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, settingsType: resolveNext(value, prev.settingsType) }));
  }, []);

  const setSettingsLink = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, settingsLink: resolveNext(value, prev.settingsLink) }));
  }, []);

  const setAccountName = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, accountName: resolveNext(value, prev.accountName) }));
  }, []);

  const setAccountNumber = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, accountNumber: resolveNext(value, prev.accountNumber) }));
  }, []);

  const setBankName = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, bankName: resolveNext(value, prev.bankName) }));
  }, []);

  const setLocalBranch = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, localBranch: resolveNext(value, prev.localBranch) }));
  }, []);

  const setBusinessType = useCallback((value: SetStateAction<string>) => {
    setFormData(prev => ({ ...prev, businessType: resolveNext(value, prev.businessType) }));
  }, []);

  const setThumbnail = useCallback((value: SetStateAction<File | null>) => {
    setFormData(prev => ({ ...prev, thumbnail: resolveNext(value, prev.thumbnail) }));
  }, []);

  const setBanner = useCallback((value: SetStateAction<File | null>) => {
    setFormData(prev => ({ ...prev, banner: resolveNext(value, prev.banner) }));
  }, []);

  const setOrgThumbnail = useCallback((value: SetStateAction<File | null>) => {
    setFormData(prev => ({ ...prev, orgThumbnail: resolveNext(value, prev.orgThumbnail) }));
  }, []);

  return {
    formData,
    setFormData,
    // Individual setters
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
  };
};