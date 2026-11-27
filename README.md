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

Trong thư mục chuyên mục phù hợp, sao chép `_template.md` thành tên có dạng `YYYYMMDD-ten-bai.md`, ví dụ `20261121-hop-tac-y-te.md`. Đặt ảnh riêng của bài trong thư mục `images/` cùng chuyên mục (ví dụ `content/chuyen-gia/images/`) và khai báo trường `image` theo đường dẫn như `images/ten-anh.jpg`. Nếu bài không có ảnh riêng, chọn ảnh minh họa lĩnh vực trong thư mục dùng chung `images/categories/` và dùng đường dẫn `../images/categories/ten-anh.svg`. Bộ ảnh dùng bảng màu AVIES đỏ, đen và trắng ngà, gồm 20 lĩnh vực:

| Lĩnh vực | Tên ảnh |
| --- | --- |
| Khoa học, công nghệ và AI | `khoa-hoc-cong-nghe.svg` |
| Y tế và khoa học sự sống | `y-te-khoa-hoc-su-song.svg` |
| Giáo dục và nghiên cứu | `giao-duc-nghien-cuu.svg` |
| Kinh tế và tài chính | `kinh-te-tai-chinh.svg` |
| Khởi nghiệp và đổi mới sáng tạo | `khoi-nghiep-doi-moi.svg` |
| Môi trường và phát triển bền vững | `moi-truong-ben-vung.svg` |
| Chính sách và hợp tác quốc tế | `chinh-sach-hop-tac-quoc-te.svg` |
| Kỹ thuật và công nghiệp | `ky-thuat-cong-nghiep.svg` |
| Văn hóa và nghệ thuật | `van-hoa-nghe-thuat.svg` |
| Cộng đồng và kết nối | `cong-dong-ket-noi.svg` |
| Năng lượng và chuyển dịch xanh | `nang-luong.svg` |
| Nông nghiệp và thực phẩm | `nong-nghiep-thuc-pham.svg` |
| Pháp luật và đạo đức | `phap-luat-dao-duc.svg` |
| Kiến trúc và đô thị | `kien-truc-do-thi.svg` |
| Giao thông và logistics | `giao-thong-logistics.svg` |
| Truyền thông và công nghệ số | `truyen-thong-so.svg` |
| Du lịch và dịch vụ | `du-lich-dich-vu.svg` |
| Tâm lý và khoa học xã hội | `tam-ly-xa-hoi.svg` |
| Thể thao và sức khỏe cộng đồng | `the-thao-suc-khoe.svg` |
| An ninh mạng và dữ liệu | `an-ninh-mang-du-lieu.svg` |

Build sao chép ảnh dùng chung vào `dist/images/categories/`; đường dẫn tương đối ở trên hoạt động trong cả danh sách và trang bài viết. Ảnh riêng của bài được sao chép sang `dist/<chuyen-muc>/images/`. Ngày trong tên file là ngày đăng trên website (với bài hồi cứu, dùng ngày xuất bản gốc nếu xác định được); ngày này quyết định thứ tự hiển thị, bài mới trước. Phần đầu file dùng các trường `title`, `summary`, `image`, `author` (không bắt buộc), `sourceUrl` và `sourceLabel` trong cặp `---`; phần nội dung bên dưới viết bằng Markdown. Danh mục hiển thị ảnh, tiêu đề và tóm tắt; nhấn vào thẻ để đọc bài chi tiết. Có thể dùng tiêu đề `##`, danh sách, trích dẫn, in đậm, in nghiêng, mã nội tuyến và liên kết HTTP(S). Mọi bài nên ghi nguồn tham khảo; nội dung từ trang khác cần được biên tập lại và dẫn nguồn, không chép nguyên bài. Sau đó chạy `npm run build`. Trang chuyên mục, trang bài viết và sitemap sẽ được tạo tự động trong `dist/`.

Để chèn ảnh trong nội dung, đặt ảnh trong thư mục `images/` của chuyên mục và viết trên một dòng riêng: `![Mô tả ảnh](images/ten-anh.jpg "Chú thích ảnh")`. Chú thích trong dấu ngoặc kép là tùy chọn.
