# AVIES — GitHub Pages website

Website chính thức dạng tĩnh cho **Association of Vietnamese Intellectuals and Experts in Switzerland (AVIES)** — Hội Trí thức và Chuyên gia Việt Nam tại Thụy Sĩ.

## Nội dung

- Tên, sứ mệnh và dấu mốc thành lập ngày 02.06.2018 tại Genève
- Trọng tâm hoạt động và mạng lưới chuyên môn
- Dòng thời gian 2018–2026 với liên kết nguồn cho từng sự kiện
- Sáng kiến VietSearch, V-Space và các số liệu đóng góp cộng đồng
- Trang bảo vệ dữ liệu, thông tin website, sitemap và robots

## Chạy và kiểm tra

```bash
npm run build
```

Kết quả xuất bản được tạo trong thư mục `dist/`. Website không cần database, server ứng dụng hoặc framework phía trình duyệt.

## Xuất bản tại avies.github.io

1. Đưa toàn bộ source vào repository `avies/avies.github.io`, nhánh `main`.
2. Mở **Settings → Pages**.
3. Tại **Build and deployment → Source**, chọn **GitHub Actions**.
4. Workflow `.github/workflows/deploy-pages.yml` sẽ build và publish sau mỗi lần push vào `main`.

Nếu repository nằm dưới tên khác, website vẫn hoạt động vì tất cả đường dẫn nội bộ là tương đối.

## Cập nhật hoạt động

Thêm một mục `article.timeline-item` trong phần `#hanh-trinh` của `index.html`. Mỗi mục nên có ngày, chủ đề, tóm tắt ngắn và liên kết tới nguồn công khai đáng tin cậy.

Không đưa email, số điện thoại hoặc hồ sơ cá nhân của thành viên lên website khi chưa có sự đồng ý.
