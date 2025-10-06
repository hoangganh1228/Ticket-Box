'use client';
import { updateProfile } from '@/src/apis/user';
import { update } from '@/src/redux/store/authSlice';
import { RootState } from '@/src/redux/store/store';
import { SERVER_URL } from '@/src/utils/const/config.const';
import { CameraOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
export default function MyProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: user?.username || '',
    phone: user?.phone || '',
    email: user?.email || '',
    date_of_birth: user?.date_of_birth || '',
    gender: user?.gender || '',
    avatar: user?.avatar || null,
  });
  console.log('formData', formData);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, avatar: files ? files[0] : null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const payload = new FormData();
    payload.append('username', formData.username);
    payload.append('phone', formData.phone);
    payload.append('date_of_birth', formData.date_of_birth);
    payload.append('gender', formData.gender);
    if (formData.avatar && typeof (formData.avatar) !== 'string') payload.append('avatar', formData.avatar);

    try {
      const user = await updateProfile(payload);
      dispatch(update(user.data))
      toast.success('Cập nhập thông tin thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật');
      console.log('lỗi ở updateProfile', error);
    }
  };

  return (
    <>
      {/* right col */}
      <div className="md:bg-transparent m-auto w-[calc(100%-276px)] lg:pb-8 min-h-[50vh]">
        <div className="text-left text-2xl font-bold leading-6 pb-[1rem] bg-transparent text-white">
          Thông tin tài khoản
        </div>
        <Divider
          style={{ borderColor: '#ffffff80' }}
          className="mt-0"
        ></Divider>
        <div className="relative pt-0 overflow-auto">
          <div className="relative max-w-[360px] m-auto text-white box-border rounded-lg p-4">
            <div className="relative w-[128px] h-[128px] m-auto mb-4 cursor-pointer">
              <img
                src={
                  formData.avatar
                    ? (typeof formData.avatar === 'string'
                      ? `${SERVER_URL}${formData.avatar}`
                      : URL.createObjectURL(formData.avatar))
                    : 'https://static.ticketbox.vn/avatar.png'
                }
                alt="image1"
                className="rounded-full w-full h-full object-cover"
              />
              <label htmlFor="avatar-upload">
                <CameraOutlined className="absolute bottom-0 right-0 text-2xl cursor-pointer bg-primary rounded-xl p-1" />
              </label>
              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                className="hidden"
                onChange={handleChange}
              />
            </div>
            <div className="leading-[21px] mb-4 break-words">
              <div className="my-6 text-white text-center text-sm">
                Cung cấp thông tin chính xác sẽ hỗ trợ bạn trong quá trình mua
                vé, hoặc khi cần xác thực vé
              </div>
            </div>
            {/* name */}
            <div className="mt-2 min-h-[84px] h-auto w-full flex flex-col ">
              <div className="font-bold text-sm leading-4 mb-4 text-white">
                Họ và tên
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  placeholder="Nhập ở đây"
                  className="border border-transparent text-black cursor-text bg-[rgb(245,247,252)]
                  w-full h-[44px] p-3 outline-none font-normal text-sm leading-5 rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* phone */}
            <div className="mt-2 min-h-[84px] h-auto w-full flex flex-col ">
              <div className="font-bold text-sm leading-4 mb-4 text-white">
                Số điện thoại
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  placeholder="Nhập ở đây"
                  className="border border-transparent text-black cursor-text bg-[rgb(245,247,252)]
                  w-full h-[44px] p-3 outline-none font-normal text-sm leading-5 rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* email */}
            <div className="mt-2 min-h-[84px] h-auto w-full flex flex-col ">
              <div className="font-bold text-sm leading-4 mb-4 text-white">
                Email
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="email"
                  value={user?.email}
                  className="border border-transparent bg-[rgb(245,247,252)]
                  w-full h-[44px] p-3 outline-none font-normal text-sm leading-5 rounded-md text-[rgb(175,184,204)] cursor-not-allowed"
                  disabled
                />
                <CheckOutlined className="w-4 h-4 fill-none absolute top-[50%] right-[10px] -translate-y-1/2 text-primary" />
              </div>
            </div>

            {/* sinh nhật */}
            <div className="mt-2 min-h-[84px] h-auto w-full flex flex-col">
              <div className="font-bold text-sm leading-4 mb-4 text-white">
                Ngày tháng năm sinh
              </div>
              <div className="relative">
                <input
                  type="date"
                  name="date_of_birth"
                  placeholder="Chọn ngày sinh"
                  value={formData.date_of_birth}
                  className="border border-transparent text-black cursor-pointer bg-[rgb(245,247,252)]
                 w-full h-[44px] p-3 outline-none font-normal text-sm leading-5 rounded-md
                 focus:border-primary focus:ring-1 focus:ring-primary"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Giới tính */}
            <div className="mt-2 min-h-[84px] h-auto w-full flex flex-col">
              <div className="font-bold text-sm leading-4 mb-2 text-white">
                Giới tính
              </div>
              <div className="flex gap-6 items-center text-white">
                {['male', 'female', 'other'].map((g) => (
                  <label
                    key={g}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                      className="w-4 h-4 accent-primary"
                    />
                    <span>
                      {g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* button */}
            <div className="">
              <Button
                type="primary"
                className="w-full bg-primary"
                onClick={handleSubmit}
              >
                Hoàn thành
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
