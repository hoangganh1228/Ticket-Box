import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true, // ✅ Bỏ qua lỗi ESLint khi build (Vercel sẽ không chặn)
    },
};

export default nextConfig;
