interface Step4PaymentProps {
  accountName: string;
  setAccountName: React.Dispatch<React.SetStateAction<string>>;
  accountNumber: string;
  setAccountNumber: React.Dispatch<React.SetStateAction<string>>;
  bankName: string;
  setBankName: React.Dispatch<React.SetStateAction<string>>;
  localBranch: string;
  setLocalBranch: React.Dispatch<React.SetStateAction<string>>;
  businessType: string;
  setBusinessType: React.Dispatch<React.SetStateAction<string>>;
}

export default function Step4Payment({
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
}: Step4PaymentProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-white text-lg font-semibold mb-4">Thông tin thanh toán</h3>
      <p className="text-gray-300 text-sm mb-6">
        Ticketbox sẽ chuyển tiền bán vé đến tài khoản của bạn sau khi xác nhận sale report từ 7 - 10 ngày. Nếu bạn muốn nhận được tiền sớm hơn, vui lòng liên hệ chúng tôi qua số 1900.6408 hoặc info@ticketbox.vn
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Chủ tài khoản</label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="VD: ABC Company Limited"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Số tài khoản</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="VD: 9876543210"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Tên ngân hàng</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="VD: BIDV"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Chi nhánh</label>
          <input
            type="text"
            value={localBranch}
            onChange={(e) => setLocalBranch(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="VD: Ha Noi Main Branch"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Loại hình kinh doanh</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-gray-300 text-sm">
              <input
                type="radio"
                name="business_type"
                value="company"
                checked={businessType === 'company'}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500"
              />
              Công ty
            </label>
            <label className="flex items-center gap-2 text-gray-300 text-sm">
              <input
                type="radio"
                name="business_type"
                value="personal"
                checked={businessType === 'personal'}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500"
              />
              Cá nhân
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}