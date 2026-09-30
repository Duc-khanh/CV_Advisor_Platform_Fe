# CV Advisor Frontend Agent Guide

Tài liệu này là nguồn quy ước chuẩn cho mọi thay đổi frontend trong `src/`. Con người và Agent phải đọc trước khi tạo feature, di chuyển file, gọi API hoặc tạo component dùng chung.

## 1. Mục tiêu kiến trúc

- Tổ chức theo nghiệp vụ (`feature-first`), không gom toàn bộ code theo loại kỹ thuật.
- Page chỉ điều phối dữ liệu và bố cục; logic bất đồng bộ nằm trong hook/service; UI lớn nằm trong component con.
- Component dùng chung phải độc lập với page và feature cụ thể.
- Giữ chiều phụ thuộc một chiều để tránh import vòng và tránh `services` phụ thuộc UI.
- Di chuyển code cũ theo từng feature, không tái cấu trúc toàn dự án khi yêu cầu chỉ liên quan một khu vực.

## 2. Công nghệ và lệnh chuẩn

- React 19, React Router 7, Vite 7.
- Material UI 7 là thư viện UI chính.
- Axios instance dùng chung tại `services/axios.js`.
- ESLint flat config tại `eslint.config.js`.

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

Trước khi bàn giao, bắt buộc chạy `npm run lint` và `npm run build`. Không được bỏ qua lỗi mới. Nếu còn warning cũ ngoài phạm vi thay đổi, phải ghi rõ trong kết quả bàn giao.

## 3. Bản đồ thư mục

```text
src/
├── features/                 # Code theo nghiệp vụ mới
│   └── <feature>/
│       ├── <Feature>Page.jsx # Route page/feature entry
│       ├── components/       # UI chỉ thuộc feature
│       ├── hooks/            # State và orchestration của feature
│       ├── utils/            # Hàm thuần của feature
│       └── index.js          # Public exports tối thiểu
├── shared/
│   ├── api/                  # API base, endpoint dùng nhiều domain
│   └── components/           # UI dùng giữa các feature
│       ├── actions/
│       ├── feedback/
│       └── forms/            # Tạo khi thực sự có thành phần dùng chung
├── services/                 # HTTP client và service theo domain
├── layouts/                  # Shell cho User/Admin/HR/Auth
├── routes/                   # Route guards
├── contexts/                 # Context cấp ứng dụng
├── utils/                    # Hàm thuần dùng toàn ứng dụng
├── pages/                    # Khu vực legacy đang được di chuyển dần
├── components/               # Component legacy hoặc nhóm UI hiện hữu
├── App.jsx                   # Khai báo route
└── main.jsx                  # Provider và bootstrap
```

`pages/` và `components/` vẫn chứa code legacy. Không dùng cấu trúc cũ làm mẫu cho feature mới nếu nó mâu thuẫn với tài liệu này.

## 4. Chiều phụ thuộc bắt buộc

```text
App/routes
   ↓
features/pages
   ↓
feature components + feature hooks
   ↓
shared components + services + shared api + utils
```

Quy tắc:

- `shared/` không import từ `features/` hoặc `pages/`.
- `services/` không import từ `features/`, `pages/`, component hoặc hook.
- Feature được import `shared`, `services`, `contexts` và `utils`.
- Feature này không truy cập file nội bộ của feature khác. Nếu cần dùng chung, nâng abstraction đó lên `shared/` hoặc service phù hợp.
- `App.jsx` import page qua public export của feature, ví dụ `features/jobs/job-detail/index.js`.
- Không đặt API endpoint chuẩn trong `pages/`. File legacy có thể re-export tạm thời từ `shared/api` trong giai đoạn migration.

## 5. Chọn đúng vị trí cho code

Trước khi tạo file, trả lời theo thứ tự:

1. Chỉ dùng trong một page/feature? Đặt trong feature đó.
2. Dùng bởi nhiều màn hình của cùng một nghiệp vụ? Đặt trong `features/<feature>/components`, `hooks` hoặc `utils`.
3. Dùng bởi các nghiệp vụ không liên quan và không chứa kiến thức domain? Đặt trong `shared/`.
4. Là thao tác HTTP/domain data? Đặt trong `services/<domain>/`.
5. Là hàm thuần dùng toàn ứng dụng? Đặt trong `utils/`.

Không đưa component vào `shared` chỉ vì “có thể sẽ dùng lại”. Chỉ nâng lên shared khi đã có nhu cầu dùng chung rõ ràng.

## 6. Cấu trúc feature chuẩn

Ví dụ từ feature hiện tại:

```text
features/jobs/job-detail/
├── JobDetailPage.jsx
├── index.js
├── components/
│   ├── JobApplicationDialog.jsx
│   ├── JobDetailSidebar.jsx
│   ├── JobDetailStickyActions.jsx
│   └── index.js
├── hooks/
│   └── useJobApplication.js
└── utils/
    └── jobDetail.utils.js
```

Khi tạo feature mới:

- Chỉ tạo thư mục thật sự cần; không tạo sẵn folder rỗng.
- `index.js` chỉ export API công khai. Không barrel-export mọi file nội bộ.
- Tên page/component dùng PascalCase; hook bắt đầu bằng `use`; utility dùng camelCase.
- Một file ưu tiên một component chính. Component nhỏ, chỉ dùng nội bộ có thể ở cùng file.
- Khi page bắt đầu chứa nhiều state machine, request hoặc khối JSX độc lập, tách theo trách nhiệm thay vì tách theo số dòng máy móc.

## 7. Trách nhiệm từng lớp

### Page

Page được phép:

- Đọc route params/location và kết nối layout cấp trang.
- Gọi feature hook.
- Ghép các section/component lớn.
- Xử lý navigation cấp route.

Page không nên:

- Chứa form/modal dài hàng trăm dòng.
- Lặp lại logic fetch, upload, favorite hoặc error mapping.
- Chứa danh sách endpoint hard-code nếu endpoint đã có trong shared/service.

### Component

- Nhận dữ liệu và callback qua props; không tự biết route hoặc token nếu không thật sự là trách nhiệm của nó.
- Nút chỉ có icon phải có accessible label và tooltip. Ưu tiên `shared/components/actions/AppIconButton.jsx`.
- Trạng thái loading/empty/error cấp trang ưu tiên `shared/components/feedback/PageState.jsx`.
- Dùng semantic element phù hợp; link ngoài phải có `target="_blank"` kèm `rel="noopener noreferrer"`.
- Không dùng array index làm key khi dữ liệu có id ổn định.

### Hook

- Gom state, effect, request orchestration và event handler có liên quan.
- Mọi effect phải có cleanup khi request hoặc callback có thể hoàn tất sau unmount.
- Tuân thủ `react-hooks/exhaustive-deps`; dùng `useCallback` khi callback là dependency.
- Hook trả về API nhỏ, có tên rõ ràng; tránh trả toàn bộ implementation state nếu component không cần.

### Service

- Dùng Axios instance từ `services/axios.js`; interceptor đã tự gắn Bearer token.
- Service trả dữ liệu domain hoặc response theo convention hiện hữu, không hiển thị toast và không điều khiển UI.
- Endpoint dùng nhiều nơi đặt trong `shared/api/endpoints.js`.
- Không tạo Axios instance mới nếu không có base URL hoặc policy xác thực khác biệt thực sự.

### Utility

- Là hàm thuần: cùng input cho cùng output, không đọc state UI và không tạo side effect.
- Utility riêng nghiệp vụ nằm trong feature; utility tổng quát nằm trong `src/utils`.

## 8. API, xác thực và URL

- Biến môi trường đang dùng: `VITE_API_BASE_URL` và `VITE_GOOGLE_CLIENT_ID`.
- Không commit secret, access token hoặc nội dung `.env`.
- Không log token, CV, dữ liệu cá nhân hoặc response nhạy cảm.
- Dùng `getMediaUrl`/`getCvUrl` từ `utils/urlHelpers.js` cho file backend; không tự nối host.
- Endpoint ứng dụng thường bắt đầu bằng `/api`; `VITE_API_BASE_URL` được normalize để tránh `/api/api`.
- Route cần đăng nhập phải bọc `ProtectedRoute`; route Admin/HR phải truyền đúng `role`.
- Không dựa riêng vào bảo vệ frontend cho phân quyền; backend vẫn là nguồn quyết định quyền truy cập.

## 9. State, lỗi và phản hồi người dùng

- `useToast()` trả về trực tiếp hàm `showToast`:

```jsx
const showToast = useToast();
showToast("Cập nhật thành công", "success");
```

Không destructure `{ toast }` từ `useToast()`.

- Catch block phải giữ thông báo backend khi an toàn: `error.response?.data?.message` và có fallback tiếng Việt.
- Không nuốt lỗi im lặng. Nếu lỗi không hiển thị cho người dùng, phải có lý do và log không chứa dữ liệu nhạy cảm.
- Mọi thao tác submit/upload phải có trạng thái đang xử lý và ngăn submit lặp.
- Empty state, loading state và error state phải được thiết kế, không chỉ xử lý happy path.

## 10. UI và styling

- Ưu tiên MUI component và `sx`; không trộn thêm hệ styling mới nếu không có yêu cầu.
- Dùng token/theme khi đã có; tránh nhân bản màu/kích thước trong component dùng chung.
- Giao diện phải hoạt động ở mobile và desktop; kiểm tra breakpoint ít nhất `xs` và `md/lg` khi thay layout.
- Giữ nội dung tiếng Việt đúng UTF-8; không đưa chuỗi mojibake như `á»©ng tuyá»ƒn` vào source.
- Không thay đổi thiết kế hoặc hành vi ngoài phạm vi chỉ để “dọn code”. Refactor phải giữ nguyên hành vi trừ khi yêu cầu nói khác.

## 11. Migration code legacy

- Di chuyển theo từng route/feature và giữ file re-export tương thích khi còn import cũ.
- Route mới phải trỏ trực tiếp tới feature sau khi migration ổn định.
- Trước khi xóa file tương thích, dùng `rg` xác nhận không còn consumer.
- Không tạo thêm code mới trong `pages/user/_shared`; khu vực này là legacy. Code shared mới đi vào `src/shared`, code domain mới đi vào `src/features`.
- Nếu phát hiện tài liệu legacy mâu thuẫn, tài liệu này là nguồn chuẩn và tài liệu cũ cần được cập nhật hoặc đánh dấu deprecated.

## 12. Quy trình Agent khi thay đổi frontend

1. Đọc yêu cầu, file liên quan, public exports và consumer trước khi sửa.
2. Kiểm tra `git status`; không ghi đè thay đổi không thuộc nhiệm vụ.
3. Xác định code thuộc feature, shared, service hay utility bằng mục 5.
4. Giữ phạm vi nhỏ nhất đủ giải quyết yêu cầu; bảo toàn API công khai khi có consumer cũ.
5. Sau khi sửa, tìm import cũ, endpoint trùng và component không còn dùng bằng `rg`.
6. Chạy ESLint cho file đã đổi, sau đó `npm run lint`.
7. Chạy `npm run build`.
8. Kiểm tra `git diff --check` và đọc lại diff để phát hiện file ngoài phạm vi.
9. Bàn giao: nêu file chính, hành vi thay đổi, kết quả lint/build và cảnh báo còn lại.

Agent không được tự ý:

- Sửa backend contract, schema hoặc biến môi trường để làm frontend “chạy được”.
- Xóa file legacy khi chưa kiểm tra consumer.
- Thêm dependency khi giải pháp hiện hữu đã đáp ứng được.
- Tắt ESLint rule, thêm ignore hoặc dùng disable comment chỉ để vượt kiểm tra.
- Chỉnh hàng loạt format/file không liên quan.

## 13. Definition of Done

Một thay đổi frontend chỉ hoàn thành khi:

- Code nằm đúng lớp và đúng feature.
- Không tạo dependency ngược hoặc import vòng.
- Không có secret, token, PII hay URL backend hard-code mới.
- Có loading/error/empty/disabled state phù hợp với luồng thay đổi.
- Nút icon có nhãn truy cập; layout liên quan vẫn responsive.
- Không có lỗi ESLint mới.
- Production build thành công.
- `git diff --check` sạch.
- File compatibility và technical debt còn lại được ghi rõ khi chưa thể xử lý trong cùng phạm vi.

## 14. Những điểm cần ưu tiên tiếp theo

- Tiếp tục chuyển các route lớn trong `pages/` sang `features/` theo từng nghiệp vụ.
- Hợp nhất shared component legacy từ `pages/user/_shared` vào `src/shared` khi có consumer thực tế.
- Chuẩn hóa service để component/hook không gọi endpoint trực tiếp.
- Bổ sung test framework trước khi viết hướng dẫn test bắt buộc; hiện dự án chưa có script `test` trong `package.json`.
- Tách route/page lớn bằng lazy loading để giảm bundle production.
