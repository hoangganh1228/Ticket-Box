-- Luồng flow đặt vé tạm thời đối với database : 
    +Ưu điểm : 
        bền bững => dữ liệu vẫn còn nếu serve restart
        Audit dễ dàng : Có thể xem lại cart cũ để debug.
        Triển khai đơn giản 
    +Nhược điểm : 
        Tải DB cao: Tạo/xóa cart liên tục khi nhiều user.
        Lock contention: Khi nhiều người cùng update bảng vé → dễ deadlock hoặc chậm.
        Quét cron nặng: Dọn cart hết hạn cần quét thường xuyên → tốn tài nguyên.
        Trừ số lượng sớm: Nếu người dùng không thanh toán → cần cộng lại, có thể gây mismatch nếu cron hoặc API xóa lỗi.

    + Khắc phục : 
        Thêm index trên expires_at để quét nhanh.
        Dùng batch job hoặc delayed task để dọn cart.
        Cải thiện logic cộng lại số lượng bằng transaction an toàn.
        Nếu lưu lượng cực lớn → kết hợp cache hoặc chuyển sang Redis.

-- Luồng flow đặt vé tạm thời với redis : 
    1. User chọn vé -> be
        + Kiểm tra reaming_ticket trong db (hoặc cache)
        + Nếu đủ -> ghi vào redis key với ttl thời gian 15 phút 
        + Không trừ ngay tồn kho trong DB (hoặc chỉ trừ mềm, tùy chiến lược)
    
    2 . BE trả về expires_at (TTL) cho FE.

    3 . Hết thời gian 
        +Redis tự động xóa key -> coi như vé được giải phóng
    4 . Khi thanh toán
       Be đọc dữ liệu từ redis => xác nhận vé
       Transaction DB mới trừ số lượng thật sự, tạo order, order_items.
       Xóa key Redis.


    ✅ Ưu điểm
    Hiệu năng cao: Redis in-memory rất nhanh, giảm tải DB.
    Tự động dọn dẹp: TTL tự hết hạn, không cần cron quét.
    Dễ scale: Redis cluster phù hợp lượng truy cập lớn.

    ❌ Nhược điểm & Vấn đề thực tế
    Không bền vững: Redis restart → mất giữ chỗ → có thể dẫn tới overbooking.
    Phức tạp đồng bộ: Cần sync trạng thái giữa Redis và DB.
    Hạ tầng phức tạp: Cần triển khai Redis cluster/Sentinel để đảm bảo HA.

    🛠 Khắc phục
    Double-check tồn kho trong DB khi thanh toán (chỉ commit order nếu còn vé).
    Dùng Redis persistence (RDB hoặc AOF) hoặc cluster replication.
    Triển khai Redlock hoặc SETNX để tránh race condition khi nhiều server giữ cùng vé.