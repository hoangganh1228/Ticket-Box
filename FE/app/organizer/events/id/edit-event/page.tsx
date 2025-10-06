"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import EventStepper from "@/src/components/stepper/EventStepper";
import CreateEventForm from "@/app/organizer/create-event/CreateEventForm";
import { savePayment, saveSettings, saveShowings, updateEvent, getEventById, updateEventWithFiles, getSettings, getPaymentInfo } from "@/src/apis/events";
import { loadImageFilesFromUrls } from "@/src/utils/urlToFile.utils";
import usePerformances from "@/app/organizer/create-event/Step2Introduction/hooks/usePerformances";
import type { Performance } from "@/app/organizer/create-event/Step2Introduction/types";
import { useEventId } from "@/src/hooks/useEventId";
import { CLIENT_URL, SERVER_URL } from "@/src/utils/const/config.const";
import { toast } from "react-toastify";

type StepKey = "info" | "showing" | "setting" | "payment";

const stepKeyToIndex: Record<StepKey, number> = {
    info: 1,
    showing: 2,
    setting: 3,
    payment: 4,
};
const indexToStepKey: Record<number, StepKey> = {
    1: "info",
    2: "showing",
    3: "setting",
    4: "payment",
};



export default function EditEventPage() {
    const router = useRouter();
    // const { eventId } = useParams<{ eventId: string }>();
    const eventId = useEventId();
    const searchParams = useSearchParams();

    const initialStepParam = (searchParams.get("step") as StepKey) || "info";
    const [currentStep, setCurrentStep] = useState<number>(stepKeyToIndex[initialStepParam] || 1);

    // Step 1 states
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
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [banner, setBanner] = useState<File | null>(null);
    const [orgThumbnail, setOrgThumbnail] = useState<File | null>(null);

    // Step 3 states
    const [message, setMessage] = useState<string>("");
    const [type, setType] = useState<string>("public");
    const [link, setLink] = useState<string>("");
    const [settingsUrl, setSettingsUrl] = useState<string>("");

    // Step 4 states
    const [accountName, setAccountName] = useState<string>("");
    const [accountNumber, setAccountNumber] = useState<string>("");
    const [bankName, setBankName] = useState<string>("");
    const [localBranch, setLocalBranch] = useState<string>("");
    const [businessType, setBusinessType] = useState<string>("company");

    // Sync URL ?step
    useEffect(() => {
        const stepKey = indexToStepKey[currentStep];
        const qs = new URLSearchParams(Array.from(searchParams.entries()));
        if (qs.get("step") !== stepKey) {
            qs.set("step", stepKey);
            router.replace(`/organizer/events/${eventId}/edit-event?${qs.toString()}`);
        }
    }, [currentStep, router, searchParams, eventId]);

    // Prefill Step 1 from API
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data: any = await getEventById(eventId);
                if (cancelled) return;
                setEventName(data?.name ?? "");
                setEventType(data?.type ?? "offline");
                setVenueName(data?.name_address ?? "");
                setProvince(data?.province ?? "");
                setDistrict(data?.district ?? "");
                setWard(data?.ward ?? "");
                setStreet(data?.street ?? "");
                setCategoryId(typeof data?.category_id === "number" ? data.category_id : 1);
                setDescription(data?.description ?? "");
                setOrgName(data?.org_name ?? "");
                setOrgDescription(data?.org_description ?? "");

                const files = await loadImageFilesFromUrls({
                    thumbnail: data?.thumbnail,
                    banner: data?.banner,
                    org_thumbnail: data?.org_thumbnail
                });
                if (cancelled) return;
                setThumbnail(files.thumbnail);
                setBanner(files.banner);
                setOrgThumbnail(files.orgThumbnail);
            } catch {
                // noop
            }
        })();
        return () => { cancelled = true; };
    }, [eventId, currentStep]);

    // Prefill Step 3 from API
    useEffect(() => {
        let cancelled = false;
        if (!eventId) return;
        (async () => {
            try {

                const data: any = await getSettings(eventId);
                if (cancelled) return;
                setMessage(data[0]?.message ?? "");
                setType(data[0]?.type ?? "public");
                setLink(data[0]?.link ?? "");
                setSettingsUrl(data[0]?.url ?? "");
            } catch {
                // noop
            }
        })();
        return () => { cancelled = true; };
    }, [eventId]);

    // Prefill Step 4 from API
    useEffect(() => {
        let cancelled = false;
        if (!eventId) return;
        (async () => {
            try {
                const data: any = await getPaymentInfo(eventId);
                if (cancelled) return;

                // data có thể là array → lấy phần tử đầu
                const p = Array.isArray(data) ? data[0] : data;
                setAccountName(p?.account_name ?? "");
                setAccountNumber(p?.account_number ?? "");
                setBankName(p?.bank_name ?? "");
                setLocalBranch(p?.local_branch ?? "");
                setBusinessType(p?.business_type ?? "company");
            } catch {
                // noop
            }
        })();
        return () => { cancelled = true; };
    }, [eventId]);

    const handleStepChange = useCallback((step: number) => {
        setCurrentStep(step);
    }, []);

    // helper: có ảnh mới không
    const hasNewFiles = (thumb: File | null, ban: File | null, org: File | null) =>
        !!(thumb || ban || org);

    const { performances, actions: performanceActions } = usePerformances(eventId);

    // Map FE → payload BE (giữ id dương, ẩn id tạm âm)
    const mapPerformancesToPayload = (items: Performance[]) => {
        return items.map(p => ({
            id: p.id && p.id > 0 ? p.id : undefined,
            start_time: p.start_time,   // đã được hook đổi từ time_start
            end_time: p.end_time,       // đã được hook đổi từ time_end
            ticketTypes: p.ticketTypes.map(t => ({
                id: t.id && t.id > 0 ? t.id : undefined,
                name: t.name,
                price: t.price,                 // hook đã parseFloat từ "100000.00"
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

    const saveHandlers = useMemo(() => ({
        save: async () => {
            try {
                if (currentStep === 1) {
                    const jsonPayload = {
                        name: eventName,
                        description,
                        type: eventType,
                        name_address: venueName,
                        province,
                        district,
                        ward,
                        street,
                        category_id: categoryId,
                        org_name: orgName,
                        org_description: orgDescription,
                    };

                    if (hasNewFiles(thumbnail, banner, orgThumbnail)) {
                        await updateEventWithFiles(eventId, {
                            ...jsonPayload,
                            thumbnailFile: thumbnail || undefined,
                            bannerFile: banner || undefined,
                            orgThumbnailFile: orgThumbnail || undefined,
                        });
                    } else {
                        await updateEvent(eventId, jsonPayload);
                    }
                } else if (currentStep === 2) {
                    if (!performances || performances.length === 0) return;
                    const payload = mapPerformancesToPayload(performances);
                    await saveShowings(eventId, payload);
                } else if (currentStep === 3) {
                    const fullUrl = link ? `${CLIENT_URL}/${link}-${eventId}` : '';
                    await saveSettings(eventId, {
                        message,
                        type,
                        link,
                        url: fullUrl
                    });
                } else if (currentStep === 4) {
                    await savePayment(eventId, {
                        account_name: accountName,
                        account_number: accountNumber,
                        bank_name: bankName,
                        local_branch: localBranch,
                        business_type: businessType,
                    });
                }
            } catch (e) {
                toast.error(e?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
                // noop
            }
        },
        continue: async () => {
            try {
                if (currentStep === 1) {
                    const jsonPayload = {
                        name: eventName,
                        description,
                        type: eventType,
                        name_address: venueName,
                        province,
                        district,
                        ward,
                        street,
                        category_id: categoryId,
                        org_name: orgName,
                        org_description: orgDescription,
                    };

                    if (hasNewFiles(thumbnail, banner, orgThumbnail)) {
                        await updateEventWithFiles(eventId, {
                            ...jsonPayload,
                            thumbnailFile: thumbnail || undefined,
                            bannerFile: banner || undefined,
                            orgThumbnailFile: orgThumbnail || undefined,
                        });
                    } else {
                        await updateEvent(eventId, jsonPayload);
                    }
                } else if (currentStep === 2) {
                    if (!performances || performances.length === 0) return;
                    const payload = mapPerformancesToPayload(performances);
                    await saveShowings(eventId, payload);
                    const next = Math.min(currentStep + 1, 4);
                    setCurrentStep(next);
                    const nextKey = indexToStepKey[next];
                    router.replace(`/organizer/events/${eventId}/edit-event?step=${nextKey}`);
                } else if (currentStep === 3) {
                    const fullUrl = link ? `${CLIENT_URL}/${link}-${eventId}` : '';
                    await saveSettings(eventId, {
                        message,
                        type,
                        link,
                        url: fullUrl
                    });
                    const next = Math.min(currentStep + 1, 4);
                    setCurrentStep(next);
                    const nextKey = indexToStepKey[next];
                    router.replace(`/organizer/events/${eventId}/edit-event?step=${nextKey}`);
                } else if (currentStep === 4) {
                    await savePayment(eventId, {
                        account_name: accountName,
                        account_number: accountNumber,
                        bank_name: bankName,
                        local_branch: localBranch,
                        business_type: businessType,
                    });
                    router.replace(`/organizer/events/`);
                    return;
                }
                const next = Math.min(currentStep + 1, 4);
                setCurrentStep(next);
                const nextKey = indexToStepKey[next];
                router.replace(`/organizer/events/${eventId}/edit-event?step=${nextKey}`);
            } catch (e) {
                // noop
                toast.error(e?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
            }
        }
    }), [
        currentStep, eventId,
        eventName, description, eventType, venueName,
        province, district, ward, street, categoryId,
        orgName, orgDescription, router, thumbnail, banner, orgThumbnail, performances,
        message, type, link,
        accountName, accountNumber, bankName, localBranch, businessType
    ]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="p-6">
                <EventStepper
                    currentStep={currentStep}
                    onStepChange={handleStepChange}
                    maxNavigableStep={4}
                    onSave={saveHandlers.save}
                    onContinue={saveHandlers.continue}
                />
                <CreateEventForm
                    currentStep={currentStep}
                    eventId={eventId}
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
                    performances={performances}
                    performanceActions={performanceActions}
                    message={message}
                    setMessage={setMessage}
                    type={type}
                    setType={setType}
                    link={link}
                    setLink={setLink}
                    settingsUrl={settingsUrl}
                    accountName={accountName}
                    setAccountName={setAccountName}
                    accountNumber={accountNumber}
                    setAccountNumber={setAccountNumber}
                    bankName={bankName}
                    setBankName={setBankName}
                    localBranch={localBranch}
                    setLocalBranch={setLocalBranch}
                    businessType={businessType}
                    setBusinessType={setBusinessType}
                />
            </div>
        </div>
    );
}


