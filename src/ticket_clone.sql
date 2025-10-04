-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th9 17, 2025 lúc 06:01 PM
-- Phiên bản máy phục vụ: 8.0.43-0ubuntu0.22.04.1
-- Phiên bản PHP: 8.1.2-1ubuntu2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `ticket_clone`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `carts`
--

CREATE TABLE `carts` (
  `id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `booking_code` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `expired_at` datetime NOT NULL,
  `total_quantity` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  `show_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `step` enum('book-now','payment-info','completed') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'book-now',
  `deleted_at` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `carts`
--

INSERT INTO `carts` (`id`, `created_at`, `updated_at`, `booking_code`, `expired_at`, `total_quantity`, `user_id`, `event_id`, `show_id`, `total_amount`, `step`, `deleted_at`) VALUES
(117, '2025-09-17 15:54:49.565143', '2025-09-17 15:54:53.000000', 'BOOK9EADBB4111AA', '2025-09-17 16:09:50', 1, 2, 15, 4, '0.00', 'payment-info', '2025-09-17 08:54:53.793000'),
(118, '2025-09-17 15:55:24.289655', '2025-09-17 16:07:11.000000', 'BOOK84319B6B821E', '2025-09-17 16:10:24', 1, 2, 3, 2, '200000.00', 'payment-info', '2025-09-17 09:07:11.801000'),
(119, '2025-09-17 16:07:24.987577', '2025-09-17 16:07:31.000000', 'BOOK0A0279A12CE6', '2025-09-17 16:22:25', 1, 2, 15, 4, '0.00', 'payment-info', '2025-09-17 09:07:31.889000'),
(120, '2025-09-17 16:08:34.062873', '2025-09-17 16:08:38.000000', 'BOOKF7E3CDFD6C45', '2025-09-17 16:23:34', 1, 2, 15, 4, '0.00', 'payment-info', '2025-09-17 09:08:38.467000'),
(121, '2025-09-17 17:15:22.195623', '2025-09-17 17:15:22.000000', 'BOOKC7C69A05B1F0', '2025-09-17 17:30:22', 1, 2, 3, 2, '200000.00', 'book-now', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `quantity` int NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `cart_id` int DEFAULT NULL,
  `ticket_id` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `is_free` tinyint DEFAULT NULL,
  `deleted_at` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cart_items`
--

INSERT INTO `cart_items` (`id`, `created_at`, `updated_at`, `quantity`, `price`, `cart_id`, `ticket_id`, `name`, `is_free`, `deleted_at`) VALUES
(116, '2025-09-17 15:54:49.567935', '2025-09-17 15:54:53.000000', 1, '0.00', 117, 23, 'Vé tham quan', NULL, '2025-09-17 08:54:53.791000'),
(117, '2025-09-17 15:55:24.292122', '2025-09-17 16:07:11.000000', 1, '200000.00', 118, 16, 'yuilyui', NULL, '2025-09-17 09:07:11.800000'),
(118, '2025-09-17 16:07:24.993086', '2025-09-17 16:07:31.000000', 1, '0.00', 119, 23, 'Vé tham quan', NULL, '2025-09-17 09:07:31.888000'),
(119, '2025-09-17 16:08:34.065432', '2025-09-17 16:08:38.000000', 1, '0.00', 120, 23, 'Vé tham quan', NULL, '2025-09-17 09:08:38.466000'),
(120, '2025-09-17 17:15:22.203961', '2025-09-17 17:15:22.203961', 1, '200000.00', 121, 16, 'yuilyui', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `slug` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `slug`, `name`, `created_at`, `updated_at`) VALUES
(1, 'music', 'music', '2025-09-03 10:18:43.000750', '2025-09-03 10:18:43.111394'),
(2, 'theatersandart', 'theatersandart', '2025-09-03 10:18:43.000750', '2025-09-03 10:18:43.111394'),
(3, 'sport', 'sport', '2025-09-03 10:18:43.000750', '2025-09-03 10:18:43.111394'),
(4, 'others', 'others', '2025-09-03 10:18:43.000750', '2025-09-03 10:18:43.111394');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `thumbnail` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `banner` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `slug` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` enum('offline','online') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` enum('draft','pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'draft',
  `name_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `province` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `district` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ward` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `street` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `category_id` int NOT NULL,
  `created_by` int NOT NULL,
  `org_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `org_description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `org_thumbnail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_special` tinyint NOT NULL DEFAULT '0',
  `is_trending` tinyint NOT NULL DEFAULT '0',
  `videoUrl` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `is_free` tinyint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `events`
--

INSERT INTO `events` (`id`, `name`, `description`, `thumbnail`, `banner`, `slug`, `type`, `status`, `name_address`, `province`, `district`, `ward`, `street`, `category_id`, `created_by`, `org_name`, `org_description`, `org_thumbnail`, `is_special`, `is_trending`, `videoUrl`, `created_at`, `updated_at`, `is_free`) VALUES
(2, 'Diễn Đàn PPP-P+2025: Chung Tay Thực Hiện Mục Tiêu Quốc Gia', '\"<div style=\\\"text-align: center;\\\"><strong>DIỄN ĐÀN KẾT HỢP HỘI NGHỊ</strong></div>\\n<div> </div>\\n<div style=\\\"text-align: center;\\\"><strong>PPP-P+: CHUNG TAY THỰC HIỆN MỤC TIÊU QUỐC GIA</strong><br><strong>HÀNH TRÌNH KIẾN TẠO VỊ THẾ TOP OF MIND BỀN VỮNG TẠI</strong><br><strong>VIỆT NAM TRONG KỶ NGUYÊN MỚI</strong></div>\\n<div style=\\\"text-align: left;\\\"><br>Với sứ mệnh kiến tạo một diễn đàn hợp tác chiến lược, chung tay thúc đẩy và thực hiện các mục tiêu sức khỏe quốc gia, tiếp nối thành công từ Hội Nghị Sức Khoẻ Toàn quốc lần thứ 2, Hội thảo chuyên đề kết hợp diễn đàn mở &#34;Chung tay thực hiện Mục tiêu Quốc gia cùng Mô hình PPP-P+: Hành trình kiến tạo vị thế Top of Mind bền vững tại Việt Nam trong kỷ nguyên mới&#34; sẽ diễn ra diễn từ 24 - 27/09/2025, theo hình thức trực tiếp, trong khuôn khổ PHARMEDI VIETNAM 2025, tự hào là điểm hội tụ của những nhân vật chủ chốt và có tầm ảnh hưởng lớn trong ngành. Đây là cơ hội để Thương hiệu quý đơn vị tiếp cận hơn 300 chuyên gia cùng 12.000+ lượt khách thương mại trong khuôn khổ PHARMEDI VIETNAM 2025, triển lãm y tế quốc tế lớn nhất tại Việt Nam, Trung tâm Hội nghị và Triển lãm Sài Gòn (SECC), Thành phố Hồ Chí Minh.</div>\\n<div> </div>\\n<div style=\\\"text-align: center;\\\"><strong>🎫 THÔNG TIN VÉ THAM DỰ – HỘI NGHỊ DIỄN ĐÀN PPP-P+ 2025</strong></div>\\n<div><br>Hành trình kiến tạo vị thế Top of Mind bền vững tại Việt Nam trong kỷ nguyên mới 📍 SECC – TP. Hồ Chí Minh | diễn ra từ ngày 24 đến 27/09/2025 (trong khuôn khổ Hội chợ Triển lãm Quốc tế Y tế Việt Nam – PHARMEDI 2025 </div>\\n<div> </div>\\n<div>🧾<strong> CÁC HẠNG VÉ &amp; QUYỀN LỢI ĐI KÈM</strong></div>\\n<div><br>Loại Vé Giá (USD) Quyền Lợi Nổi Bật</div>\\n<div><br>🟣 Vé Platinum (Visionary-Lãnh đạo chiến lược) 500 USD<br>- 01 phiên tư vấn chiến lược 1:1 (45–60 phút) cùng chuyên gia PPP-P+<br>- Nhận báo cáo cá nhân hoá, xây dựng thương hiệu Top-of-Mind<br>- Tên/đơn vị được giới thiệu trong báo cáo trình Văn Phòng Chính Phủ &amp; Bộ Y Tế<br>- Cấp quyền sử dụng biểu trưng “PPP-P+ Supporter”<br>- Ưu tiên mời tham gia các sáng kiến quốc gia giai đoạn 2025–2026<br>- Logo xuất hiện trong video &amp; bài báo tổng kết<br>- 01 phiếu bốc thăm đặc biệt (giải thưởng truyền thông trị giá đến 50 triệu đồng)<br>🔶 Vé Prestige (VIP -Ưu tiên cao cấp) 125 USD - Ghế ngồi VIP</div>\\n<div>- Tham dự toàn bộ chương trình ngày 24/09<br>- Tài liệu chuyên sâu &amp; quà tặng từ nhà tài trợ<br>- Private Dinner với diễn giả và lãnh đạo cấp cao (giới hạn 30 khách)<br>- 01 phiếu bốc thăm tiêu chuẩn<br>- Chứng nhận tham dự cá nhân hóa<br>🟡 Vé Professional (Chuyên đề toàn phần) 63 USD -150 vé<br>- Tham dự tất cả các phiên chuyên đề<br>- Bộ tài liệu chương trình<br>- 01 phiếu bốc thăm tiêu chuẩn<br>- Chứng nhận tham dự chính thức<br>🟢 Vé Community Access (Kết nối) 33 USD (Early Bird: 21 USD) -200 vé<br>- Tham dự 02 phiên tùy chọn trong ngày 24/09<br>- Tài liệu tóm tắt<br>- Tham quan khu vực triển lãm<br>- 01 phiếu bốc thăm tiêu chuẩn (áp dụng cho vé mua trước 10/09/2025)</div>\\n<div style=\\\"text-align: center;\\\"><strong>KHUNG CHƯƠNG TRÌNH KẾ HOẠCH NGÀY 24/09/2025</strong></div>\\n<div style=\\\"text-align: left;\\\">08:00 - 08:30: ĐÓN TIẾP ĐẠI BIỂU<br>08:30 - 09:30: OPENING SESSION - PHIÊN KHAI MẠC<br>Phát biểu chào mừng<br>Giới thiệu về tầm quan trọng của mở rộng yếu tố P+ trong hợp tác công tư<br>bền vững lĩnh vực chăm sóc sức khỏe tại Việt Nam kỷ nguyên mới.<br>Tham gia PPP- P+: Hành trình dẫn đầu bền vững nhờ gắn kết thương hiệu và<br>mục tiêu quốc gia giai đoạn đến năm 2030 tầm nhìn 2045<br>10 Sáng kiến PPP- P+ kỷ nguyên mới<br>Từ Người dân tiêu biểu: Thiện cảm khi chiến lược thương hiệu có trách nhiệm,<br>lấy sức khỏe người tiêu dùng làm trung tâm</div>\\n<div style=\\\"text-align: left;\\\"> </div>\\n<div style=\\\"text-align: left;\\\">09:30 - 10:45: SESSION 1: PPP-P+: CHUNG TAY PHÒNG CHỐNG NCDS (NON\\u0002COMMUNICABLE DISEASES - BỆNH KHÔNG LÂY NHIỄM)<br>Chủ đề tổng quan: &#34;Tăng cường phòng chống NCDs tại Việt Nam: Chiến lược PPP-P+<br>và vai trò đột phá của Công nghệ - Truyền thông.&#34;<br>Bài trình bày: &#34;PPP-P+ tại Việt Nam: Cùng Tuần lễ phòng chống NCDs toàn<br>cầu và gánh nặng bệnh không lây nhiễm.&#34; (20 phút)<br>Bài trình bày: &#34;Đòn bẩy mạnh mẽ: Vai trò của Truyền thông có trách nhiệm<br>kết hợp AI trong phòng chống NCDs.&#34; (20 phút)<br>Khởi động các Dự án Chiến lược PPP-P+ vì sức khỏe Việt: (15 phút)<br>Dự án &#34;NCDs 20+1: Vì sức khỏe Việt&#34;<br>Dự án &#34;10+ Lá chắn đánh bại gánh nặng bệnh ung thư Việt Nam&#34;<br>Dự án &#34;10+ Lá chắn đánh bại gánh nặng đột quỵ tại Việt Nam&#34;<br>Bài trình bày nhà tài trợ: &#34;Chung tay phòng chống NCDs.&#34; (10 phút)<br>Hỏi &amp; Đáp với diễn giả.</div>\\n<div style=\\\"text-align: left;\\\"> </div>\\n<div style=\\\"text-align: left;\\\">10:45 - 12:00: SESSION 2: PPP-P+: CHUNG TAY PHÒNG CHỐNG CDS<br>(COMMUNICABLE DISEASES - BỆNH TRUYỀN NHIỄM)<br>Bài trình bày: &#34;Phòng chống và ứng phó với các bệnh truyền nhiễm: Bài học từ<br>PPP-P+ và hướng đi tương lai.&#34; (Khoảng 20 phút)<br>Bài trình bày: &#34;Các giải pháp mới: Những tiến bộ trong cuộc chiến chống<br>bệnh truyền nhiễm.&#34; (Khoảng 20 phút)<br>Khởi động các Sáng kiến PPP-P+ trong phòng chống dịch bệnh: (Khoảng 15<br>phút)<br>&#34;Chung Tay Phòng Chống Sốt Xuất Huyết&#34;<br>&#34;Bác sĩ Tại Gia: Phòng ngừa và xử trí các bệnh hô hấp - tiêu hoá&#34;<br>Bài trình bày từ các nhà tài trợ: (10 phút) &#34;chung tay phòng chống CDs”<br>Hỏi &amp; Đáp với diễn giả: (10 phút)</div>\\n<div style=\\\"text-align: left;\\\"> </div>\\n<div style=\\\"text-align: left;\\\">13:30-14:00: KHÁCH MỜI ĐẶC BIỆT<br>14:00 - 14:50: SESSION 3: BRANDS FOR: WOMEN - CHILDREN - ELDERLY - 3- GENERATION FAMILY (THƯƠNG HIỆU DẪN ĐẦU VÌ PHỤ NỮ - TRẺ EM - NGƯỜI<br>CAO TUỔI - GIA ĐÌNH 3 THẾ HỆ)<br>Chủ đề tổng quan: &#34;Làm thế nào để thương hiệu dẫn đầu trong lĩnh vực chăm sóc<br>sức khỏe toàn diện và bền vững cho gia đình Việt kỷ nguyên mới.&#34; Bài trình bày: (30 phút)<br>Chăm sóc sức khỏe phụ nữ và trẻ em: Ưu tiên hàng đầu tương lai Việt Nam. Thích nghi với già hóa: Các giải pháp chăm sóc sức khỏe cho người cao tuổi<br>Khởi động các sáng kiến (15 phút)<br>1000 ngày vàng - 10 triệu mẹ và bé được chăm sóc chuẩn chuyên gia”<br>“20 triệu gia đình việt khoẻ mạnh - cùng kiến tạo tương lai”<br>“20 triệu Phụ Nữ Việt Nam: Hành Động Hôm Nay - Kiến Tạo Tương Lai “Sức khỏe toàn diện gia đình 3 thế hệ - vòng tròn hạnh phúc bền vững” Bài nói nhà tài trợ (10 phút)<br>Hỏi &amp; Đáp với diễn giả.(15 phút)<br>14:50 - 15:40: SESSION 4: MENTAL HEALTH &amp; WELLNESS AWARENESS – HƯỚNG<br>ĐI HIỆU QUẢ CỦA CÁC THƯƠNG HIỆU TIÊN PHONG TRONG KỶ NGUYÊN MỚI<br>Bài trình bày: Lợi ích Hành động từ các thương hiệu tiên phong (20 phút)<br>Từ công nghệ, y học cổ truyền đến y học hiện đại: Được hưởng lợi từ mục tiêu<br>ưu tiên của chiến lược quốc gia<br>Cộng đồng là quan trọng<br>Khởi động các sáng kiến: (10 Phút)<br>Tổng đài quốc gia về chăm sóc sức khỏe tâm thần<br>Mỗi Trường Học Là 1 trạm hạnh phúc<br>Bài nói nhà tài trợ (10 phút)<br>Hỏi &amp; Đáp với diễn giả. (10 phút)<br>15:40 - 15:55: Bài trình bày chuyên sâu: &#34;Dinh dưỡng chuẩn y khoa - Vai trò quan<br>trọng giúp tạo tác động kép: Phòng ngừa và phục hồi - định hình sức khỏe toàn diện.&#34;<br>15:55 - 16:10 Bài trình bày chuyên sâu: &#34;AI trong hệ sinh thái PPP-P+ chung tay thúc<br>đẩy mạnh mẽ đạt được các mục tiêu sức khỏe quốc gia KỶ NGUYÊN MỚI .&#34;<br>16:10 - 16:45: TỌA ĐÀM ĐA CHIỀU: &#34;CHUNG TAY THỰC HIỆN MỤC TIÊU QUỐC GIA<br>CÙNG MÔ HÌNH PPP-P+&#34; Cập nhật chi tiết 4 bước đồng bộ chiến lược thương hiệu và mục tiêu quốc gia<br>Chuyển hoá thách thức - chạm đến 6 cơ hội lớn cùng PPP-P+ Kỷ nguyên mới<br>Thúc đẩy yếu tố &#34;Plus&#34; (Giáo dục, Trao quyền, Bảo vệ nhóm yếu thế, Bảo vệ môi<br>trường) trong thực tiễn hợp tác. 16:45 - 17:00: TỔNG KẾT VÀ ĐỊNH HƯỚNG<br>CÁC HOẠT ĐỘNG BÊN LỀ NGÀY 24/09/2025<br>Diễn đàn mở về giải pháp chung tay (Công nghệ, truyền thông, giải pháp từ cổ<br>truyền đến hiện đại)<br>Triển lãm các giải pháp AI và các giải pháp từ đối tác đồng hành.</div>\\n<div style=\\\"text-align: left;\\\"> </div>\\n<div style=\\\"text-align: center;\\\"><strong>KHUNG CHƯƠNG TRÌNH KẾ HOẠCH NGÀY 25-27 /09/2025</strong></div>\\n<div style=\\\"text-align: left;\\\"><br>HOẠT ĐỘNG TRIỂN LÃM &amp; GIỚI THIỆU ĐỐI TÁC:<br>Các đơn vị đồng hành sẽ được cùng Ban tổ chức giới thiệu và triển lãm dịch vụ/sản<br>phẩm của mình đến hơn 20,000 lượt khách thương mại tham quan triển lãm.<br>PHIÊN TƯ VẤN 1:1 CHUYÊN SÂU &#34;HÀNH TRÌNH TOP OF MIND&#34; TẠI VIỆT NAM:<br>Đối với Lãnh đạo và chuyên gia các tổ chức, doanh nghiệp, cùng tham gia các phiên<br>Tư vấn 1:1 chuyên sâu về &#34;Hành trình Top of Mind&#34; cùng các chuyên gia hàng đầu,<br>được tổ chức theo lịch đã được đặt trước. Vui lòng đăng ký lịch hẹn tại Link BTC cấp<br>để tối ưu trải nghiệm của quý vị.<br>🎤 DIỄN GIẢ<br>1. Thầy thuốc Ưu tú, BS.CKII. Đặng Thị Kim Huyên<br>Nguyên Trưởng khoa Khám bệnh – Bệnh viện Nhi Đồng 2 TP.HCM<br>Bệnh viện Đại học Y Dược TP.HCM<br>2. GS.TS, Thầy thuốc Ưu tú Nguyễn Tiến Dũng<br>Phó Chủ tịch Hội Hô hấp Nhi Việt Nam<br>Nguyên Trưởng khoa Nhi – Bệnh viện Bạch Mai<br>3. ThS. Phan Thị Hoài Yến<br>Giảng viên – Đại học Y Dược TP.HCM<br>🌟 06 KHÁCH MỜI ĐẶC BIỆT<br>diễn giả tiêu biểu đại diện cho các khối kết nối chiến lược:<br>Giám đốc Marketing từ các Tập đoàn lớn<br>Lãnh đạo chuỗi Nhà thuốc uy tín<br>Lãnh đạo chuỗi Bệnh viện lớn<br>Đại diện các tổ chức NGO, hội chuyên ngành<br>Đại diện các Hiệp hội như Thương mại điện tử, Hội Người tiêu dùng<br>KOLs ngành Y tế &amp; Sức khỏe<br>🎁 CHƯƠNG TRÌNH BỐC THĂM MAY MẮN – 09 SUẤT ĐẶC BIỆT TẠI PPP-P+ 2025<br>Đừng bỏ lỡ cơ hội nhận những phần quà giá trị với tổng giải thưởng lên đến 500.000.000<br>VNĐ, dành riêng cho khách mời tham dự đầy đủ các hoạt động chính thức của PPP-P+<br>2025!<br>✨ THÔNG TIN CHƯƠNG TRÌNH:<br>🔹 Số lượng giải thưởng: 09 suất bốc thăm may mắn<br>🔹 Giá trị giải thưởng: Tương đương tổng cộng 500 triệu đồng, bao gồm:<br>Quà tặng cao cấp<br>Bộ sản phẩm chăm sóc sức khỏe toàn diện<br>Phiếu tư vấn chiến lược 1:1 cùng chuyên gia hàng đầu hệ sinh thái PPP-P+<br>Trở thành thành viên PPP-P+ ecosystem<br>🔹 Thời gian tổ chức: Trong phiên bế mạc ngày 27/09/2025<br>🔹 Điều kiện tham gia:<br>• Đăng ký trước ngày 15/08/2025<br>• Check-in và tham dự đầy đủ các phiên hội nghị chính<br>🌟 PPP-P+ 2025 không chỉ là nơi để kết nối – mà còn là nơi để được ghi nhận, truyền cảm<br>hứng và nhận những giá trị xứng đáng!</div>\"', 'https://images.tkbcdn.com/2/360/479/ts/ds/bc/57/26/f6ec207d14fa49a78e8116dc56d91e82.jpg', 'https://salt.tkbcdn.com/ts/ds/4e/de/d1/d68e4dbc1c2fb460d15d9e70e3a0d75e.png', 'chung-tay-thuc-hien-muc-tieu-quoc-gia', 'offline', 'pending', '799 Đường Nguyễn Văn Linh, Phường Tân Phú, Quận 7, Thành Phố Hồ Chí Minh', 'Hồ Chí Minh', 'Quận 7', 'Phường Tân Phú', '799 Đường Nguyễn Văn Linh', 4, 1, 'Ban dự án cộng đồng Việt Nam và ADCREW', 'Ban dự án cộng đồng Việt Nam và ADCREW', 'https://salt.tkbcdn.com/ts/ds/d3/e4/9a/053749426338d984930807a44f1074a8.jpg', 1, 0, NULL, '2025-09-03 10:18:46.959520', '2025-09-03 10:18:47.062609', NULL),
(3, 'EM XINH SAY HI CONCERT - ĐÊM 1', 'sdfgdbbvngcfbnkl', 'https://images.tkbcdn.com/2/608/332/ts/ds/f5/b9/1b/d3dc896b42999f4e0a12c8ecd08fde2f.jpg', 'https://salt.tkbcdn.com/ts/ds/f5/b9/1b/d3dc896b42999f4e0a12c8ecd08fde2f.jpg', 'em-xinh-say-hi-concert-dem-1', 'offline', 'pending', 'Khu đô thị Vạn Phúc, Phường Hiệp Bình Phước, Quận Thủ Đức, Thành Phố Hồ Chí Minh', 'Thành Phố Hồ Chí Minh', 'Quận Thủ Đức', 'Phường Hiệp Bình Phước', 'Khu đô thị Vạn Phúc', 4, 1, 'VieChannel', 'VieChannel: Đơn vị sản xuất', 'https://salt.tkbcdn.com/ts/ds/4c/d4/3b/d002a1011fe2ade59460341bd699f7a0.png', 0, 1, 'https://salt.tkbcdn.com/ts/ds/fb/04/09/ee99cb652e75e181cdcf17efdb8968c6.mp4', '2025-09-03 10:18:46.959520', '2025-09-03 10:18:47.062609', NULL);
INSERT INTO `events` (`id`, `name`, `description`, `thumbnail`, `banner`, `slug`, `type`, `status`, `name_address`, `province`, `district`, `ward`, `street`, `category_id`, `created_by`, `org_name`, `org_description`, `org_thumbnail`, `is_special`, `is_trending`, `videoUrl`, `created_at`, `updated_at`, `is_free`) VALUES
(15, 'Triển lãm Quốc tế Linh kiện Điện tử và Sản xuất Thông minh tại Việt Nam (GEIMS Việt Nam)', '\\u003cdiv class=\\\"OutlineElement Ltr SCXW82884740 BCX8\\\"\\u003e\\n\\u003ch1 class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e\\u003cspan style=\\\"font-size: 18px;\\\"\\u003e\\u003cstrong\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eGEIMS \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eViệt Nam\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e 2025 – \\u003c/span\\u003e\\u003c/span\\u003e\\u003cspan class=\\\"EOP SCXW82884740 BCX8\\\"\\u003e Triển lãm Toàn diện về Giải pháp Sản xuất Điện tử tại Việt Nam\\u003c/span\\u003e\\u003c/strong\\u003e\\u003c/span\\u003e\\u003c/h1\\u003e\\n\\u003cdiv\\u003e \\u003c/div\\u003e\\n\\u003c/div\\u003e\\n\\u003cdiv class=\\\"OutlineElement Ltr SCXW82884740 BCX8\\\"\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cstrong\\u003e\\u003cem\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eTriển\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elãm\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e Quốc \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etế\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e Linh \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eĐiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etử\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eSản\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003exuất\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e Thông minh \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etại\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e Việt Nam\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e– GEIMS \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eViệt Nam\\u003c/span\\u003e\\u003c/em\\u003e\\u003c/strong\\u003e \\u003c/span\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esẽ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echính\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethức\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrở\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elại\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etừ\\u003c/span\\u003e \\u003c/span\\u003e\\u003cstrong\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e20 \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđến\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e 22 \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etháng\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e 11 \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enăm\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e 2025\\u003c/span\\u003e\\u003c/span\\u003e\\u003c/strong\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etại\\u003c/span\\u003e \\u003c/span\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eTrung \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etâm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eTriển\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elãm\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e Quốc \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etế\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e I.C.E Hà \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eNội\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, 91 \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eTrần\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eHưng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eĐạo\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e (4 \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eTrần\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eBình \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eTrọng\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e), \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ePhường\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eCửa\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e Nam, Hà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eNội\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e.\\u003c/span\\u003e \\u003c/span\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eĐây\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elần\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethứ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehai\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esự\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđược\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etổ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echức\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebởi\\u003c/span\\u003e \\u003c/span\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eGlobal Sources\\u003c/span\\u003e\\u003c/span\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e – \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđơn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evị\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evới\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehơn\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e 20 \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enăm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekinh\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enghiệm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrong\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elĩnh\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evực\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etriển\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elãm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethương\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emại\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003equốc\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etế\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e – \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehứa\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehẹn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrở\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethành\\u003c/span\\u003e \\u003c/span\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđiểm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehẹn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echiến\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elược\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003edành\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echo\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecác\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emua\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehàng\\u003c/span\\u003e \\u003c/span\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrong\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003engành\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esản\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003exuất\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etử\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esản\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003exuất\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethông\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e minh.\\u003c/span\\u003e\\u003c/span\\u003e\\u003cspan class=\\\"EOP SCXW82884740 BCX8\\\"\\u003e \\u003c/span\\u003e\\u003c/p\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e \\u003c/p\\u003e\\n\\u003c/div\\u003e\\n\\u003cdiv class=\\\"OutlineElement Ltr SCXW82884740 BCX8\\\"\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eGEIMS Việt Nam 2025\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003equy\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etụ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehơn\\u003c/span\\u003e \\u003c/span\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e200 \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecung\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecấp\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, \\u003c/span\\u003e\\u003c/span\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evới\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehơn\\u003c/span\\u003e \\u003c/span\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e250\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003egian\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehàng\\u003c/span\\u003e\\u003c/span\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđến\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etừ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhững\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrung\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etâm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elinh\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etử\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehàng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđầu\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echâu\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e Á \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhư\\u003c/span\\u003e \\u003c/span\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eViệt Nam, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eTrung Quốc \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eĐại\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elục\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, Hồng Kông, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eĐài\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e Loan,\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eHàn Quốc,\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eNhật\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eBản\\u003c/span\\u003e\\u003c/span\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e… \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eTriển\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elãm\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e GEIMS\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e Việt Nam \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003equy\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etụ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehàng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003engàn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esản\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ephẩm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecông\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enghệ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđột\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ephá\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evới\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esáu\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003engành\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrọng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđiểm\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e:\\u003c/span\\u003e\\u003c/span\\u003e\\u003cspan class=\\\"EOP SCXW82884740 BCX8\\\"\\u003e \\u003c/span\\u003e\\u003c/p\\u003e\\n\\u003c/div\\u003e\\n\\u003cdiv class=\\\"ListContainerWrapper SCXW82884740 BCX8\\\"\\u003e\\n\\u003cul class=\\\"BulletListStyle1 SCXW82884740 BCX8\\\"\\u003e\\n\\u003cli class=\\\"OutlineElement Ltr SCXW82884740 BCX8\\\"\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eLinh \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etử\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e / \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eDây\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđiện\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e - \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eDây\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecáp\\u003c/span\\u003e\\u003c/span\\u003e\\u003c/p\\u003e\\n\\u003c/li\\u003e\\n\\u003c/ul\\u003e\\n\\u003c/div\\u003e\\n\\u003cdiv class=\\\"ListContainerWrapper SCXW82884740 BCX8\\\"\\u003e\\n\\u003cul class=\\\"BulletListStyle1 SCXW82884740 BCX8\\\"\\u003e\\n\\u003cli class=\\\"OutlineElement Ltr SCXW82884740 BCX8\\\"\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eThiết\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebị\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e SMT \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethiết\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebị\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekiểm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etra\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e - \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđo\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elường\\u003c/span\\u003e\\u003c/span\\u003e\\u003c/p\\u003e\\n\\u003c/li\\u003e\\n\\u003c/ul\\u003e\\n\\u003c/div\\u003e\\n\\u003cdiv class=\\\"ListContainerWrapper SCXW82884740 BCX8\\\"\\u003e\\n\\u003cul class=\\\"BulletListStyle1 SCXW82884740 BCX8\\\"\\u003e\\n\\u003cli class=\\\"OutlineElement Ltr SCXW82884740 BCX8\\\"\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ePCB/PCBA\\u003c/span\\u003e\\u003c/span\\u003e\\u003c/p\\u003e\\n\\u003c/li\\u003e\\n\\u003c/ul\\u003e\\n\\u003c/div\\u003e\\n\\u003cdiv class=\\\"ListContainerWrapper SCXW82884740 BCX8\\\"\\u003e\\n\\u003cul class=\\\"BulletListStyle1 SCXW82884740 BCX8\\\"\\u003e\\n\\u003cli class=\\\"OutlineElement Ltr SCXW82884740 BCX8\\\"\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eThiết\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebị\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e \\u0026amp; \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eVật\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eliệu\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehỗ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrợ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emáy\\u003c/span\\u003e\\u003c/span\\u003e\\u003c/p\\u003e\\n\\u003c/li\\u003e\\n\\u003c/ul\\u003e\\n\\u003c/div\\u003e\\n\\u003cdiv class=\\\"ListContainerWrapper SCXW82884740 BCX8\\\"\\u003e\\n\\u003cul class=\\\"BulletListStyle1 SCXW82884740 BCX8\\\"\\u003e\\n\\u003cli class=\\\"OutlineElement Ltr SCXW82884740 BCX8\\\"\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eLinh \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003egia\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecông\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echính\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003exác\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethiết\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebị\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etự\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđộng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehóa\\u003c/span\\u003e\\u003c/span\\u003e\\u003c/p\\u003e\\n\\u003c/li\\u003e\\n\\u003cli class=\\\"OutlineElement Ltr SCXW82884740 BCX8\\\"\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eVIOE \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003equang\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etử\\u003c/span\\u003e\\u003c/span\\u003e\\u003c/p\\u003e\\n\\u003c/li\\u003e\\n\\u003c/ul\\u003e\\n\\u003cdiv\\u003e \\u003c/div\\u003e\\n\\u003c/div\\u003e\\n\\u003cdiv class=\\\"OutlineElement Ltr SCXW82884740 BCX8\\\"\\u003e\\n\\u003ch1 class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e\\u003cspan style=\\\"font-size: 18px;\\\"\\u003e\\u003cstrong\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eGEIMS Việt Nam 2025: \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eNơi\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emang\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđến\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003egiải\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003epháp\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethực\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echiến\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003egiúp\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etiết\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekiệm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethời\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003egian\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etối\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eưu\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e chi \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ephí\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrong\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003equản\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elý\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echuỗi\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecung\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eứng\\u003c/span\\u003e\\u003c/span\\u003e\\u003cspan class=\\\"EOP SCXW82884740 BCX8\\\"\\u003e \\u003c/span\\u003e\\u003c/strong\\u003e\\u003c/span\\u003e\\u003c/h1\\u003e\\n\\u003c/div\\u003e\\n\\u003cdiv class=\\\"OutlineElement Ltr SCXW82884740 BCX8\\\"\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eNếu\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebạn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekỹ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esư\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ephụ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrách\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evận\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehành\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, R\\u0026amp;D, sales hay marketing \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrong\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emáy\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esản\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003exuất\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethiết\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebị\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etử\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, GEIMS Việt Nam 2025 \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echính\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esự\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekhông\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethể\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebỏ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elỡ\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e.\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e GEIMS Việt Nam \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e2025 \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003el\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđiểm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđến\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elý\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etưởng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđể\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebạn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etiếp\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecận\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etoàn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecảnh\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecác\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003egiải\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003epháp\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecông\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enghệ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etiên\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etiến\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhất\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrong\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003engành\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e – \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etừ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elinh\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekiện\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethiết\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebị\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e SMT, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehệ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethống\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđo\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elường\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ephần\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emềm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evận\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehành\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emáy\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evật\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etư\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ephòng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esạch\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđến\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e robot, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethị\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003egiác\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emáy\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etự\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđộng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehóa\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e. \\u003c/span\\u003e\\u003c/span\\u003e\\u003cspan class=\\\"EOP SCXW82884740 BCX8\\\"\\u003e \\u003c/span\\u003e\\u003c/p\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e \\u003c/p\\u003e\\n\\u003c/div\\u003e\\n\\u003cdiv class=\\\"OutlineElement Ltr SCXW82884740 BCX8\\\"\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eTrong \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebối\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecảnh\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echuỗi\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecung\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eứng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etoàn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecầu\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđang\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etái\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecấu\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrúc\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003edịch\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echuyển\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emạnh\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evề\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekhu\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evực\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e Đông Nam Á, Việt Nam \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđang\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evươn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elên\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethành\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrung\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etâm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esản\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003exuất\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etử\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emới\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evới\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etốc\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđộ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etăng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrưởng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eấn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etượng\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e. Các \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emáy\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esản\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003exuất\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elắp\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eráp\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethiết\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebị\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etử\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003engày\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e nay \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekhông\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echỉ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etìm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekiếm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elinh\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekiện\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecòn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecần\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhững\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecung\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecấp\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003euy\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etín\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etại\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e Việt Nam \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđể\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehoàn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethiện\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echuỗi\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecung\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eứng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enội\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđịa\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e – \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elinh\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehoạt\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etối\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eưu\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e chi \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ephí\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esẵn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esàng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etùy\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebiến\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etheo\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eyêu\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecầu\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esản\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003exuất\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e.\\u003c/span\\u003e\\u003c/span\\u003e\\u003c/p\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e \\u003c/p\\u003e\\n\\u003cp class=\\\"Paragraph SCXW82884740 BCX8\\\"\\u003e\\u003cspan class=\\\"TextRun SCXW82884740 BCX8\\\" lang=\\\"EN-US\\\"\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eGEIMS Việt Nam 2025 \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emang\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđến\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echo\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ebạn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecơ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehội\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđánh\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003egiá\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enăng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elực\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecung\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecấp\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrực\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etiếp\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etại\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003egian\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehàng\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ekiểm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etra\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esản\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ephẩm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethực\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etế\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđặt\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003elịch\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehẹn\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eriêng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđể\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrao\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđổi\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echuyên\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esâu\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e, \\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđồng\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethời\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etham\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003edự\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecác\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ehội\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ethảo\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003echuyên\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eđề\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhằm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecập\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enhật\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecông\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enghệ\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emới\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003evà\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etối\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003eưu\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003equy\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003etrình\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003emua\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003esắm\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003ecông\\u003c/span\\u003e \\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003enghiệp\\u003c/span\\u003e\\u003cspan class=\\\"NormalTextRun SCXW82884740 BCX8\\\"\\u003e.\\u003c/span\\u003e\\u003c/span\\u003e\\u003cspan class=\\\"EOP SCXW82884740 BCX8\\\"\\u003e \\u003c/span\\u003e\\u003c/p\\u003e\\n\\u003cdiv\\u003e\\u003cstrong\\u003eTriển lãm Quốc tế Linh kiện Điện tử và Sản xuất Thông minh tại Việt Nam (GEIMS Việt Nam)\\u003c/strong\\u003e\\u003c/div\\u003e\\n\\u003cdiv\\u003e\\u003cstrong\\u003eThời gian\\u003c/strong\\u003e: 20–22/11/2025 (T5-T6-T7) | Mở cửa đón khách: 9h - 17h mỗi ngày\\u003c/div\\u003e\\n\\u003cdiv\\u003e\\u003cstrong\\u003eĐịa điểm\\u003c/strong\\u003e: Trung tâm triển lãm quốc tế I.C.E Hà Nội, 91 Trần Hưng Đạo (4 Trần Bình Trọng), Phường Cửa Nam, Hà Nội\\u003c/div\\u003e\\n\\u003cdiv\\u003e \\u003c/div\\u003e\\n\\u003cdiv\\u003e\\u003cstrong\\u003eWebsite\\u003c/strong\\u003e: \\u003cspan class=\\\"html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs\\\" style=\\\"color: #236fa1;\\\"\\u003e\\u003ca class=\\\"x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xkrqix3 x1sur9pj x1fey0fg x1s688f\\\" style=\\\"color: #236fa1;\\\" href=\\\"https://www.globalsources.com/trade-fair/geims/vn/?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExTGVHd2RTWDZqSDhhSjltaAEevuKtbfOd1W6x7bZFFT1K2V9Nd8Ck6kqLN8mWPKm16F1mUZcEqXh6IUSivZQ_aem_00wuHT8uLZj6G7pDRpdMPA\\\" rel=\\\"nofollow\\\"\\u003ehttps://www.globalsources.com/trade-fair/geims/vn/\\u003c/a\\u003e\\u003c/span\\u003e\\u003c/div\\u003e\\n\\u003cdiv\\u003e\\u003cspan class=\\\"html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs\\\"\\u003e\\u003cstrong\\u003eFacebook\\u003c/strong\\u003e:\\u003cspan style=\\\"color: #236fa1;\\\"\\u003e \\u003ca style=\\\"color: #236fa1;\\\" href=\\\"https://www.facebook.com/geims.vn\\\" rel=\\\"nofollow\\\"\\u003ehttps://www.facebook.com/geims.vn\\u003c/a\\u003e\\u003c/span\\u003e\\u003c/span\\u003e\\u003c/div\\u003e\\n\\u003cdiv\\u003e\\u003cspan class=\\\"html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs\\\"\\u003e\\u003cstrong\\u003eLinkedin\\u003c/strong\\u003e:\\u003cspan style=\\\"color: #236fa1;\\\"\\u003e \\u003ca style=\\\"color: #236fa1;\\\" href=\\\"https://www.linkedin.com/company/global-electronic-intelligent-manufacturing-show-vietnam/\\\" rel=\\\"nofollow\\\"\\u003ehttps://www.linkedin.com/company/global-electronic-intelligent-manufacturing-show-vietnam/\\u003c/a\\u003e\\u003c/span\\u003e\\u003c/span\\u003e\\u003c/div\\u003e\\n\\u003cdiv\\u003e\\n\\u003cdiv\\u003e\\u003cstrong\\u003eEmail\\u003c/strong\\u003e: \\u003cspan style=\\\"color: #236fa1;\\\"\\u003egeimsvietnam-services@globalsources.com\\u003c/span\\u003e\\u003c/div\\u003e\\n\\u003cdiv\\u003eTel: 028 7101 2828\\u003c/div\\u003e\\n\\u003cdiv\\u003e \\u003c/div\\u003e\\n\\u003ch2\\u003e\\u003cstrong\\u003eĐăng ký tham quan miễn phí tại link: \\u003cspan style=\\\"color: #236fa1;\\\"\\u003e\\u003ca style=\\\"color: #236fa1;\\\" href=\\\"https://tinyurl.com/dangkygeimsvm\\\" rel=\\\"nofollow\\\"\\u003ehttps://tinyurl.com/dangkygeimsvm\\u003c/a\\u003e\\u003c/span\\u003e\\u003c/strong\\u003e\\u003c/h2\\u003e\\n\\u003c/div\\u003e\\n\\u003c/div\\u003e', 'https://images.tkbcdn.com/2/608/332/ts/ds/9d/f3/bc/3944984841ed2380ee45c36ed66cd7e1.png', 'https://salt.tkbcdn.com/ts/ds/9d/f3/bc/3944984841ed2380ee45c36ed66cd7e1.png', 'trien-lam-quoc-te', 'offline', 'draft', '91, Trần Hưng Đạo, Phường Cửa Nam, Quận Hoàn Kiếm, Thành Phố Hà Nội', 'Thành Phố Hà Nội', 'Quận Hoàn Kiếm', 'Phường Cửa Nam', '91, Trần Hưng Đạo', 2, 1, 'Global Sources', 'Global Sources', 'https://salt.tkbcdn.com/ts/ds/a7/33/25/2e286dbdb0fd7f492d214edd8af9823a.png', 1, 0, NULL, '2025-09-17 13:30:57.000000', '2025-09-17 14:59:02.450142', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_memberships`
--

CREATE TABLE `event_memberships` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `event_role_id` int NOT NULL,
  `joined_at` datetime DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_roles`
--

CREATE TABLE `event_roles` (
  `id` int NOT NULL,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `display_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_role_permissions`
--

CREATE TABLE `event_role_permissions` (
  `id` int NOT NULL,
  `event_role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int NOT NULL,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
(1, 1755158032387, 'UpdateDb1755158032387'),
(2, 1755231450207, 'AddIsSpecialAndTrendingToEvents1755231450207'),
(3, 1755505719403, 'AddVideoUrlToEvents1755505719403'),
(4, 1755532311458, 'DeleteStartTimeEndTimeToEvents1755532311458'),
(5, 1756378283422, 'Updatedb1756378283422');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `phone` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `payment_method_id` int DEFAULT NULL,
  `payment_status_id` int NOT NULL,
  `status` enum('PENDING','CONFIRMED','CANCELLED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `total_amount` decimal(10,2) NOT NULL,
  `total_quantity` int NOT NULL,
  `orderCode` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `show_id` int NOT NULL,
  `booking_code` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `paymentMethod` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `event_id`, `phone`, `email`, `created_at`, `updated_at`, `payment_method_id`, `payment_status_id`, `status`, `total_amount`, `total_quantity`, `orderCode`, `show_id`, `booking_code`, `paymentMethod`) VALUES
(35, 2, 15, NULL, 'sam@gmail.com', '2025-09-17 15:54:53.781000', '2025-09-17 15:54:53.781000', NULL, 1, 'CONFIRMED', '0.00', 1, 'ORD-1758099293781', 4, 'BOOK9EADBB4111AA', 'freeMethod'),
(36, 2, 3, NULL, 'sam@gmail.com', '2025-09-17 15:59:40.144000', '2025-09-17 15:59:40.144000', 1, 1, 'PENDING', '200000.00', 1, 'ORD-1758099580144', 2, 'BOOK84319B6B821E', ''),
(37, 2, 3, NULL, 'sam@gmail.com', '2025-09-17 15:59:45.849000', '2025-09-17 15:59:45.849000', 1, 1, 'PENDING', '200000.00', 1, 'ORD-1758099585849', 2, 'BOOK84319B6B821E', ''),
(38, 2, 3, NULL, 'sam@gmail.com', '2025-09-17 16:00:22.040000', '2025-09-17 16:00:22.040000', 1, 1, 'PENDING', '200000.00', 1, 'ORD-1758099622040', 2, 'BOOK84319B6B821E', ''),
(39, 2, 3, NULL, 'sam@gmail.com', '2025-09-17 16:01:14.678000', '2025-09-17 16:01:14.678000', 1, 1, 'PENDING', '200000.00', 1, 'ORD-1758099674678', 2, 'BOOK84319B6B821E', ''),
(40, 2, 3, NULL, 'sam@gmail.com', '2025-09-17 16:02:05.037000', '2025-09-17 16:02:05.037000', 1, 1, 'PENDING', '200000.00', 1, 'ORD-1758099725037', 2, 'BOOK84319B6B821E', ''),
(41, 2, 3, NULL, 'sam@gmail.com', '2025-09-17 16:02:32.899000', '2025-09-17 16:02:32.899000', 1, 1, 'PENDING', '200000.00', 1, 'ORD-1758099752899', 2, 'BOOK84319B6B821E', ''),
(42, 2, 3, NULL, 'sam@gmail.com', '2025-09-17 16:04:18.786000', '2025-09-17 16:04:18.786000', 1, 1, 'PENDING', '200000.00', 1, 'ORD-1758099858786', 2, 'BOOK84319B6B821E', ''),
(43, 2, 3, NULL, 'sam@gmail.com', '2025-09-17 16:05:27.165000', '2025-09-17 16:05:27.165000', 1, 1, 'PENDING', '200000.00', 1, 'ORD-1758099927165', 2, 'BOOK84319B6B821E', ''),
(44, 2, 3, NULL, 'sam@gmail.com', '2025-09-17 16:06:31.856000', '2025-09-17 16:06:31.856000', 1, 1, 'PENDING', '200000.00', 1, 'ORD-1758099991856', 2, 'BOOK84319B6B821E', ''),
(45, 2, 3, NULL, 'sam@gmail.com', '2025-09-17 16:06:45.461000', '2025-09-17 16:07:11.000000', 1, 2, 'PENDING', '200000.00', 1, 'ORD-1758100005461', 2, 'BOOK84319B6B821E', ''),
(46, 2, 15, NULL, 'sam@gmail.com', '2025-09-17 16:07:31.885000', '2025-09-17 16:07:31.885000', NULL, 1, 'CONFIRMED', '0.00', 1, 'ORD-1758100051885', 4, 'BOOK0A0279A12CE6', 'freeMethod'),
(47, 2, 15, NULL, 'sam@gmail.com', '2025-09-17 16:08:38.462000', '2025-09-17 16:08:38.462000', NULL, 1, 'CONFIRMED', '0.00', 1, 'ORD-1758100118462', 4, 'BOOKF7E3CDFD6C45', 'freeMethod');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `order_id` int NOT NULL,
  `ticket_id` int NOT NULL,
  `show_id` int NOT NULL,
  `ticket_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `created_at`, `updated_at`, `order_id`, `ticket_id`, `show_id`, `ticket_name`, `price`, `quantity`) VALUES
(26, '2025-09-17 15:54:53.785000', '2025-09-17 15:54:53.785000', 35, 23, 4, 'Vé tham quan', '0.00', 1),
(27, '2025-09-17 15:59:40.149000', '2025-09-17 15:59:40.149000', 36, 16, 2, 'yuilyui', '200000.00', 1),
(28, '2025-09-17 15:59:45.851000', '2025-09-17 15:59:45.851000', 37, 16, 2, 'yuilyui', '200000.00', 1),
(29, '2025-09-17 16:00:22.052000', '2025-09-17 16:00:22.052000', 38, 16, 2, 'yuilyui', '200000.00', 1),
(30, '2025-09-17 16:01:14.693000', '2025-09-17 16:01:14.693000', 39, 16, 2, 'yuilyui', '200000.00', 1),
(31, '2025-09-17 16:02:05.041000', '2025-09-17 16:02:05.041000', 40, 16, 2, 'yuilyui', '200000.00', 1),
(32, '2025-09-17 16:02:32.903000', '2025-09-17 16:02:32.903000', 41, 16, 2, 'yuilyui', '200000.00', 1),
(33, '2025-09-17 16:04:18.802000', '2025-09-17 16:04:18.802000', 42, 16, 2, 'yuilyui', '200000.00', 1),
(34, '2025-09-17 16:05:27.176000', '2025-09-17 16:05:27.176000', 43, 16, 2, 'yuilyui', '200000.00', 1),
(35, '2025-09-17 16:06:31.861000', '2025-09-17 16:06:31.861000', 44, 16, 2, 'yuilyui', '200000.00', 1),
(36, '2025-09-17 16:06:45.463000', '2025-09-17 16:06:45.463000', 45, 16, 2, 'yuilyui', '200000.00', 1),
(37, '2025-09-17 16:07:31.887000', '2025-09-17 16:07:31.887000', 46, 23, 4, 'Vé tham quan', '0.00', 1),
(38, '2025-09-17 16:08:38.464000', '2025-09-17 16:08:38.464000', 47, 23, 4, 'Vé tham quan', '0.00', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `logoUrl` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `code` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `name`, `logoUrl`, `created_at`, `updated_at`, `code`) VALUES
(1, 'VNPAY/Ứng dụng ngân hàng', 'https://salt.tkbcdn.com/ts/ds/e5/6d/9a/a5262401410b7057b04114ad15b93d85.png', '2025-09-11 15:25:44.000000', '2025-09-15 10:56:10.504799', 'VNBANK'),
(2, 'Zalopay', 'https://salt.tkbcdn.com/ts/ds/ac/2c/68/ee062970f97385ed9e28757b0270e249.png', '2025-09-11 15:25:44.000000', '2025-09-15 10:56:22.126829', 'ZALOPAY');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_status`
--

CREATE TABLE `payment_status` (
  `id` int NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_status`
--

INSERT INTO `payment_status` (`id`, `code`, `name`, `created_at`, `updated_at`) VALUES
(1, 'PENDING', 'Chưa Thanh Toán', '2025-09-15 14:33:05.000000', '2025-09-15 14:33:05.000000'),
(2, 'PAID', 'Đã Thanh Toán', '2025-09-15 14:33:05.000000', '2025-09-15 14:33:05.000000'),
(3, 'CANCELLED', 'Thanh Toán Lỗi', '2025-09-15 14:33:50.000000', '2025-09-15 14:33:50.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_transactions`
--

CREATE TABLE `payment_transactions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `payment_gateway` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `gateway_transaction_id` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('PENDING','SUCCESS','FAILED','CANCELED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `callback_data` text COLLATE utf8mb4_general_ci,
  `paid_at` datetime DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `order_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `request_data` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_transactions`
--

INSERT INTO `payment_transactions` (`id`, `user_id`, `payment_gateway`, `gateway_transaction_id`, `amount`, `status`, `callback_data`, `paid_at`, `created_at`, `updated_at`, `order_code`, `ip_address`, `request_data`) VALUES
(21, 2, 'vnpay', NULL, '200000.00', 'PENDING', NULL, NULL, '2025-09-17 15:59:40.160563', '2025-09-17 15:59:40.160563', 'ORD-1758099580144', '::1', NULL),
(22, 2, 'vnpay', NULL, '200000.00', 'PENDING', NULL, NULL, '2025-09-17 15:59:45.853306', '2025-09-17 15:59:45.853306', 'ORD-1758099585849', '::1', NULL),
(23, 2, 'vnpay', NULL, '200000.00', 'PENDING', NULL, NULL, '2025-09-17 16:00:22.060049', '2025-09-17 16:00:22.060049', 'ORD-1758099622040', '::1', NULL),
(24, 2, 'vnpay', NULL, '200000.00', 'PENDING', NULL, NULL, '2025-09-17 16:01:14.699197', '2025-09-17 16:01:14.699197', 'ORD-1758099674678', '::1', NULL),
(25, 2, 'vnpay', NULL, '200000.00', 'PENDING', NULL, NULL, '2025-09-17 16:02:05.046286', '2025-09-17 16:02:05.046286', 'ORD-1758099725037', '::1', NULL),
(26, 2, 'vnpay', NULL, '200000.00', 'PENDING', NULL, NULL, '2025-09-17 16:02:32.908921', '2025-09-17 16:02:32.908921', 'ORD-1758099752899', '::1', NULL),
(27, 2, 'vnpay', NULL, '200000.00', 'PENDING', NULL, NULL, '2025-09-17 16:04:18.810920', '2025-09-17 16:04:18.810920', 'ORD-1758099858786', '::1', NULL),
(28, 2, 'vnpay', NULL, '200000.00', 'PENDING', NULL, NULL, '2025-09-17 16:05:27.179753', '2025-09-17 16:05:27.179753', 'ORD-1758099927165', '::1', NULL),
(29, 2, 'vnpay', NULL, '200000.00', 'PENDING', NULL, NULL, '2025-09-17 16:06:31.866685', '2025-09-17 16:06:31.866685', 'ORD-1758099991856', '::1', NULL),
(30, 2, 'vnpay', NULL, '200000.00', 'SUCCESS', NULL, NULL, '2025-09-17 16:06:45.465405', '2025-09-17 16:07:11.000000', 'ORD-1758100005461', '::1', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `permissions`
--

CREATE TABLE `permissions` (
  `id` int NOT NULL,
  `route_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `method` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `display_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `permissions`
--

INSERT INTO `permissions` (`id`, `route_code`, `path`, `method`, `display_name`, `created_at`, `updated_at`) VALUES
(1, 'VIEW_ALL_MEMBER_EVENT', 'member-events', 'GET', 'View all members in event', '2025-09-03 10:18:46.245727', '2025-09-03 10:18:46.320852'),
(2, 'VIEW_ALL_PERMISSION', 'permissions', 'GET', 'View all permissions', '2025-09-03 10:18:46.245727', '2025-09-03 10:18:46.320852'),
(3, 'ADD_OR_UPDATE_PERMISSION_IN_ROLE', 'roles', 'post', 'ADD OR UPDATE PERMISSION IN ROLE', '2025-09-03 10:18:47.678188', '2025-09-03 10:18:47.678188');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `refund_transactions`
--

CREATE TABLE `refund_transactions` (
  `id` int NOT NULL,
  `payment_transaction_id` int NOT NULL,
  `user_id` int NOT NULL,
  `refund_amount` decimal(12,2) NOT NULL,
  `status` enum('PENDING','SUCCESS','FAILED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `reason` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gateway_refund_id` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `callback_data` text COLLATE utf8mb4_general_ci,
  `refunded_at` datetime DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `display_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `code`, `display_name`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin', '2025-09-12 17:35:25.000000', '2025-09-12 17:35:25.000000'),
(2, 'user', 'user', '2025-09-12 17:35:47.000000', '2025-09-12 17:35:47.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `settings`
--

CREATE TABLE `settings` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `type` enum('public','private_link') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'public',
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `settings`
--

INSERT INTO `settings` (`id`, `event_id`, `type`, `link`, `created_at`, `updated_at`) VALUES
(1, 2, 'public', 'http://localhost:3001/chung-tay-thuc-hien-muc-tieu-quoc-gia-2', '2025-09-03 10:18:43.353095', '2025-09-08 13:50:09.990344'),
(2, 3, 'public', 'http://localhost:3001/em-xinh-say-hi-concert-dem-1-3', '2025-09-03 10:18:43.353095', '2025-09-08 13:50:13.321098'),
(4, 15, 'public', 'http://localhost:3001/trien-lam-quoc-te-15', '2025-09-17 13:39:27.000000', '2025-09-17 13:39:27.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shows`
--

CREATE TABLE `shows` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `time_start` timestamp NOT NULL,
  `time_end` timestamp NULL DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `is_free` tinyint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shows`
--

INSERT INTO `shows` (`id`, `event_id`, `time_start`, `time_end`, `created_at`, `updated_at`, `is_free`) VALUES
(1, 2, '2025-09-30 07:37:00', '2025-08-31 08:00:00', '2025-08-28 17:51:30.409562', '2025-09-10 15:28:58.129830', NULL),
(2, 3, '2025-09-30 02:20:10', '2025-08-31 03:00:00', '2025-08-28 17:51:30.409562', '2025-09-08 14:02:12.390757', NULL),
(3, 2, '2025-09-30 07:37:00', '2025-09-30 08:00:00', '2025-08-28 17:51:30.409562', '2025-09-08 14:02:29.985681', NULL),
(4, 15, '2025-09-30 06:35:09', '2025-10-15 06:35:09', '2025-09-17 13:35:09.000000', '2025-09-17 14:59:11.505977', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tickets`
--

CREATE TABLE `tickets` (
  `id` int NOT NULL,
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_ticket` int NOT NULL,
  `min_ticket` int NOT NULL DEFAULT '1',
  `max_ticket` int NOT NULL DEFAULT '10',
  `show_id` int NOT NULL,
  `description` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `thumbnail` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_free` tinyint DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `remaining_ticket` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tickets`
--

INSERT INTO `tickets` (`id`, `name`, `price`, `total_ticket`, `min_ticket`, `max_ticket`, `show_id`, `description`, `thumbnail`, `is_free`, `created_at`, `updated_at`, `remaining_ticket`) VALUES
(1, 'vé thường', '500000.00', 100, 1, 10, 1, 'abcxyz', NULL, 0, '2025-09-03 10:18:43.196413', '2025-09-17 13:39:09.214764', 98),
(2, 'vé vip', '1000000.00', 100, 1, 10, 1, 'abcxyz', NULL, 0, '2025-09-03 10:18:43.196413', '2025-09-17 13:39:07.122195', 100),
(16, 'yuilyui', '200000.00', 100, 1, 10, 2, 'jklu6tl', NULL, 0, '2025-09-03 10:18:43.196413', '2025-09-17 17:15:22.000000', 90),
(21, 'vé thường', '300000.00', 100, 1, 10, 3, 'dfkjd', NULL, 0, '2025-09-03 10:18:43.196413', '2025-09-17 13:39:01.331332', 100),
(22, 'vé víp', '700000.00', 100, 1, 10, 3, 'gnbdfnfg', NULL, 0, '2025-09-03 10:18:43.196413', '2025-09-17 13:39:03.188735', 100),
(23, 'Vé tham quan', '0.00', 100, 1, 1, 4, 'Miễn phí tham dự/Free to attend\\nBạn cần đăng ký tham quan tại link để nhận QR code vào cổng: https://tinyurl.com/dangkygeimsvm', NULL, 1, '2025-09-17 13:35:45.000000', '2025-09-17 16:08:34.000000', 94);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `slug` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_active` tinyint NOT NULL DEFAULT '1',
  `gender` enum('male','female','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `phone`, `slug`, `password`, `is_active`, `gender`, `date_of_birth`, `role_id`, `created_at`, `updated_at`) VALUES
(1, 'nguyenmanhsam', 'bosamday1@gmail.com', '0123456789', 'nguyen-manh-sam', '123456', 1, 'male', '2004-06-02', 2, '2025-09-03 10:18:47.303264', '2025-09-15 09:26:54.937688'),
(2, 'sam', 'sam@gmail.com', '02413754641', NULL, '$2b$10$yY5F8kuGFlmFFq5E4QWKQOttPhegWiSj7CHtpe3tCfmG6dljp9.S2', 1, NULL, NULL, 2, '2025-09-15 09:27:17.038832', '2025-09-15 15:47:05.643215');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_role_permissions`
--

CREATE TABLE `user_role_permissions` (
  `permission_id` int NOT NULL,
  `role_id` int NOT NULL,
  `id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_2ec1c94a977b940d85a4f498aea` (`user_id`),
  ADD KEY `FK_c9f99492db92939a4cdb5bebf8d` (`event_id`),
  ADD KEY `FK_37b6d5084af67016dee91d65e06` (`show_id`);

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_6385a745d9e12a89b859bb25623` (`cart_id`),
  ADD KEY `FK_5e376a5f260c3e9e0a333248a16` (`ticket_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_420d9f679d41281f282f5bc7d0` (`slug`);

--
-- Chỉ mục cho bảng `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_05bd884c03d3f424e2204bd14c` (`slug`),
  ADD KEY `FK_643188b30e049632f80367be4e1` (`category_id`),
  ADD KEY `FK_1a259861a2ce114f074b366eed2` (`created_by`);

--
-- Chỉ mục cho bảng `event_memberships`
--
ALTER TABLE `event_memberships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_02ef511b12992ff3a969b3905d0` (`user_id`),
  ADD KEY `FK_dd855a362bfd8662c1fb4aa5380` (`event_id`),
  ADD KEY `FK_318aabc5dbc74da9c8600f7737e` (`event_role_id`);

--
-- Chỉ mục cho bảng `event_roles`
--
ALTER TABLE `event_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_3917871d332634bb3b0e62ff99` (`code`),
  ADD UNIQUE KEY `IDX_9e0cdc4e699fcc0612b1a12166` (`display_name`);

--
-- Chỉ mục cho bảng `event_role_permissions`
--
ALTER TABLE `event_role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_e8d4deb508773852aee561337c9` (`event_role_id`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_a922b820eeef29ac1c6800e826a` (`user_id`),
  ADD KEY `FK_642ca308ac51fea8327e593b8ab` (`event_id`),
  ADD KEY `FK_6953fcc11506ee6c4f04b396687` (`payment_status_id`),
  ADD KEY `FK_3949719bfa5537f96926f37a20e` (`show_id`),
  ADD KEY `FK_7819f136440d4ae83b20f0267a9` (`payment_method_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_145532db85752b29c57d2b7b1f1` (`order_id`),
  ADD KEY `FK_14d6d26343634ee91fb9cf486ba` (`ticket_id`);

--
-- Chỉ mục cho bảng `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `payment_status`
--
ALTER TABLE `payment_status`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_77fab0556decc83a81a5bf8c25d` (`user_id`);

--
-- Chỉ mục cho bảng `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_a22f91f82ebcd348b232bcc607` (`route_code`);

--
-- Chỉ mục cho bảng `refund_transactions`
--
ALTER TABLE `refund_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_c31e72dd3b33c5797c61125305` (`payment_transaction_id`),
  ADD KEY `FK_03f69ff260c2dee08d1f6eab53f` (`user_id`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_d4001cbeef50f7c8a4344fdfbb5` (`event_id`);

--
-- Chỉ mục cho bảng `shows`
--
ALTER TABLE `shows`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_c666928e39f01d397b1213021be` (`event_id`);

--
-- Chỉ mục cho bảng `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_81fa3650935b12f80f7968fd0cf` (`show_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`),
  ADD UNIQUE KEY `IDX_bc0c27d77ee64f0a097a5c269b` (`slug`);

--
-- Chỉ mục cho bảng `user_role_permissions`
--
ALTER TABLE `user_role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_3eb2fe2bf4c1d096d224bfe8e4d` (`role_id`),
  ADD KEY `FK_8b96e1d08d00d10f645b8d2f952` (`permission_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `event_memberships`
--
ALTER TABLE `event_memberships`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `event_roles`
--
ALTER TABLE `event_roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `event_role_permissions`
--
ALTER TABLE `event_role_permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT cho bảng `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `payment_status`
--
ALTER TABLE `payment_status`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `payment_transactions`
--
ALTER TABLE `payment_transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `refund_transactions`
--
ALTER TABLE `refund_transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `shows`
--
ALTER TABLE `shows`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `user_role_permissions`
--
ALTER TABLE `user_role_permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `FK_2ec1c94a977b940d85a4f498aea` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK_37b6d5084af67016dee91d65e06` FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`),
  ADD CONSTRAINT `FK_c9f99492db92939a4cdb5bebf8d` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);

--
-- Các ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `FK_5e376a5f260c3e9e0a333248a16` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`),
  ADD CONSTRAINT `FK_6385a745d9e12a89b859bb25623` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`);

--
-- Các ràng buộc cho bảng `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `FK_1a259861a2ce114f074b366eed2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK_643188b30e049632f80367be4e1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Các ràng buộc cho bảng `event_memberships`
--
ALTER TABLE `event_memberships`
  ADD CONSTRAINT `FK_02ef511b12992ff3a969b3905d0` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK_318aabc5dbc74da9c8600f7737e` FOREIGN KEY (`event_role_id`) REFERENCES `event_roles` (`id`),
  ADD CONSTRAINT `FK_dd855a362bfd8662c1fb4aa5380` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);

--
-- Các ràng buộc cho bảng `event_role_permissions`
--
ALTER TABLE `event_role_permissions`
  ADD CONSTRAINT `FK_e8d4deb508773852aee561337c9` FOREIGN KEY (`event_role_id`) REFERENCES `event_roles` (`id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK_3949719bfa5537f96926f37a20e` FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`),
  ADD CONSTRAINT `FK_642ca308ac51fea8327e593b8ab` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  ADD CONSTRAINT `FK_6953fcc11506ee6c4f04b396687` FOREIGN KEY (`payment_status_id`) REFERENCES `payment_status` (`id`),
  ADD CONSTRAINT `FK_7819f136440d4ae83b20f0267a9` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  ADD CONSTRAINT `FK_a922b820eeef29ac1c6800e826a` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FK_145532db85752b29c57d2b7b1f1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `FK_14d6d26343634ee91fb9cf486ba` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`);

--
-- Các ràng buộc cho bảng `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD CONSTRAINT `FK_77fab0556decc83a81a5bf8c25d` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `refund_transactions`
--
ALTER TABLE `refund_transactions`
  ADD CONSTRAINT `FK_03f69ff260c2dee08d1f6eab53f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK_c31e72dd3b33c5797c611253051` FOREIGN KEY (`payment_transaction_id`) REFERENCES `payment_transactions` (`id`);

--
-- Các ràng buộc cho bảng `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `FK_d4001cbeef50f7c8a4344fdfbb5` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);

--
-- Các ràng buộc cho bảng `shows`
--
ALTER TABLE `shows`
  ADD CONSTRAINT `FK_c666928e39f01d397b1213021be` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);

--
-- Các ràng buộc cho bảng `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `FK_81fa3650935b12f80f7968fd0cf` FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`);

--
-- Các ràng buộc cho bảng `user_role_permissions`
--
ALTER TABLE `user_role_permissions`
  ADD CONSTRAINT `FK_3eb2fe2bf4c1d096d224bfe8e4d` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_8b96e1d08d00d10f645b8d2f952` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
