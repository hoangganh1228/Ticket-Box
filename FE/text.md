{/* Tablet Layout (md to lg) */}
          <div className="hidden md:flex lg:hidden items-center justify-between">
            {/* Logo */}
            <Logo size="md" />

            {/* Search Bar - Full width on tablet */}
            <div className="flex flex-grow justify-center mx-6">
              <div className="relative flex items-center w-full max-w-xl">
                <SearchOutlined className="absolute left-4 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Bạn tìm gì hôm nay?"
                  className="w-full h-10 rounded-l-md bg-white text-gray-800 border-none pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button className="h-10 px-4 bg-white text-gray-500 rounded-r-md font-medium border-l border-gray-300 hover:bg-gray-100 transition-colors duration-200 text-sm">
                  Tìm
                </button>
              </div>
            </div>

            {/* Right side actions - condensed */}
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm rounded-full border-2 border-white text-white font-medium hover:bg-white hover:text-green-600 transition-colors duration-200 whitespace-nowrap">
                Tạo sự kiện
              </button>

              <Link
                href="/my-wallet"
                className="p-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                title="Vé của tôi"
              >
                <WalletOutlined className="text-xl" />
              </Link>

              {/* Account Dropdown - Touch & Hover friendly */}
              <div
                className="relative group"
                onMouseEnter={() => setIsAccountDropdownOpen(true)}
                onMouseLeave={() => setIsAccountDropdownOpen(false)}
              >
                <button
                  onClick={() =>
                    setIsAccountDropdownOpen(!isAccountDropdownOpen)
                  }
                  className="flex items-center space-x-1 p-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  <UserOutlined className="text-xl" />
                  <DownOutlined
                    className={`transition-transform duration-200 ${
                      isAccountDropdownOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                <div className="absolute top-full left-0 right-0 h-2"></div>

                {isAccountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800">
                    <Link
                      href="/my-wallet"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      <WalletOutlined className="text-lg" />
                      <span>Vé của tôi</span>
                    </Link>
                    <Link
                      href="/my-events"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      <CalendarOutlined className="text-lg" />
                      <span>Sự kiện của tôi</span>
                    </Link>
                    <Link
                      href="/my-account"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      <UserOutlined className="text-lg" />
                      <span>Tài khoản của tôi</span>
                    </Link>
                    <button
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      <LogoutOutlined className="text-lg" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Language Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsLanguageDropdownOpen(true)}
                onMouseLeave={() => setIsLanguageDropdownOpen(false)}
              >
                <button
                  onClick={() =>
                    setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                  }
                  className="flex items-center space-x-1 p-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  <img
                    src="https://flagicons.lipis.dev/flags/4x3/vn.svg"
                    alt="Vietnamese Flag"
                    className="w-6 h-4"
                  />
                  <DownOutlined
                    className={`transition-transform duration-200 ${
                      isLanguageDropdownOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                <div className="absolute top-full left-0 right-0 h-2"></div>

                {isLanguageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800">
                    <Link
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => setIsLanguageDropdownOpen(false)}
                    >
                      <img
                        src="https://flagicons.lipis.dev/flags/4x3/vn.svg"
                        alt="Vietnamese Flag"
                        className="w-6 h-4"
                      />
                      <span className="font-bold">Tiếng Việt</span>
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => setIsLanguageDropdownOpen(false)}
                    >
                      <img
                        src="https://flagicons.lipis.dev/flags/4x3/gb.svg"
                        alt="English Flag"
                        className="w-6 h-4"
                      />
                      <span>English</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex md:hidden items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <CloseOutlined className="text-xl" />
              ) : (
                <MenuOutlined className="text-xl" />
              )}
            </button>

            {/* Logo */}
            <Logo size="sm" />

            {/* Search and Language buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="p-2 rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                <SearchOutlined className="text-xl" />
              </button>

              <button
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                className="p-2 rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                <img
                  src="https://flagicons.lipis.dev/flags/4x3/vn.svg"
                  alt="Vietnamese Flag"
                  className="w-6 h-4"
                />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isMobileSearchOpen && (
            <div className="md:hidden mt-4">
              <div className="relative flex items-center">
                <SearchOutlined className="absolute left-4 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Bạn tìm gì hôm nay?"
                  className="w-full h-10 rounded-l-md bg-white text-gray-800 border-none pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button className="h-10 px-4 bg-white text-gray-500 rounded-r-md font-medium border-l border-gray-300 hover:bg-gray-100 transition-colors duration-200">
                  Tìm
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-green-600">
              <div className="flex flex-col space-y-2">
                <button className="w-full py-3 px-4 text-left rounded-md border-2 border-white text-white font-medium hover:bg-white hover:text-green-600 transition-colors duration-200">
                  Tạo sự kiện
                </button>

                <Link
                  href="/my-wallet"
                  className="flex items-center space-x-3 py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <WalletOutlined className="text-xl" />
                  <span>Vé của tôi</span>
                </Link>

                <Link
                  href="/my-events"
                  className="flex items-center space-x-3 py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CalendarOutlined className="text-xl" />
                  <span>Sự kiện của tôi</span>
                </Link>

                <Link
                  href="/my-account"
                  className="flex items-center space-x-3 py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserOutlined className="text-xl" />
                  <span>Tài khoản của tôi</span>
                </Link>

                <button className="flex items-center space-x-3 py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 w-full text-left">
                  <LogoutOutlined className="text-xl" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile Language Dropdown */}
          {isLanguageDropdownOpen && (
            <div className="md:hidden absolute left-4 right-4 mt-2 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800">
              <Link
                href="#"
                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsLanguageDropdownOpen(false)}
              >
                <img
                  src="https://flagicons.lipis.dev/flags/4x3/vn.svg"
                  alt="Vietnamese Flag"
                  className="w-6 h-4"
                />
                <span className="font-bold">Tiếng Việt</span>
              </Link>
              <Link
                href="#"
                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsLanguageDropdownOpen(false)}
              >
                <img
                  src="https://flagicons.lipis.dev/flags/4x3/gb.svg"
                  alt="English Flag"
                  className="w-6 h-4"
                />
                <span>English</span>
              </Link>
            </div>
          )}