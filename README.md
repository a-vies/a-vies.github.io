# AVIES — GitHub Pages website

Website chính thức cho **Association of Vietnamese Intellectuals and Experts in Switzerland (AVIES)** - Hội Trí thức và Chuyên gia Việt Nam tại Thụy Sĩ.

## Nội dung

- Trang chủ giới thiệu AVIES, sứ mệnh, bốn trọng tâm hoạt động và các lĩnh vực trong mạng lưới chuyên gia.
- Ba chuyên mục nội dung: **Gương mặt chuyên gia**, **Tin tức hoạt động** và **Góc nhìn chuyên môn**; bài viết được quản lý riêng theo từng chuyên mục và tạo trang khi build.
- Mục sáng kiến và tác động cộng đồng giới thiệu VietSearch, V-Space cùng các khoản đóng góp được dẫn nguồn.
- Trang `about.html` trình bày thông tin về Hội, cách hoạt động, điều kiện tham gia và Ban Chấp hành.
- Các trang hỗ trợ gồm bảo vệ dữ liệu, thông tin website, sitemap, robots và trang 404.

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

## Cập nhật tin hoạt động

Các dấu mốc hoạt động được đăng thành bài trong `content/tin-tuc/`, dùng tên file bắt đầu bằng ngày tương ứng theo dạng `YYYYMMDD-ten-bai.md`. Danh sách Tin tức hoạt động tự sắp xếp bài mới nhất trước khi build.

Không đưa email, số điện thoại hoặc hồ sơ cá nhân của thành viên lên website khi chưa có sự đồng ý.

## Đăng bài viết

Trong VS Code, có thể chọn agent **Add Content** và cung cấp URL cùng chuyên mục (`tin-tuc`, `chuyen-mon` hoặc `chuyen-gia`) để biên tập bài từ nguồn công khai. Agent sẽ tạo bài Markdown, dẫn nguồn và kiểm tra ảnh theo hướng dẫn bên dưới.

Nội dung bài viết được chia theo chuyên mục trong các thư mục:

- `content/chuyen-gia/` — câu chuyện về chuyên gia AVIES
- `content/tin-tuc/` — tin tức hoạt động của Hội
- `content/chuyen-mon/` — bài viết chuyên môn của chuyên gia

Trong thư mục chuyên mục phù hợp, sao chép `_template.md` thành tên có dạng `YYYYMMDD-ten-bai.md`, ví dụ `20261121-hop-tac-y-te.md`. Đặt ảnh bài viết trong thư mục `images/` cùng chuyên mục (ví dụ `content/chuyen-gia/images/`) và khai báo trường `image` theo đường dẫn tương đối như `images/editorial-cover.svg`. Build sẽ sao chép ảnh sang `dist/<chuyen-muc>/images/`. Ngày trong tên file là ngày đăng trên website (với bài hồi cứu, dùng ngày xuất bản gốc nếu xác định được); ngày này quyết định thứ tự hiển thị, bài mới trước. Phần đầu file dùng các trường `title`, `summary`, `image`, `author` (không bắt buộc), `sourceUrl` và `sourceLabel` trong cặp `---`; phần nội dung bên dưới viết bằng Markdown. Danh mục hiển thị ảnh, tiêu đề và tóm tắt; nhấn vào thẻ để đọc bài chi tiết. Có thể dùng tiêu đề `##`, danh sách, trích dẫn, in đậm, in nghiêng, mã nội tuyến và liên kết HTTP(S). Mọi bài nên ghi nguồn tham khảo; nội dung từ trang khác cần được biên tập lại và dẫn nguồn, không chép nguyên bài. Sau đó chạy `npm run build`. Trang chuyên mục, trang bài viết và sitemap sẽ được tạo tự động trong `dist/`.

Để chèn ảnh trong nội dung, đặt ảnh trong thư mục `images/` của chuyên mục và viết trên một dòng riêng: `![Mô tả ảnh](images/ten-anh.jpg "Chú thích ảnh")`. Chú thích trong dấu ngoặc kép là tùy chọn.
