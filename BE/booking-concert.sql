-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 02, 2025 lúc 12:17 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `booking-concert`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `slug` varchar(50) NOT NULL,
  `name` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `created_at`, `updated_at`, `slug`, `name`) VALUES
(1, '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', 'hahaha', 'hahaha'),
(2, '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', 'abc', 'abc'),
(3, '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', 'nnnn', 'nnnn');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `name` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `thumbnail` varchar(250) DEFAULT NULL,
  `banner` varchar(250) DEFAULT NULL,
  `slug` varchar(50) NOT NULL,
  `type` enum('offline','online') NOT NULL,
  `status` enum('draft','pending','approved','rejected') NOT NULL DEFAULT 'draft',
  `name_address` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `org_name` varchar(255) DEFAULT NULL,
  `org_description` varchar(255) DEFAULT NULL,
  `org_thumbnail` varchar(255) DEFAULT NULL,
  `venue_type` enum('indoor','outdoor') NOT NULL DEFAULT 'outdoor',
  `is_special` tinyint(4) NOT NULL DEFAULT 0,
  `is_trending` tinyint(4) NOT NULL DEFAULT 0,
  `videoUrl` varchar(250) DEFAULT NULL,
  `is_free` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `events`
--

INSERT INTO `events` (`id`, `created_at`, `updated_at`, `name`, `description`, `thumbnail`, `banner`, `slug`, `type`, `status`, `name_address`, `province`, `district`, `ward`, `street`, `category_id`, `created_by`, `org_name`, `org_description`, `org_thumbnail`, `venue_type`, `is_special`, `is_trending`, `videoUrl`, `is_free`) VALUES
(7, '2025-09-08 10:02:34.912597', '2025-09-08 10:03:56.000000', 'fasdfas', '<p>dffas</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757300551/ticket-box/elkezqjcc4ibb6rxeimj.png', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757300551/ticket-box/ihewr3mjwexdgptqjm9x.png', 'fasdfas-1757300554909', 'offline', 'pending', 'dfsdaf', 'Tỉnh Hoà Bình', 'Huyện Đà Bắc', 'Xã Cao Sơn', 'fsf', 1, 1, 'dsfds', 'fdsaf', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757300551/ticket-box/vhsfhmt9quxlnzxjiywi.png', 'outdoor', 0, 0, NULL, NULL),
(8, '2025-09-12 09:29:19.626562', '2025-09-12 09:30:30.000000', 'vcxfcbbvs', '<p>sfsadf</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757644157/ticket-box/pckqoxavd2dav1fzdxxb.png', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757644156/ticket-box/lysmh3cyfsltkogsxcmx.png', 'vcxfcbbvs-1757644159616', 'offline', 'pending', 'sdfsdfs', 'Tỉnh Hoà Bình', 'Huyện Kỳ Sơn', 'Xã Mông Hóa', 'fsdagfdssda', 2, 1, 'sfsd', 'fsdf', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757644156/ticket-box/iwt3ael9v3yqyl3yeton.png', 'outdoor', 0, 0, NULL, NULL),
(9, '2025-09-12 09:41:25.030154', '2025-09-12 09:41:25.030154', 'fsdfs', '<p>sdfsd</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757644881/ticket-box/j4zbfxftke3eev0p3vzt.png', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757644882/ticket-box/rsje1owrjkmlwzkyra8s.png', 'fsdfs-1757644885026', 'offline', 'draft', 'dfs', 'Thành phố Cần Thơ', 'Quận Bình Thuỷ', 'Phường Trà Nóc', 'wesdafsadfsa', 2, 1, 'dsfsd', 'dsfsdf', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757644881/ticket-box/odjvsijar5oinnvqifyr.png', 'outdoor', 0, 0, NULL, NULL),
(10, '2025-09-12 09:56:19.435671', '2025-09-12 09:56:19.435671', 'dfsdf', '<p>fsdfsd</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757645775/ticket-box/zt0mynbbjtdovizf5pl2.png', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757645776/ticket-box/zaxno6t70ua3pednxlwh.png', 'dfsdf-1757645779432', 'offline', 'draft', 'sdfsd', 'Tỉnh Thái Nguyên', 'Thành phố Sông Công', 'Xã Tân Quang', 'sdfsdaf', 2, 1, 'dfsf', 'sdfsf', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757645775/ticket-box/nxldhlnjhyuw61ovrajo.png', 'outdoor', 0, 0, NULL, NULL),
(11, '2025-09-12 09:59:28.629648', '2025-09-12 10:06:43.000000', 'sdfsd', '<p>sfsf</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757646395/ticket-box/jd0unrnbrqfmnhqqj6kw.png', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757646397/ticket-box/dvbifwllecm5g76dzeou.png', 'sdfsd-1757645968620', 'offline', 'pending', 'fsd', 'Tỉnh Yên Bái', 'Thị xã Nghĩa Lộ', 'Phường Trung Tâm', 'dsfsd', 2, 1, 'sfs', 'fsdf', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757646396/ticket-box/tbb99qd0tqzpd0rdgeo1.png', 'outdoor', 0, 0, NULL, NULL),
(12, '2025-09-12 17:36:07.492905', '2025-09-12 17:36:37.000000', 'fdasf', '<p>dfsdf</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757673366/ticket-box/b7e5vfmwk1zqrklzff9b.png', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757673366/ticket-box/hubsetpkinahjho01yot.png', 'fdasf-1757673367484', 'offline', 'pending', 'sdfsa', 'Tỉnh Hoà Bình', 'Huyện Kỳ Sơn', 'Xã Hợp Thành', 'sfsdf', 2, 1, 'sfs', 'sfsf', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757673366/ticket-box/hqct6rat7fzzdvns2m4q.png', 'outdoor', 0, 0, NULL, NULL),
(13, '2025-09-15 11:20:44.383429', '2025-09-15 11:22:03.000000', 'dsfsdfs', '<p>sdfs</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757910039/ticket-box/n3ofa3mgwvrwf02wncln.webp', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757910041/ticket-box/enzribig4fko2dpkly34.png', 'dsfsdfs-1757910044376', 'offline', 'pending', 'dsfsd', 'Tỉnh Thái Nguyên', 'Huyện Định Hóa', 'Xã Thanh Định', 'sfsfsadfsafsaas', 2, 1, 'dsfasf', 'àafdsfs', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757910039/ticket-box/ctvnv3gqtcyt7bpobrn8.png', 'outdoor', 0, 0, NULL, NULL),
(14, '2025-09-16 09:52:34.288863', '2025-09-16 09:52:34.288863', 'sadfdsaf', '<p>đấ</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757991152/ticket-box/uwxuyjwfkyvltsvgbmag.png', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757991152/ticket-box/w7abhtyfawlzuks8k23d.png', 'sadfdsaf-1757991154277', 'offline', 'draft', 'fsad', 'Tỉnh Hoà Bình', 'Huyện Tân Lạc', 'Xã Ngọc Mỹ', 'dfadas', 2, 1, 'sfsda', 'sấ', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1757991152/ticket-box/a0fo0rbueqwo6qq29erc.png', 'outdoor', 0, 0, NULL, NULL),
(15, '2025-09-16 09:55:44.287802', '2025-09-16 13:25:49.000000', 'fsdfdsa', '<p>dfsd</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758003941/ticket-box/lku2c5jljtkg9tful0vo.png', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758003943/ticket-box/ay5kwzgwvvw0i54eop6u.png', 'fsdfdsa-1757991344280', 'offline', 'pending', 'sfsd', 'Tỉnh Hoà Bình', 'Huyện Yên Thủy', 'Xã Yên Lạc', 'sfsdfsadsfsd', 2, 1, 'dfsd', 'fs', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758003941/ticket-box/fcwvsfcus7my8cnb1mtf.png', 'outdoor', 0, 0, NULL, NULL),
(16, '2025-09-16 14:21:34.551913', '2025-09-16 14:23:02.000000', 'sdfsdfsda', '<p>fsdfsafasfadsfsddsdsddsfds</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758007295/ticket-box/hs0ood4imdjm0va7xav6.webp', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758007297/ticket-box/yqvk7k5kppvomza6ldcq.png', 'sdfsdfsda-1758007294543', 'offline', 'pending', 'sdfsd', 'Tỉnh Sơn La', 'Huyện Yên Châu', 'Xã Tú Nang', 'fdsfafafafasdf', 3, 1, 'fsfadacasaczfadddf', 'dsfsdfad', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758007298/ticket-box/qoztayc27otsky4391c3.png', 'outdoor', 0, 0, NULL, NULL),
(17, '2025-09-18 14:58:24.519489', '2025-09-18 14:58:24.519489', 'sdfdsa', '<p>dsfsdfsd</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758182303/ticket-box/wcdsttoqxsanxhspgan7.png', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758182303/ticket-box/fg9wxztvu0g1jnevz1o9.png', 'sdfdsa-1758182304517', 'offline', 'draft', 'dsfasd', 'Tỉnh Lai Châu', 'Huyện Mường Tè', 'Xã Tà Tổng', 'dfsdf', 2, 1, 'fsdfsd', 'sdfsd', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758182303/ticket-box/qb7b5r0oxwsfpojaarci.png', 'outdoor', 0, 0, NULL, NULL),
(18, '2025-09-18 15:00:15.965610', '2025-09-18 15:03:46.000000', 'sdfsda', '<p>sdfs</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758182623/ticket-box/sqliokrlm1tbvgkikzcs.png', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758182625/ticket-box/qo9e7cfqwpt4zcr9dob5.png', 'sdfsda-1758182415963', 'offline', 'draft', 'fdsafs', 'Tỉnh Yên Bái', 'Thị xã Nghĩa Lộ', 'Phường Pú Trạng', 'fdsfs', 1, 1, 'dsfs', 'fdsfs', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758182623/ticket-box/pbgjzibz85qqqb4hz22g.png', 'outdoor', 0, 0, NULL, NULL),
(19, '2025-09-18 15:11:19.080439', '2025-09-18 15:25:47.000000', 'clm', '<p>gdfsg</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758183944/ticket-box/uejdsljfw5szzmme118q.png', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758183946/ticket-box/cdxfthukb6p63vsrkonb.png', 'dgdfgds-1758183079077', 'offline', 'draft', 'fgdsfg', 'Tỉnh Thái Nguyên', 'Thành phố Thái Nguyên', 'Phường Phú Xá', 'gdfgfsd', 2, 1, 'fgdsf', 'sdfgsd', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758183944/ticket-box/i2gnytdyvx1zzcav2z7j.png', 'outdoor', 0, 0, NULL, NULL),
(20, '2025-09-18 15:11:22.470146', '2025-09-18 15:11:22.470146', 'dgdfgds', '<p>gdfsg</p>', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758183078/ticket-box/agq1zlrgci2xxqrq1gez.png', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758183081/ticket-box/mw9nlyvfps3pgtte78iw.png', 'dgdfgds-1758183082469', 'offline', 'draft', 'fgdsfg', 'Tỉnh Thái Nguyên', 'Thành phố Thái Nguyên', 'Phường Phú Xá', 'gdfgfsd', 2, 1, 'fgdsf', 'sdfgsd', 'https://res.cloudinary.com/dnczc3gzn/image/upload/v1758183079/ticket-box/wntsk1erhvvtly0y66sd.png', 'outdoor', 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_memberships`
--

CREATE TABLE `event_memberships` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `event_role_id` int(11) NOT NULL,
  `joined_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_roles`
--

CREATE TABLE `event_roles` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `code` varchar(50) NOT NULL,
  `display_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_role_permissions`
--

CREATE TABLE `event_role_permissions` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `event_role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
(1, 1757066987824, 'Abc1757066987824');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `order_number` varchar(30) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `status` enum('pending','paid','confirmed','cancelled','expired','refunded','failed') NOT NULL DEFAULT 'pending',
  `total_amount` decimal(12,2) NOT NULL,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `final_amount` decimal(12,2) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `idempotency_key` varchar(255) DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `created_at`, `updated_at`, `order_number`, `user_id`, `event_id`, `phone`, `status`, `total_amount`, `discount_amount`, `final_amount`, `email`, `province`, `district`, `ward`, `street`, `address`, `note`, `idempotency_key`, `expires_at`) VALUES
(1, '2025-09-19 14:21:16.658000', '2025-09-19 14:22:02.685000', 'ORD1758266451893978', 1, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-19 07:25:51'),
(2, '2025-09-19 14:23:25.167000', '2025-09-19 14:25:26.956000', 'ORD1758266599291991', 1, 13, NULL, 'failed', 1080000.00, 0.00, 1080000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-19 07:28:19'),
(3, '2025-09-19 14:36:49.166000', '2025-09-19 14:37:34.822000', 'ORD1758267404696167', 1, 13, NULL, 'paid', 1080000.00, 0.00, 1080000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-19 07:41:44'),
(4, '2025-09-19 14:38:33.714000', '2025-09-19 14:39:37.732000', 'ORD1758267505351026', 1, 13, NULL, 'paid', 2040000.00, 0.00, 2040000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-19 07:43:25'),
(5, '2025-09-19 14:44:51.676000', '2025-09-19 14:44:51.676000', 'ORD1758267887168910', 1, 13, NULL, 'pending', 2040000.00, 0.00, 2040000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-19 07:49:47'),
(6, '2025-09-19 14:54:53.643000', '2025-09-19 14:55:57.637000', 'ORD1758268489713885', 1, 13, NULL, 'paid', 2120000.00, 0.00, 2120000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-19 07:59:49'),
(7, '2025-09-19 15:07:20.851000', '2025-09-19 15:08:40.397000', 'ORD1758269237153976', 1, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-19 08:12:17'),
(8, '2025-09-19 15:46:48.038000', '2025-09-19 15:46:48.038000', 'ORD1758271564518865', 1, 13, NULL, 'pending', 2040000.00, 0.00, 2040000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-19 08:51:04'),
(9, '2025-09-19 16:21:53.158000', '2025-09-19 16:21:53.158000', 'ORD1758273700986786', 1, 13, NULL, 'pending', 2080000.00, 0.00, 2080000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-19 09:26:40'),
(10, '2025-09-19 16:22:36.207000', '2025-09-19 16:22:36.207000', 'ORD1758273751854189', 1, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-19 09:27:31'),
(11, '2025-09-19 16:57:18.823000', '2025-09-19 16:57:18.823000', 'ORD1758275830918485', 1, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-19 10:02:10'),
(12, '2025-09-19 17:17:41.735000', '2025-09-19 17:19:14.737000', 'ORD1758277054904102', 1, 13, NULL, 'paid', 2040000.00, 0.00, 2040000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-19 10:22:34'),
(13, '2025-09-23 13:40:27.933000', '2025-09-23 13:40:27.933000', 'ORD1758609609986647', 1, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-23 06:45:09'),
(14, '2025-09-23 13:45:17.743000', '2025-09-23 13:46:05.401000', 'ORD1758609913459634', 1, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'test@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-23 06:50:13'),
(15, '2025-09-24 10:10:54.963000', '2025-09-24 10:10:54.963000', 'ORD1758683447827736', 5, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'hoangganh28@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 03:15:47'),
(16, '2025-09-24 10:41:50.504000', '2025-09-24 10:42:44.936000', 'ORD1758685306593853', 5, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoangganh28@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 03:46:46'),
(17, '2025-09-24 10:47:56.595000', '2025-09-24 10:48:42.548000', 'ORD1758685672928294', 5, 13, NULL, 'paid', 40000.00, 0.00, 40000.00, 'hoangganh28@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 03:52:52'),
(18, '2025-09-24 10:49:34.740000', '2025-09-24 10:50:09.664000', 'ORD1758685771431651', 5, 13, NULL, 'paid', 1000000.00, 0.00, 1000000.00, 'hoangganh28@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 03:54:31'),
(19, '2025-09-24 11:01:16.637000', '2025-09-24 11:02:02.221000', 'ORD1758686471937841', 6, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 04:06:11'),
(20, '2025-09-24 13:32:20.961000', '2025-09-24 13:33:44.673000', 'ORD1758695536877941', 6, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 06:37:16'),
(21, '2025-09-24 13:45:36.891000', '2025-09-24 13:46:37.991000', 'ORD1758696332750566', 6, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 06:50:32'),
(22, '2025-09-24 13:48:13.268000', '2025-09-24 13:48:52.605000', 'ORD1758696489182980', 6, 13, NULL, 'paid', 40000.00, 0.00, 40000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 06:53:09'),
(23, '2025-09-24 13:58:58.250000', '2025-09-24 13:59:56.107000', 'ORD1758697128625335', 6, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 07:03:48'),
(24, '2025-09-24 14:01:09.204000', '2025-09-24 14:01:43.185000', 'ORD1758697262198406', 6, 13, NULL, 'failed', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 07:06:02'),
(25, '2025-09-24 14:29:56.618000', '2025-09-24 14:31:03.808000', 'ORD1758698993154871', 6, 13, NULL, 'failed', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 07:34:53'),
(26, '2025-09-24 14:32:32.465000', '2025-09-24 14:33:16.679000', 'ORD1758699145617121', 6, 13, NULL, 'failed', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 07:37:25'),
(27, '2025-09-24 14:40:23.671000', '2025-09-24 14:40:49.230000', 'ORD1758699619895133', 6, 13, NULL, 'failed', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 07:45:19'),
(28, '2025-09-24 14:42:57.747000', '2025-09-24 14:42:57.747000', 'ORD1758699773912653', 6, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 07:47:53'),
(29, '2025-09-24 14:44:14.201000', '2025-09-24 14:44:43.735000', 'ORD1758699850508705', 6, 13, NULL, 'failed', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 07:49:10'),
(30, '2025-09-24 14:45:38.242000', '2025-09-24 14:46:14.907000', 'ORD1758699934100473', 6, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 07:50:34'),
(31, '2025-09-24 14:48:30.167000', '2025-09-24 14:48:54.499000', 'ORD1758700106901400', 6, 13, NULL, 'failed', 40000.00, 0.00, 40000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 07:53:26'),
(32, '2025-09-24 14:51:01.540000', '2025-09-24 14:51:34.853000', 'ORD1758700258202004', 6, 13, NULL, 'failed', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 07:55:58'),
(33, '2025-09-24 14:53:05.403000', '2025-09-24 14:53:32.714000', 'ORD1758700381323921', 6, 13, NULL, 'failed', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 07:58:01'),
(34, '2025-09-24 14:59:53.516000', '2025-09-24 14:59:53.516000', 'ORD1758700788487069', 6, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 08:04:48'),
(35, '2025-09-24 15:53:25.483000', '2025-09-24 15:53:25.483000', 'ORD1758704002150644', 6, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 08:58:22'),
(36, '2025-09-24 16:14:00.982000', '2025-09-24 16:14:00.982000', 'ORD1758705236758368', 6, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 09:18:56'),
(37, '2025-09-24 17:21:44.764000', '2025-09-24 17:21:44.764000', 'ORD1758709299939404', 6, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 10:26:39'),
(38, '2025-09-24 17:30:14.408000', '2025-09-24 17:30:14.408000', 'ORD1758709811053262', 6, 13, NULL, 'pending', 1000000.00, 0.00, 1000000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 10:35:11'),
(43, '2025-09-24 17:35:56.741000', '2025-09-24 17:35:56.741000', 'ORD1758710151216025', 6, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 10:40:51'),
(44, '2025-09-24 17:38:11.717000', '2025-09-24 17:38:57.001000', 'ORD1758710285719872', 6, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 10:43:05'),
(45, '2025-09-24 17:39:27.853000', '2025-09-24 17:40:39.824000', 'ORD1758710364093326', 6, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 10:44:24'),
(46, '2025-09-26 10:22:36.897000', '2025-09-26 10:22:36.897000', 'ORD1758856950331404', 6, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 03:27:30'),
(47, '2025-09-26 10:41:29.046000', '2025-09-26 10:41:29.046000', 'ORD1758858084523537', 6, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 03:46:24'),
(48, '2025-09-26 10:52:56.817000', '2025-09-26 10:52:56.817000', 'ORD1758858771463689', 6, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 03:57:51'),
(49, '2025-09-26 10:55:21.974000', '2025-09-26 10:55:21.974000', 'ORD1758858918160935', 6, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 04:00:18'),
(50, '2025-09-26 10:56:07.914000', '2025-09-26 10:56:07.914000', 'ORD1758858963368553', 6, 13, NULL, 'pending', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 04:01:03'),
(51, '2025-09-26 11:12:36.355000', '2025-09-26 11:13:29.923000', 'ORD1758859952953110', 6, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 04:17:32'),
(52, '2025-09-26 11:14:18.862000', '2025-09-26 11:15:38.481000', 'ORD1758860051140434', 6, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 04:19:11'),
(53, '2025-09-26 11:18:17.985000', '2025-09-26 11:19:00.557000', 'ORD1758860291444914', 6, 13, NULL, 'paid', 80000.00, 0.00, 80000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 04:23:11'),
(54, '2025-09-26 11:21:04.056000', '2025-09-26 11:25:39.390000', 'ORD1758860461071765', 6, 13, NULL, 'paid', 2160000.00, 0.00, 2160000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 04:26:01'),
(55, '2025-09-26 11:49:41.823000', '2025-09-26 11:52:32.443000', 'ORD1758862063742525', 6, 13, NULL, 'failed', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 04:52:43'),
(56, '2025-09-26 13:14:34.987000', '2025-09-26 13:21:59.588000', 'ORD1758867237458817', 6, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 06:18:57'),
(57, '2025-09-26 17:19:58.189000', '2025-09-26 17:22:04.868000', 'ORD1758881986680011', 6, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 10:24:46'),
(58, '2025-09-26 17:23:39.290000', '2025-09-26 17:24:24.545000', 'ORD1758882215279267', 6, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 10:28:35'),
(59, '2025-09-26 17:25:02.808000', '2025-09-26 17:26:12.704000', 'ORD1758882298968279', 6, 13, NULL, 'failed', 200000.00, 0.00, 200000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 10:29:58'),
(60, '2025-09-26 17:44:31.904000', '2025-09-26 17:45:25.516000', 'ORD1758883466285733', 6, 13, NULL, 'paid', 1040000.00, 0.00, 1040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 10:49:26'),
(61, '2025-09-26 17:47:55.118000', '2025-09-26 17:48:30.387000', 'ORD1758883668565865', 6, 13, NULL, 'failed', 6040000.00, 0.00, 6040000.00, 'hoanganh52521352@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 10:52:48');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `show_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `final_price` decimal(12,2) NOT NULL,
  `special_requests` varchar(255) DEFAULT NULL,
  `seat_id` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `ticket_id`, `show_id`, `quantity`, `unit_price`, `total_price`, `discount_amount`, `final_price`, `special_requests`, `seat_id`, `created_at`, `updated_at`) VALUES
(1, 43, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-24 17:35:56.757000', '2025-09-24 17:35:56.757000'),
(2, 43, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-24 17:35:56.770000', '2025-09-24 17:35:56.770000'),
(3, 44, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-24 17:38:11.730000', '2025-09-24 17:38:11.730000'),
(4, 44, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-24 17:38:11.740000', '2025-09-24 17:38:11.740000'),
(5, 45, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-24 17:39:27.860000', '2025-09-24 17:39:27.860000'),
(6, 45, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-24 17:39:27.876000', '2025-09-24 17:39:27.876000'),
(7, 46, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-26 10:22:36.915000', '2025-09-26 10:22:36.915000'),
(8, 46, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-26 10:22:36.920000', '2025-09-26 10:22:36.920000'),
(9, 47, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-26 10:41:29.057000', '2025-09-26 10:41:29.057000'),
(10, 47, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-26 10:41:29.066000', '2025-09-26 10:41:29.066000'),
(11, 48, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-26 10:52:56.834000', '2025-09-26 10:52:56.834000'),
(12, 48, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-26 10:52:56.847000', '2025-09-26 10:52:56.847000'),
(13, 49, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-26 10:55:21.978000', '2025-09-26 10:55:21.978000'),
(14, 49, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-26 10:55:21.984000', '2025-09-26 10:55:21.984000'),
(15, 50, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-26 10:56:07.917000', '2025-09-26 10:56:07.917000'),
(16, 50, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-26 10:56:07.920000', '2025-09-26 10:56:07.920000'),
(17, 51, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-26 11:12:36.372000', '2025-09-26 11:12:36.372000'),
(18, 51, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-26 11:12:36.380000', '2025-09-26 11:12:36.380000'),
(19, 52, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-26 11:14:18.866000', '2025-09-26 11:14:18.866000'),
(20, 52, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-26 11:14:18.873000', '2025-09-26 11:14:18.873000'),
(21, 53, 8, 6, 2, 40000.00, 80000.00, 0.00, 80000.00, NULL, NULL, '2025-09-26 11:18:17.995000', '2025-09-26 11:18:17.995000'),
(22, 54, 8, 6, 4, 40000.00, 160000.00, 0.00, 160000.00, NULL, NULL, '2025-09-26 11:21:04.058000', '2025-09-26 11:21:04.058000'),
(23, 54, 9, 6, 2, 1000000.00, 2000000.00, 0.00, 2000000.00, NULL, NULL, '2025-09-26 11:21:04.061000', '2025-09-26 11:21:04.061000'),
(24, 55, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-26 11:49:41.826000', '2025-09-26 11:49:41.826000'),
(25, 55, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-26 11:49:41.838000', '2025-09-26 11:49:41.838000'),
(26, 56, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-26 13:14:34.995000', '2025-09-26 13:14:34.995000'),
(27, 56, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-26 13:14:35.002000', '2025-09-26 13:14:35.002000'),
(28, 57, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-26 17:19:58.198000', '2025-09-26 17:19:58.198000'),
(29, 57, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-26 17:19:58.203000', '2025-09-26 17:19:58.203000'),
(30, 58, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-26 17:23:39.295000', '2025-09-26 17:23:39.295000'),
(31, 58, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-26 17:23:39.299000', '2025-09-26 17:23:39.299000'),
(32, 59, 8, 6, 5, 40000.00, 200000.00, 0.00, 200000.00, NULL, NULL, '2025-09-26 17:25:02.814000', '2025-09-26 17:25:02.814000'),
(33, 60, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-26 17:44:31.909000', '2025-09-26 17:44:31.909000'),
(34, 60, 9, 6, 1, 1000000.00, 1000000.00, 0.00, 1000000.00, NULL, NULL, '2025-09-26 17:44:31.912000', '2025-09-26 17:44:31.912000'),
(35, 61, 8, 6, 1, 40000.00, 40000.00, 0.00, 40000.00, NULL, NULL, '2025-09-26 17:47:55.130000', '2025-09-26 17:47:55.130000'),
(36, 61, 9, 6, 6, 1000000.00, 6000000.00, 0.00, 6000000.00, NULL, NULL, '2025-09-26 17:47:55.139000', '2025-09-26 17:47:55.139000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'VND',
  `provider` varchar(40) NOT NULL,
  `method` enum('card','ewallet','bank_app','qr') NOT NULL,
  `status` enum('pending','succeeded','failed','cancelled','refunded','completed') NOT NULL DEFAULT 'pending',
  `transaction_id` varchar(100) DEFAULT NULL,
  `failure_msg` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payments`
--

INSERT INTO `payments` (`id`, `created_at`, `updated_at`, `user_id`, `order_id`, `amount`, `currency`, `provider`, `method`, `status`, `transaction_id`, `failure_msg`) VALUES
(1, '2025-09-19 14:21:16.684000', '2025-09-19 14:22:02.688000', 1, 1, 1040000.00, 'VND', 'momo', 'bank_app', '', '4579177331', ''),
(2, '2025-09-19 14:23:25.188000', '2025-09-19 14:25:26.957000', 1, 2, 1080000.00, 'VND', 'momo', 'bank_app', 'failed', '4578341894', ''),
(3, '2025-09-19 14:36:49.199000', '2025-09-19 14:37:34.825000', 1, 3, 1080000.00, 'VND', 'momo', 'bank_app', '', '4579178781', ''),
(4, '2025-09-19 14:38:33.761000', '2025-09-19 14:39:37.738000', 1, 4, 2040000.00, 'VND', 'momo', 'bank_app', '', '4578341952', ''),
(5, '2025-09-19 14:44:51.695000', '2025-09-19 14:44:51.695000', 1, 5, 2040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(6, '2025-09-19 14:54:53.667000', '2025-09-19 14:55:57.653000', 1, 6, 2120000.00, 'VND', 'momo', 'bank_app', '', '4579180683', ''),
(7, '2025-09-19 15:07:20.866000', '2025-09-19 15:08:40.399000', 1, 7, 1040000.00, 'VND', 'momo', 'bank_app', '', '4578342065', ''),
(8, '2025-09-19 15:46:48.071000', '2025-09-19 15:46:48.071000', 1, 8, 2040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(9, '2025-09-19 16:21:53.182000', '2025-09-19 16:21:53.182000', 1, 9, 2080000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(10, '2025-09-19 16:22:36.233000', '2025-09-19 16:22:36.233000', 1, 10, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(11, '2025-09-19 16:57:18.836000', '2025-09-19 16:57:18.836000', 1, 11, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(12, '2025-09-19 17:17:41.755000', '2025-09-19 17:19:14.747000', 1, 12, 2040000.00, 'VND', 'momo', 'bank_app', '', '4579357575', ''),
(13, '2025-09-23 13:40:27.959000', '2025-09-23 13:40:27.959000', 1, 13, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(14, '2025-09-23 13:45:17.769000', '2025-09-23 13:46:05.405000', 1, 14, 1040000.00, 'VND', 'momo', 'bank_app', '', '4580980645', ''),
(15, '2025-09-24 10:10:54.975000', '2025-09-24 10:10:54.975000', 5, 15, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(16, '2025-09-24 10:41:50.529000', '2025-09-24 10:42:44.943000', 5, 16, 1040000.00, 'VND', 'momo', 'bank_app', '', '4581431931', ''),
(17, '2025-09-24 10:47:56.619000', '2025-09-24 10:48:42.558000', 5, 17, 40000.00, 'VND', 'momo', 'bank_app', '', '4581472472', ''),
(18, '2025-09-24 10:49:34.750000', '2025-09-24 10:50:09.666000', 5, 18, 1000000.00, 'VND', 'momo', 'bank_app', '', '4581472510', ''),
(19, '2025-09-24 11:01:16.654000', '2025-09-24 11:02:02.224000', 6, 19, 1040000.00, 'VND', 'momo', 'bank_app', '', '4581472787', ''),
(20, '2025-09-24 13:32:20.978000', '2025-09-24 13:33:44.676000', 6, 20, 1040000.00, 'VND', 'momo', 'bank_app', '', '4581475327', ''),
(21, '2025-09-24 13:45:36.928000', '2025-09-24 13:46:37.998000', 6, 21, 1040000.00, 'VND', 'momo', 'bank_app', '', '4581435266', ''),
(22, '2025-09-24 13:48:13.277000', '2025-09-24 13:48:52.607000', 6, 22, 40000.00, 'VND', 'momo', 'bank_app', '', '4581905339', ''),
(23, '2025-09-24 13:58:58.274000', '2025-09-24 13:59:56.123000', 6, 23, 1040000.00, 'VND', 'momo', 'bank_app', '', '4581399224', ''),
(24, '2025-09-24 14:01:09.232000', '2025-09-24 14:01:43.189000', 6, 24, 1040000.00, 'VND', 'momo', 'bank_app', 'failed', '4581937492', ''),
(25, '2025-09-24 14:29:56.636000', '2025-09-24 14:31:03.815000', 6, 25, 1040000.00, 'VND', 'momo', 'bank_app', 'failed', '4581917987', ''),
(26, '2025-09-24 14:32:32.483000', '2025-09-24 14:33:16.709000', 6, 26, 1040000.00, 'VND', 'momo', 'bank_app', 'failed', '4581399350', ''),
(27, '2025-09-24 14:40:23.695000', '2025-09-24 14:40:49.238000', 6, 27, 1040000.00, 'VND', 'momo', 'bank_app', 'failed', '4581399368', ''),
(28, '2025-09-24 14:42:57.777000', '2025-09-24 14:42:57.777000', 6, 28, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(29, '2025-09-24 14:44:14.214000', '2025-09-24 14:44:43.767000', 6, 29, 1040000.00, 'VND', 'momo', 'bank_app', 'failed', '4581399381', ''),
(30, '2025-09-24 14:45:38.259000', '2025-09-24 14:46:14.914000', 6, 30, 1040000.00, 'VND', 'momo', 'bank_app', '', '4581978173', ''),
(31, '2025-09-24 14:48:30.194000', '2025-09-24 14:48:54.507000', 6, 31, 40000.00, 'VND', 'momo', 'bank_app', 'failed', '4581399403', ''),
(32, '2025-09-24 14:51:01.553000', '2025-09-24 14:51:34.855000', 6, 32, 1040000.00, 'VND', 'momo', 'bank_app', 'failed', '4581938331', ''),
(33, '2025-09-24 14:53:05.418000', '2025-09-24 14:53:32.717000', 6, 33, 1040000.00, 'VND', 'momo', 'bank_app', 'failed', '4581978309', ''),
(34, '2025-09-24 14:59:53.525000', '2025-09-24 14:59:53.525000', 6, 34, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(35, '2025-09-24 15:53:25.515000', '2025-09-24 15:53:25.515000', 6, 35, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(36, '2025-09-24 16:14:00.995000', '2025-09-24 16:14:00.995000', 6, 36, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(37, '2025-09-24 17:21:44.791000', '2025-09-24 17:21:44.791000', 6, 37, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(38, '2025-09-24 17:30:14.421000', '2025-09-24 17:30:14.421000', 6, 38, 1000000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(39, '2025-09-24 17:35:56.774000', '2025-09-24 17:35:56.774000', 6, 43, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(40, '2025-09-24 17:38:11.746000', '2025-09-24 17:38:57.010000', 6, 44, 1040000.00, 'VND', 'momo', 'bank_app', '', '4582134305', ''),
(41, '2025-09-24 17:39:27.885000', '2025-09-24 17:40:39.826000', 6, 45, 1040000.00, 'VND', 'momo', 'bank_app', '', '4582154104', ''),
(42, '2025-09-26 10:22:36.928000', '2025-09-26 10:22:36.928000', 6, 46, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(43, '2025-09-26 10:41:29.068000', '2025-09-26 10:41:29.068000', 6, 47, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(44, '2025-09-26 10:52:56.850000', '2025-09-26 10:52:56.850000', 6, 48, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(45, '2025-09-26 10:55:21.986000', '2025-09-26 10:55:21.986000', 6, 49, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(46, '2025-09-26 10:56:07.924000', '2025-09-26 10:56:07.924000', 6, 50, 1040000.00, 'VND', 'momo', 'bank_app', 'pending', '', ''),
(47, '2025-09-26 11:12:36.381000', '2025-09-26 11:13:29.929000', 6, 51, 1040000.00, 'VND', 'momo', 'bank_app', '', '4583223261', ''),
(48, '2025-09-26 11:14:18.875000', '2025-09-26 11:15:38.483000', 6, 52, 1040000.00, 'VND', 'momo', 'bank_app', '', '4583213688', ''),
(49, '2025-09-26 11:18:17.997000', '2025-09-26 11:19:00.595000', 6, 53, 80000.00, 'VND', 'momo', 'bank_app', '', '4583223887', ''),
(50, '2025-09-26 11:21:04.062000', '2025-09-26 11:25:39.393000', 6, 54, 2160000.00, 'VND', 'momo', 'card', '', '4583214721', ''),
(51, '2025-09-26 11:49:41.851000', '2025-09-26 11:52:32.444000', 6, 55, 1040000.00, 'VND', 'momo', 'bank_app', 'failed', '4583236850', ''),
(52, '2025-09-26 13:14:35.008000', '2025-09-26 13:21:59.589000', 6, 56, 1040000.00, 'VND', 'momo', 'bank_app', '', '4583266304', ''),
(53, '2025-09-26 17:19:58.204000', '2025-09-26 17:22:04.874000', 6, 57, 1040000.00, 'VND', 'momo', 'bank_app', '', '4583381160', ''),
(54, '2025-09-26 17:23:39.309000', '2025-09-26 17:24:24.551000', 6, 58, 1040000.00, 'VND', 'momo', 'bank_app', '', '4583371268', ''),
(55, '2025-09-26 17:25:02.816000', '2025-09-26 17:26:12.705000', 6, 59, 200000.00, 'VND', 'momo', 'bank_app', 'failed', '4583391060', ''),
(56, '2025-09-26 17:44:31.913000', '2025-09-26 17:45:25.519000', 6, 60, 1040000.00, 'VND', 'momo', 'bank_app', '', '4583383507', ''),
(57, '2025-09-26 17:47:55.142000', '2025-09-26 17:48:30.392000', 6, 61, 6040000.00, 'VND', 'momo', 'bank_app', 'failed', '4583374169', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_event`
--

CREATE TABLE `payment_event` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `event_id` int(11) NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `account_number` varchar(255) NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `local_branch` varchar(255) DEFAULT NULL,
  `business_type` enum('personal','company') NOT NULL DEFAULT 'personal'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_event`
--

INSERT INTO `payment_event` (`id`, `created_at`, `updated_at`, `event_id`, `account_name`, `account_number`, `bank_name`, `local_branch`, `business_type`) VALUES
(1, '2025-09-08 10:03:56.744200', '2025-09-12 10:05:54.892000', 7, 'fsd', 'dsfsd', 'sfsd', 'dsfs', 'company'),
(2, '2025-09-12 09:30:30.582759', '2025-09-12 10:07:30.062000', 8, 'fdsgfd', '123456789', 'BIDV', 'HaNoi', 'company'),
(3, '2025-09-12 10:01:01.493510', '2025-09-12 10:06:17.848000', 11, '', '', '', '', 'company'),
(4, '2025-09-12 17:36:37.930538', '2025-09-17 16:44:35.614000', 12, '', '', '', '', 'company'),
(5, '2025-09-15 11:22:03.919852', '2025-09-15 13:18:53.239000', 13, '', '', '', '', 'company'),
(6, '2025-09-16 13:25:49.186131', '2025-09-16 13:25:49.186131', 15, '', '', '', '', 'company'),
(7, '2025-09-16 14:23:02.293017', '2025-09-16 14:23:02.293017', 16, '', '', '', '', 'company');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `logoUrl` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_status`
--

CREATE TABLE `payment_status` (
  `id` int(11) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_transactions`
--

CREATE TABLE `payment_transactions` (
  `id` int(11) NOT NULL,
  `order_code` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `payment_gateway` varchar(50) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `gateway_transaction_id` varchar(100) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('PENDING','SUCCESS','FAILED','CANCELED') NOT NULL DEFAULT 'PENDING',
  `request_data` text DEFAULT NULL,
  `callback_data` text DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `route_code` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `permissions`
--

INSERT INTO `permissions` (`id`, `created_at`, `updated_at`, `route_code`, `path`, `method`, `display_name`) VALUES
(1, '2025-09-05 17:10:13.703337', '2025-09-05 17:10:13.703337', 'ADD_OR_UPDATE_PERMISSION_IN_ROLE', 'roles', 'post', 'ADD OR UPDATE PERMISSION IN ROLE'),
(2, '2025-09-05 17:10:13.711712', '2025-09-05 17:10:13.711712', 'DETAIL_ROLE', 'roles', 'get', 'Get detail role'),
(3, '2025-09-05 17:10:13.713708', '2025-09-05 17:10:13.713708', 'CREATE_ROLE', 'roles', 'post', 'Create new role'),
(4, '2025-09-05 17:10:13.717089', '2025-09-05 17:10:13.717089', 'VIEW_ALL_PERMISSION', 'permissions', 'GET', 'View all permissions'),
(5, '2025-09-05 17:10:13.717922', '2025-09-05 17:10:13.717922', 'UPDATE_PERMISSION', 'permissions', 'PUT', 'Update permissions'),
(6, '2025-09-05 17:10:13.718761', '2025-09-05 17:10:13.718761', 'VIEW_ALL_MEMBER_EVENT', 'member-events', 'GET', 'View all members in event'),
(7, '2025-09-23 17:02:19.124692', '2025-09-23 17:02:19.124692', 'CREATE_EVENT', 'events', 'POST', 'Create event'),
(8, '2025-09-23 17:02:19.128270', '2025-09-23 17:02:19.128270', 'UPDATE_EVENT', 'event-permission', 'PATCH', 'Update event'),
(9, '2025-09-23 17:02:19.129364', '2025-09-23 17:02:19.129364', 'LIST_ROLE', 'roles', 'get', 'Get list role'),
(10, '2025-09-23 17:02:19.130396', '2025-09-23 17:02:19.130396', 'UPDATE_ROLE', 'roles', 'put', 'Update role'),
(11, '2025-09-23 17:02:19.131484', '2025-09-23 17:02:19.131484', 'DELETE_ROLE', 'roles', 'delete', 'Delete role'),
(12, '2025-09-23 17:02:19.132350', '2025-09-23 17:02:19.132350', 'VIEW_ALL_PERMISSION_EVENT', 'permissions', 'GET', 'View all permissions event'),
(13, '2025-09-23 17:02:19.133224', '2025-09-23 17:02:19.133224', 'INVITE_MEMBER_EVENT', 'event-permission', 'POST', 'Invite member to event'),
(14, '2025-09-23 17:02:19.134652', '2025-09-23 17:02:19.134652', 'CREATE_ROLE_EVENT', 'event-role', 'POST', 'Create event role'),
(15, '2025-09-23 17:02:19.136952', '2025-09-23 17:02:19.136952', 'UPDATE_ROLE_EVENT', 'event-role', 'PUT', 'Update event role'),
(16, '2025-09-23 17:02:19.138766', '2025-09-23 17:02:19.138766', 'VIEW_ALL_ROLE_EVENT', 'event-role', 'GET', 'Get all event role'),
(17, '2025-09-23 17:02:19.141349', '2025-09-23 17:02:19.141349', 'GET_DETAIL_ROLE_EVENT', 'event-role', 'GET', 'Get detail event role'),
(18, '2025-09-23 17:02:19.142558', '2025-09-23 17:02:19.142558', 'DELETE_ROLE_EVENT', 'event-role', 'DELETE', 'Delete event role'),
(19, '2025-09-23 17:02:19.143238', '2025-09-23 17:02:19.143238', 'VIEW_PERMISSION_ROLE_EVENT', 'event-role', 'GET', 'Get permissions of event role'),
(20, '2025-09-23 17:02:19.143796', '2025-09-23 17:02:19.143796', 'ADD_OR_UPDATE_PERMISSION_IN_ROLE_EVENT', 'event-role', 'POST', 'Add or update permissions in event role');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `refund_transactions`
--

CREATE TABLE `refund_transactions` (
  `id` int(11) NOT NULL,
  `payment_transaction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `refund_amount` decimal(12,2) NOT NULL,
  `status` enum('PENDING','SUCCESS','FAILED') NOT NULL DEFAULT 'PENDING',
  `reason` varchar(255) DEFAULT NULL,
  `gateway_refund_id` varchar(100) DEFAULT NULL,
  `callback_data` text DEFAULT NULL,
  `refunded_at` datetime DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `code` varchar(255) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `created_at`, `updated_at`, `code`, `display_name`) VALUES
(1, '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', NULL, 'abccc'),
(2, '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', 'aaaaaaa', 'abccccc'),
(3, '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', 'adda', 'fđssds');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `seats`
--

CREATE TABLE `seats` (
  `id` int(11) NOT NULL,
  `seat_code` varchar(4) NOT NULL,
  `zone` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `event_id` int(11) NOT NULL,
  `type` enum('public','private_link') NOT NULL DEFAULT 'public',
  `message` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `settings`
--

INSERT INTO `settings` (`id`, `created_at`, `updated_at`, `event_id`, `type`, `message`, `link`, `url`, `slug`) VALUES
(1, '2025-09-08 10:03:51.329699', '2025-09-12 10:05:54.222000', 7, 'public', '', 'fasdfas', 'https://ticketbox.vn/fasdfas-7', NULL),
(2, '2025-09-12 09:29:54.104334', '2025-09-12 10:07:29.557000', 8, 'public', '', 'vcxfcbbvs', 'https://ticketbox.vn/vcxfcbbvs-8', NULL),
(3, '2025-09-12 10:01:00.565296', '2025-09-12 10:06:17.243000', 11, 'public', '', 'sdfsd', 'https://ticketbox.vn/sdfsd-11', NULL),
(4, '2025-09-12 17:36:37.574487', '2025-09-17 16:44:35.314000', 12, 'public', '', 'fdasf', 'https://ticketbox.vn/fdasf-12', NULL),
(5, '2025-09-15 11:22:01.239003', '2025-09-15 13:18:52.314000', 13, 'public', '', 'dsfsdfs', 'https://ticketbox.vn/dsfsdfs-13', NULL),
(6, '2025-09-16 13:25:47.420607', '2025-09-16 13:25:47.420607', 15, 'public', '', 'fsdfdsa', 'https://ticketbox.vn/fsdfdsa-15', NULL),
(7, '2025-09-16 14:23:00.955186', '2025-09-16 14:23:00.955186', 16, 'public', '', 'sdfsdfsda', 'https://ticketbox.vn/sdfsdfsda-16', NULL),
(8, '2025-09-18 15:27:19.683384', '2025-09-18 15:27:19.683384', 19, 'public', '', '', '', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shows`
--

CREATE TABLE `shows` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `event_id` int(11) NOT NULL,
  `time_start` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `time_end` timestamp NULL DEFAULT NULL,
  `is_free` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shows`
--

INSERT INTO `shows` (`id`, `created_at`, `updated_at`, `event_id`, `time_start`, `time_end`, `is_free`) VALUES
(1, '2025-09-08 10:03:50.021944', '2025-09-12 10:05:36.000000', 7, '2025-09-14 13:02:00', '2025-10-19 13:02:00', NULL),
(2, '2025-09-12 09:29:50.833872', '2025-09-12 10:07:28.000000', 8, '2025-09-14 19:29:00', '2025-10-05 19:29:00', NULL),
(3, '2025-09-12 09:57:01.597366', '2025-09-12 09:57:01.597366', 10, '2025-09-13 19:56:00', '2025-09-29 19:56:00', NULL),
(4, '2025-09-12 10:00:58.637829', '2025-09-12 10:06:43.000000', 11, '2025-09-15 19:59:00', '2025-09-28 19:59:00', NULL),
(5, '2025-09-12 17:36:36.869530', '2025-09-17 16:44:33.000000', 12, '2025-09-15 03:36:00', '2025-10-16 03:36:00', NULL),
(6, '2025-09-15 11:21:59.009241', '2025-09-15 11:23:29.000000', 13, '2025-09-15 04:20:49', '2025-11-05 21:20:00', NULL),
(9, '2025-09-16 13:25:46.870840', '2025-09-16 13:25:46.870840', 15, '2025-09-16 02:56:00', '2025-09-24 19:56:00', NULL),
(10, '2025-09-16 14:22:59.148734', '2025-09-16 14:22:59.148734', 16, '2025-09-16 07:22:01', '2025-12-07 00:22:00', NULL),
(11, '2025-09-18 15:27:16.775412', '2025-09-18 15:27:16.775412', 19, '2025-09-18 08:26:39', '2028-08-19 01:26:00', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `show_seats`
--

CREATE TABLE `show_seats` (
  `id` int(11) NOT NULL,
  `show_id` int(11) NOT NULL,
  `seat_id` int(11) NOT NULL,
  `status` enum('available','selected','booked') NOT NULL,
  `reserved_by_user_id` int(11) DEFAULT NULL,
  `reserved_at` datetime DEFAULT NULL,
  `reserved_until` datetime DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `showId` int(11) DEFAULT NULL,
  `seatId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `name` varchar(120) NOT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_ticket` int(11) NOT NULL,
  `min_ticket` int(11) NOT NULL DEFAULT 1,
  `max_ticket` int(11) NOT NULL DEFAULT 10,
  `show_id` int(11) NOT NULL,
  `description` varchar(250) DEFAULT NULL,
  `thumbnail` varchar(250) DEFAULT NULL,
  `slug` varchar(50) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `is_free` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tickets`
--

INSERT INTO `tickets` (`id`, `created_at`, `updated_at`, `name`, `price`, `total_ticket`, `min_ticket`, `max_ticket`, `show_id`, `description`, `thumbnail`, `slug`, `start_time`, `end_time`, `is_free`) VALUES
(1, '2025-09-08 10:03:50.024203', '2025-09-12 10:05:36.000000', 'VIP', 100000.00, 1000000, 1, 10, 1, 'dsafasfasdfsad', NULL, 'vip-1757300630023', '2025-09-15 10:04:00', '2025-09-22 10:04:00', 1),
(2, '2025-09-08 10:03:50.025717', '2025-09-18 09:27:57.866894', 'Standard', 20000.00, 1000000, 1, 10, 1, 'sfasfadfas', NULL, 'standard-1757300630025', '2025-09-15 10:04:00', '2025-09-22 10:04:00', 1),
(3, '2025-09-12 09:29:50.838858', '2025-09-18 15:46:50.000000', 'đs', 100000.00, 9995, 1, 10, 2, 'dfasd', NULL, '-s-1757644190837', '2025-09-02 09:29:00', '2025-09-15 09:29:00', 1),
(4, '2025-09-12 09:57:01.605020', '2025-09-18 09:27:51.178379', '', 100000.00, 10, 1, 10, 3, 'dsafasdf', NULL, '-1757645821603', '2025-09-13 09:56:00', '2025-09-15 09:56:00', 0),
(5, '2025-09-12 10:00:58.639924', '2025-09-15 17:31:28.000000', 'VIP', 10000.00, 5, 1, 10, 4, 'aaaa', NULL, 'vip-1757646058639', '2025-09-13 09:59:00', '2025-09-22 09:59:00', 0),
(6, '2025-09-12 10:00:58.640904', '2025-09-18 09:28:04.483224', 'Standard', 30000.00, 20, 1, 10, 4, 'dfs', NULL, 'standard-1757646058640', '2025-09-13 10:00:00', '2025-09-15 10:00:00', 1),
(7, '2025-09-12 17:36:36.872806', '2025-09-17 16:44:33.000000', 'dfsad', 100000.00, 1000, 10, 100, 5, 'sdfsafa', NULL, 'dfsad-1757673396872', '2025-09-10 16:43:00', '2025-09-23 16:43:00', 0),
(8, '2025-09-15 11:21:59.012301', '2025-09-26 17:45:25.000000', 'HEHEHEHEHE', 40000.00, 972, 1, 10, 6, 'ấdas', NULL, 'hehehehehe-1757910119011', '2025-09-15 11:21:00', '2025-10-30 11:21:00', 1),
(9, '2025-09-15 11:21:59.015745', '2025-09-26 17:45:25.000000', 'HIHIHI', 1000000.00, 967, 1, 10, 6, '', NULL, '-1757910119014', '2025-09-17 11:21:00', '2025-10-30 11:21:00', 0),
(11, '2025-09-16 13:25:46.879032', '2025-09-18 09:28:16.889726', 'czdz', 50000.00, 10, 1, 10, 9, '', NULL, 'czdz-1758003946878', '2025-09-09 09:56:00', '2025-09-18 09:56:00', 0),
(12, '2025-09-16 14:22:59.152662', '2025-09-17 11:26:33.000000', 'abcdddd', 100000000.00, 988, 1, 100, 10, 'bfghfgfd', NULL, 'abcdddd-1758007379151', '2025-09-17 14:22:00', '2025-09-21 14:22:00', 0),
(13, '2025-09-16 14:22:59.154409', '2025-09-17 11:26:33.000000', 'zxdfgfsgds', 200000.00, 85, 1, 100, 10, 'hfdhdghfd', NULL, 'zxdfgfsgds-1758007379153', '2025-09-17 14:22:00', '2025-09-20 14:22:00', 0),
(14, '2025-09-18 15:27:16.779038', '2025-09-18 15:27:16.779038', 'VIP1', 0.00, 10, 1, 10, 11, 'dsfs', NULL, 'vip1-1758184036777', '2025-09-15 15:26:00', '2025-10-30 15:26:00', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `slug` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `role_id` int(11) NOT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `username`, `email`, `phone`, `slug`, `password`, `is_active`, `role_id`, `gender`, `date_of_birth`, `avatar`) VALUES
(1, '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', 'sdfs', 'a@gmail.com', '0123456789', NULL, 'momomomomo', 1, 1, 'male', NULL, NULL),
(2, '2025-09-23 17:13:11.468404', '2025-09-23 17:16:58.199252', NULL, 'hoangganh@gmail.com', NULL, NULL, 'Mo@28122004', 1, 1, NULL, NULL, NULL),
(3, '2025-09-23 17:50:57.204990', '2025-09-23 17:50:57.204990', NULL, 'hoangganh1@gmail.com', NULL, NULL, 'Abcd@12345678', 1, 0, NULL, NULL, NULL),
(4, '2025-09-23 17:52:19.874107', '2025-09-23 17:52:19.874107', NULL, 'Abcd@gmail.com', NULL, NULL, 'Abcd1@gmail.com', 1, 0, NULL, NULL, NULL),
(5, '2025-09-24 09:51:58.969293', '2025-09-24 09:51:58.969293', NULL, 'hoangganh28@gmail.com', NULL, NULL, '$2b$10$iref1P81OrlUX.TlGJKj4.ZM9z1X7JG6K1oY3mSJ6L2mEpes6o/ZS', 1, 0, NULL, NULL, NULL),
(6, '2025-09-24 11:00:39.987037', '2025-09-24 11:00:39.987037', NULL, 'hoanganh52521352@gmail.com', NULL, NULL, '$2b$10$YQdqsaXM9.ZdqU7Nceb25OyGA7/O9xKuHcgmG829bfuOa.lZo1uxK', 1, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_role_permissions`
--

CREATE TABLE `user_role_permissions` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `permission_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

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
  ADD KEY `FK_e8d4deb508773852aee561337c9` (`event_role_id`),
  ADD KEY `FK_da7df51fdeb800933679daeb16b` (`permission_id`);

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
  ADD UNIQUE KEY `IDX_59d6b7756aeb6cbb43a093d15a` (`idempotency_key`),
  ADD KEY `FK_a922b820eeef29ac1c6800e826a` (`user_id`),
  ADD KEY `FK_642ca308ac51fea8327e593b8ab` (`event_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_145532db85752b29c57d2b7b1f1` (`order_id`),
  ADD KEY `FK_14d6d26343634ee91fb9cf486ba` (`ticket_id`),
  ADD KEY `FK_8b29bfedc90b332c5a1ae69dd16` (`show_id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_427785468fb7d2733f59e7d7d39` (`user_id`),
  ADD KEY `FK_b2f7b823a21562eeca20e72b006` (`order_id`);

--
-- Chỉ mục cho bảng `payment_event`
--
ALTER TABLE `payment_event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_5cabd564cf6573469cdadc3f964` (`event_id`);

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
-- Chỉ mục cho bảng `seats`
--
ALTER TABLE `seats`
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
-- Chỉ mục cho bảng `show_seats`
--
ALTER TABLE `show_seats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_dfbf20f8114a38b83f3db4adc20` (`showId`),
  ADD KEY `FK_541d5e75fe55df94a3aa41a10a1` (`seatId`);

--
-- Chỉ mục cho bảng `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_c635ea3f47267dbf3e1b17be25` (`slug`),
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
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `event_memberships`
--
ALTER TABLE `event_memberships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `event_roles`
--
ALTER TABLE `event_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `event_role_permissions`
--
ALTER TABLE `event_role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT cho bảng `payment_event`
--
ALTER TABLE `payment_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `payment_status`
--
ALTER TABLE `payment_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `payment_transactions`
--
ALTER TABLE `payment_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `refund_transactions`
--
ALTER TABLE `refund_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `seats`
--
ALTER TABLE `seats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `shows`
--
ALTER TABLE `shows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `show_seats`
--
ALTER TABLE `show_seats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `user_role_permissions`
--
ALTER TABLE `user_role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `FK_1a259861a2ce114f074b366eed2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_643188b30e049632f80367be4e1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `event_memberships`
--
ALTER TABLE `event_memberships`
  ADD CONSTRAINT `FK_02ef511b12992ff3a969b3905d0` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_318aabc5dbc74da9c8600f7737e` FOREIGN KEY (`event_role_id`) REFERENCES `event_roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_dd855a362bfd8662c1fb4aa5380` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `event_role_permissions`
--
ALTER TABLE `event_role_permissions`
  ADD CONSTRAINT `FK_da7df51fdeb800933679daeb16b` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_e8d4deb508773852aee561337c9` FOREIGN KEY (`event_role_id`) REFERENCES `event_roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK_642ca308ac51fea8327e593b8ab` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_a922b820eeef29ac1c6800e826a` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FK_145532db85752b29c57d2b7b1f1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_14d6d26343634ee91fb9cf486ba` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_8b29bfedc90b332c5a1ae69dd16` FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `FK_427785468fb7d2733f59e7d7d39` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_b2f7b823a21562eeca20e72b006` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `payment_event`
--
ALTER TABLE `payment_event`
  ADD CONSTRAINT `FK_5cabd564cf6573469cdadc3f964` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD CONSTRAINT `FK_77fab0556decc83a81a5bf8c25d` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `refund_transactions`
--
ALTER TABLE `refund_transactions`
  ADD CONSTRAINT `FK_03f69ff260c2dee08d1f6eab53f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_c31e72dd3b33c5797c611253051` FOREIGN KEY (`payment_transaction_id`) REFERENCES `payment_transactions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `FK_d4001cbeef50f7c8a4344fdfbb5` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `shows`
--
ALTER TABLE `shows`
  ADD CONSTRAINT `FK_c666928e39f01d397b1213021be` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `show_seats`
--
ALTER TABLE `show_seats`
  ADD CONSTRAINT `FK_541d5e75fe55df94a3aa41a10a1` FOREIGN KEY (`seatId`) REFERENCES `seats` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_dfbf20f8114a38b83f3db4adc20` FOREIGN KEY (`showId`) REFERENCES `shows` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `FK_81fa3650935b12f80f7968fd0cf` FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `user_role_permissions`
--
ALTER TABLE `user_role_permissions`
  ADD CONSTRAINT `FK_3eb2fe2bf4c1d096d224bfe8e4d` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_8b96e1d08d00d10f645b8d2f952` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
