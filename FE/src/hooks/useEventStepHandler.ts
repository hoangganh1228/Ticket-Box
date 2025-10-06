import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { savePayment, saveSettings, saveShowings, updateEventWithFiles, publishEvent } from "@/src/apis/events";
import { CLIENT_URL, SERVER_URL } from "../utils/const/config.const";
import { toast } from "react-toastify";

/**
 * Hook quản lý logic xử lý step trong quy trình tạo event
 * Chịu trách nhiệm: điều hướng step, lưu dữ liệu, xử lý API calls
 */

export const useEventStepHandler = (
  eventId: string,
  currentStep: number,
  performances: any[],
  formData: any,
  setCurrentStep: (step: number) => void,
  setMaxNavigableStep: (step: number) => void
) => {
  const router = useRouter();
  const [maxNavigableStep, setMaxNavigableStepLocal] = useState<number>(Math.max(1, currentStep));

  const handleStepChange = useCallback(async (step: number) => {

    // Allow backward navigation without blocking on save
    if (step <= currentStep) {
      setCurrentStep(step);
      return;
    }

    setCurrentStep(step);
    setMaxNavigableStep((prev) => Math.max(prev, step));
  }, [currentStep, setCurrentStep, setMaxNavigableStep]);

  const saveHandlers = useMemo(() => ({
    /**
     * Lưu dữ liệu step hiện tại
     * Gọi API tương ứng với từng step
     */
    save: async () => {
      try {
        if (currentStep === 1) {
          await updateEventWithFiles(eventId, {
            name: formData.eventName,
            description: formData.description,
            type: formData.eventType,
            name_address: formData.venueName,
            province: formData.province,
            district: formData.district,
            ward: formData.ward,
            street: formData.street,
            category_id: formData.categoryId,
            org_name: formData.orgName,
            org_description: formData.orgDescription,
            thumbnailFile: formData.thumbnail,
            bannerFile: formData.banner,
            orgThumbnailFile: formData.orgThumbnail,
          });
        } else if (currentStep === 2) {
          if (performances.length === 0) {
            console.warn("No performances to save");
            return;
          }

          const showingsPayload = mapPerformancesToPayload(performances);
          console.log("Saving showings payload:", showingsPayload);
          const response = await saveShowings(eventId, showingsPayload);

          if (response && response.data && Array.isArray(response.data)) {
            updatePerformancesWithIds(performances, response, eventId);
          }
        } else if (currentStep === 3) {
          const fullUrl = formData.settingsLink ? `${CLIENT_URL}/${formData.settingsLink}-${eventId}` : '';
          await saveSettings(eventId, {
            message: formData.settingsMessage,
            type: formData.settingsType,
            link: formData.settingsLink,
            url: fullUrl
          });
        } else if (currentStep === 4) {
          await savePayment(eventId, {
            account_name: formData.accountName,
            account_number: formData.accountNumber,
            bank_name: formData.bankName,
            local_branch: formData.localBranch,
            business_type: formData.businessType,
          });
        }
      } catch (error) {
        console.error("Failed to save:", error);
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    },
    /**
     * Lưu dữ liệu và chuyển sang step tiếp theo
     * Tự động điều hướng sau khi lưu thành công
     */
    continue: async () => {
      try {
        if (currentStep === 1) {
          await updateEventWithFiles(eventId, {
            name: formData.eventName,
            description: formData.description,
            type: formData.eventType,
            name_address: formData.venueName,
            province: formData.province,
            district: formData.district,
            ward: formData.ward,
            street: formData.street,
            category_id: formData.categoryId,
            org_name: formData.orgName,
            org_description: formData.orgDescription,
            thumbnailFile: formData.thumbnail,
            bannerFile: formData.banner,
            orgThumbnailFile: formData.orgThumbnail,
          });
        } else if (currentStep === 2) {
          if (performances.length === 0) {
            console.warn("No performances to save");
            return;
          }

          const showingsPayload = mapPerformancesToPayload(performances);
          console.log("Saving showings payload:", showingsPayload);
          const response = await saveShowings(eventId, showingsPayload);

          if (response && response.data && Array.isArray(response.data)) {
            updatePerformancesWithIds(performances, response, eventId);
          }
        } else if (currentStep === 3) {
          const fullUrl = formData.settingsLink ? `${CLIENT_URL}/${formData.settingsLink}-${eventId}` : '';
          await saveSettings(eventId, {
            message: formData.settingsMessage,
            type: formData.settingsType,
            link: formData.settingsLink,
            url: fullUrl
          });
        } else if (currentStep === 4) {
          await savePayment(eventId, {
            account_name: formData.accountName,
            account_number: formData.accountNumber,
            bank_name: formData.bankName,
            local_branch: formData.localBranch,
            business_type: formData.businessType,
          });
          await publishEvent(eventId);
          router.replace(`/organizer/events/`);
          return;
        }

        const next = Math.min(currentStep + 1, 4);
        setMaxNavigableStep((prev) => Math.max(prev, next));
        setCurrentStep(next);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  }), [currentStep, eventId, router, formData, performances, setCurrentStep, setMaxNavigableStep]);

  return { handleStepChange, maxNavigableStep, setMaxNavigableStep: setMaxNavigableStepLocal, saveHandlers };
};

// Helper functions
const mapPerformancesToPayload = (performances: any[]) => {
  return performances.map(p => ({
    id: p.id && p.id > 0 ? p.id : undefined,
    start_time: p.start_time,
    end_time: p.end_time,
    ticketTypes: p.ticketTypes.map(t => ({
      id: t.id && t.id > 0 ? t.id : undefined,
      name: t.name,
      price: t.price,
      total_ticket: t.total_ticket,
      description: t.description,
      is_free: t.is_free,
      max_ticket: t.max_ticket,
      min_ticket: t.min_ticket,
      start_time: t.start_time,
      end_time: t.end_time
    }))
  }));
};

const updatePerformancesWithIds = (performances: any[], response: any, eventId: string) => {
  if (response?.data && Array.isArray(response.data)) {
    const updatedPerformances = performances.map((perf, index) => {
      const apiPerf = response.data[index];
      if (apiPerf) {
        return {
          ...perf,
          id: apiPerf.id,
          ticketTypes: perf.ticketTypes.map((ticket, ticketIndex) => ({
            ...ticket,
            id: apiPerf.tickets?.[ticketIndex]?.id || ticket.id
          }))
        };
      }
      return perf;
    });
    localStorage.setItem(`performances_${eventId}`, JSON.stringify(updatedPerformances));
  }
};