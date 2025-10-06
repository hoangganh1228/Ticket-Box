import { useEffect, useMemo, useState } from "react";

export interface ProvinceItem { province_id: string; province_name: string; }
export interface DistrictItem { district_id: string; district_name: string; }
export interface WardItem { ward_id: string; ward_name: string; }

interface UseVietnamAddressParams {
  onProvinceNameChange?: (name: string) => void;
  onDistrictNameChange?: (name: string) => void;
  onWardNameChange?: (name: string) => void;
  // Thêm props để prefill dữ liệu
  initialProvince?: string;
  initialDistrict?: string;
  initialWard?: string;
}

interface UseVietnamAddressReturn {
  provinceList: ProvinceItem[];
  districtList: DistrictItem[];
  wardList: WardItem[];
  selectedProvinceId: string;
  selectedDistrictId: string;
  onProvinceChange: (provinceId: string) => void;
  onDistrictChange: (districtId: string) => void;
  onWardChange: (wardId: string) => void;
  getWardIdByName: (wardName: string | undefined) => string;
  // Thêm helper functions
  getProvinceIdByName: (provinceName: string | undefined) => string;
  getDistrictIdByName: (districtName: string | undefined) => string;
}

export const useVietnamAddress = (
  params: UseVietnamAddressParams = {}
): UseVietnamAddressReturn => {
  const { onProvinceNameChange, onDistrictNameChange, onWardNameChange, initialProvince, initialDistrict, initialWard } = params;

  const [provinceList, setProvinceList] = useState<ProvinceItem[]>([]);
  const [districtList, setDistrictList] = useState<DistrictItem[]>([]);
  const [wardList, setWardList] = useState<WardItem[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");

  // Helper functions để tìm ID từ tên
  const getProvinceIdByName = (provinceName: string | undefined) => {
    if (!provinceName) return "";
    const found = provinceList.find((p) => p.province_name === provinceName);
    return found?.province_id ?? "";
  };

  const getDistrictIdByName = (districtName: string | undefined) => {
    if (!districtName) return "";
    const found = districtList.find((d) => d.district_name === districtName);
    return found?.district_id ?? "";
  };

  const getWardIdByName = (wardName: string | undefined) => {
    if (!wardName) return "";
    const found = wardList.find((w) => w.ward_name === wardName);
    return found?.ward_id ?? "";
  };

  // Provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch("https://vapi.vnappmob.com/api/v2/province/");
        const data = await res.json();
        setProvinceList(data?.results ?? []);
      } catch (e) {
        console.error("Fetch provinces failed", e);
        setProvinceList([]);
      }
    };
    fetchProvinces();
  }, []);

  // Prefill province khi có initialProvince và provinceList đã load
  useEffect(() => {
    if (initialProvince && provinceList.length > 0) {
      const provinceId = getProvinceIdByName(initialProvince);
      if (provinceId) {
        setSelectedProvinceId(provinceId);
        onProvinceNameChange?.(initialProvince);
      }
    }
  }, [initialProvince, provinceList, onProvinceNameChange]);

  // Districts
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvinceId) {
        setDistrictList([]);
        return;
      }
      try {
        const res = await fetch(
          `https://vapi.vnappmob.com/api/v2/province/district/${selectedProvinceId}`
        );
        const data = await res.json();
        setDistrictList(data?.results ?? []);
      } catch (e) {
        console.error("Fetch districts failed", e);
        setDistrictList([]);
      }
    };
    fetchDistricts();
  }, [selectedProvinceId]);

  // Prefill district khi có initialDistrict và districtList đã load
  useEffect(() => {
    if (initialDistrict && districtList.length > 0) {
      const districtId = getDistrictIdByName(initialDistrict);
      if (districtId) {
        setSelectedDistrictId(districtId);
        onDistrictNameChange?.(initialDistrict);
      }
    }
  }, [initialDistrict, districtList, onDistrictNameChange]);

  // Wards
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrictId) {
        setWardList([]);
        return;
      }
      try {
        const res = await fetch(
          `https://vapi.vnappmob.com/api/v2/province/ward/${selectedDistrictId}`
        );
        const data = await res.json();
        setWardList(data?.results ?? []);
      } catch (e) {
        console.error("Fetch wards failed", e);
        setWardList([]);
      }
    };
    fetchWards();
  }, [selectedDistrictId]);

  // Prefill ward khi có initialWard và wardList đã load
  useEffect(() => {
    if (initialWard && wardList.length > 0) {
      const wardId = getWardIdByName(initialWard);
      if (wardId) {
        onWardNameChange?.(initialWard);
      }
    }
  }, [initialWard, wardList, onWardNameChange]);

  const onProvinceChange = (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    const province = provinceList.find((p) => p.province_id === provinceId);
    onProvinceNameChange?.(province?.province_name ?? "");
    // reset downstream
    setSelectedDistrictId("");
    setDistrictList([]);
    setWardList([]);
    onDistrictNameChange?.("");
    onWardNameChange?.("");
  };

  const onDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
    const district = districtList.find((d) => d.district_id === districtId);
    onDistrictNameChange?.(district?.district_name ?? "");
    // reset wards
    setWardList([]);
    onWardNameChange?.("");
  };

  const onWardChange = (wardId: string) => {
    const ward = wardList.find((w) => w.ward_id === wardId);
    onWardNameChange?.(ward?.ward_name ?? "");
  };

  return {
    provinceList,
    districtList,
    wardList,
    selectedProvinceId,
    selectedDistrictId,
    onProvinceChange,
    onDistrictChange,
    onWardChange,
    getWardIdByName,
    getProvinceIdByName,
    getDistrictIdByName,
  };
};

export default useVietnamAddress;

