import { useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { registerUser } from '@/src/apis/auth';
import { toast } from 'react-toastify';
import { SERVER_URL } from '@/src/utils/const/config.const';

export default function Register({
  onClose,
  onOpen,
}: {
  onClose: () => void;
  onOpen: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordValidation = {
    length: password.length >= 8 && password.length <= 32,
    hasUpperLower: /(?=.*[a-z])(?=.*[0-9])/.test(password),
    hasSpecial: /[!$@%]/.test(password),
    hasCapital: /[A-Z]/.test(password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isFormValid = email && isPasswordValid && password === confirmPassword;

  const handleSubmit = async () => {
    if (isFormValid) {
      // Handle registration logic
      try {
        const res = await registerUser({ email, password });
        if (res.success) {
          toast.success('Đăng Ký thành công!');
          onClose();
          setEmail('');
          setPassword('');
          onOpen();
        }
      } catch (error) {
        console.log('register error', error);
        toast.error(
          error?.response?.data?.message || 'Đăng Ký không thành công!'
        );
      }
    }
  };

  const handleLoginGoogle = async () => {
    window.location.href = `${SERVER_URL}/auth/google/login`;
  };

  return (
    <div className="flex justify-center items-center h-full w-full bg-[rgba(42,45,52,0.8)] fixed left-0 top-0 z-[999] max-h-screen">
      <div className="relative mx-8 rounded-xl bg-white h-auto w-full max-w-[400px]">
        {/* Close button */}
        <div
          className="absolute top-3 right-3 cursor-pointer z-10"
          onClick={onClose}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="flex m-0 p-0 flex-col gap-0 items-stretch">
          {/* Header section */}
          <div className="bg-[#2dc275] h-[112px] relative w-full rounded-t-xl flex items-end">
            <div className="flex items-center gap-4 pb-5 pl-6 w-full">
              <span className="font-bold text-[28px] text-white leading-8">
                Đăng ký tài khoản
              </span>
              <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center ml-auto mr-12">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-orange-400 rounded-full relative">
                    <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
                    <div className="absolute top-1 right-1 w-1 h-1 bg-black rounded-full"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-black rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form section */}
          <div className="flex flex-col gap-4 pt-6 px-6 pb-6 bg-white rounded-b-xl">
            {/* Google login option */}
            <button
              type="button"
              className="w-full py-2 bg-[#4285f4] text-white font-medium rounded-lg hover:bg-[#3367d6] transition-colors flex items-center justify-center gap-2"
              onClick={handleLoginGoogle}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
                />
                <path
                  fill="#34A853"
                  d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01a4.8 4.8 0 0 1-2.7.75 4.32 4.32 0 0 1-4.07-2.98H1.96v2.07A7.68 7.68 0 0 0 8.98 17z"
                />
                <path
                  fill="#FBBC04"
                  d="M4.9 10.82a4.32 4.32 0 0 1 0-2.64V6.11H1.97a7.18 7.18 0 0 0 0 6.78l2.92-2.07z"
                />
                <path
                  fill="#EA4335"
                  d="M8.98 4.32c1.16 0 2.23.4 3.06 1.2l2.3-2.3A7.68 7.68 0 0 0 8.98 1 7.68 7.68 0 0 0 1.97 6.11l2.92 2.07A4.32 4.32 0 0 1 8.98 4.32z"
                />
              </svg>
              Đăng nhập với Google
            </button>

            <div className="text-center text-sm text-gray-500">Hoặc</div>

            <div className="flex flex-col gap-4">
              {/* Email input */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2dc275] bg-gray-50"
                  placeholder="Nhập email của bạn"
                />
              </div>

              {/* Password input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2dc275] bg-gray-50"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>

              {/* Confirm Password input */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2dc275] bg-gray-50"
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeInvisibleOutlined />
                  ) : (
                    <EyeOutlined />
                  )}
                </button>
              </div>

              {/* Password validation box */}
              {password && (
                <div
                  className={`rounded-lg p-3 ${
                    isPasswordValid
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div
                    className={`font-medium text-sm mb-2 ${
                      isPasswordValid ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isPasswordValid
                      ? '✅ Mật khẩu hợp lệ'
                      : '❌ Mật khẩu chưa hợp lệ'}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div
                      className={`flex items-center gap-2 ${
                        passwordValidation.length
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      Từ 8 - 32 ký tự
                    </div>
                    <div
                      className={`flex items-center gap-2 ${
                        passwordValidation.hasUpperLower
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      Bao gồm chữ thường và số
                    </div>
                    <div
                      className={`flex items-center gap-2 ${
                        passwordValidation.hasSpecial
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      Bao gồm ký tự đặc biệt (!,$,@,%,...)
                    </div>
                    <div
                      className={`flex items-center gap-2 ${
                        passwordValidation.hasCapital
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      Có ít nhất 1 ký tự in hoa
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center">
                <span className="text-gray-500 text-sm">Đã có tài khoản? </span>
                <button
                  type="button"
                  className="text-[#2dc275] text-sm font-medium hover:underline"
                  onClick={() => {
                    onClose();
                    onOpen();
                  }}
                >
                  Đăng nhập ngay
                </button>
              </div>

              {/* Submit button */}
              <button
                type="button"
                onClick={handleSubmit}
                className={`w-full py-2 font-semibold rounded-lg transition-colors ${
                  isFormValid
                    ? 'bg-[#2dc275] text-white hover:bg-[#25a863]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isFormValid}
              >
                Tiếp tục
              </button>
            </div>

            {/* Footer text */}
            <div className="text-xs text-gray-500 leading-relaxed mt-2">
              Bằng việc tiếp tục, bạn đã đọc và đồng ý với{' '}
              <span className="text-[#2dc275] cursor-pointer hover:underline">
                Điều khoản sử dụng
              </span>{' '}
              và{' '}
              <span className="text-[#2dc275] cursor-pointer hover:underline">
                Chính sách bảo mật thông tin cá nhân
              </span>{' '}
              của Ticketbox
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
