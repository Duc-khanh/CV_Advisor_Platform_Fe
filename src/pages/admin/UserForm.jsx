import { useEffect, useState } from "react";
import { TextField, Button, Stack, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { getCompanies, createCompany, getIndustries } from "../../services/adminUserService";

const filter = createFilterOptions();

export default function UserForm({ onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    password: "",
    role: initialData?.role || "USER",
    companyId: initialData?.companyId || "",
    avatar: null,
  });

  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [openCompanyModal, setOpenCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyIndustry, setNewCompanyIndustry] = useState("");

  useEffect(() => {
    getCompanies()
      .then((data) => setCompanies(data || []))
      .catch((err) => console.error("Lỗi tải danh sách công ty:", err));
  }, []);

  useEffect(() => {
    if (openCompanyModal && industries.length === 0) {
      getIndustries()
        .then((data) => setIndustries(data || []))
        .catch((err) => console.error("Lỗi tải danh sách ngành nghề:", err));
    }
  }, [openCompanyModal, industries]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // 1. Tạo JSON object cho thông tin text
    const userData = {
      fullName: form.fullName,
      email: form.email,
      role: form.role,
      password: form.password,
      companyId: form.role === "HR" ? form.companyId : null,
    };

    // 2. Gắn vào 'data' kèm theo Blob type application/json
    formData.append(
      "data",
      new Blob([JSON.stringify(userData)], { type: "application/json" })
    );

    // 3. Gắn file vào 'avatar'
    if (form.avatar) {
      formData.append("avatar", form.avatar);
    }

    onSubmit(formData);
  };

  const handleCreateCompanyQuick = async () => {
    try {
      const companyData = {
        companyName: newCompanyName,
        industryName: newCompanyIndustry,
      };
      const created = await createCompany(companyData);
      setCompanies((prev) => [...prev, created]);
      setForm((prev) => ({ ...prev, companyId: created.companyId }));
      setOpenCompanyModal(false);
      setNewCompanyName("");
      setNewCompanyIndustry("");
    } catch (error) {
      alert("Lỗi khi thêm nhanh công ty!");
    }
  };

  return (
    <>
      <Stack spacing={3} component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          name="fullName"
          label="Họ tên"
          fullWidth
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <TextField
          name="email"
          label="Email"
          type="email"
          fullWidth
          value={form.email}
          onChange={handleChange}
          required
        />

        <TextField
          name="password"
          label={initialData ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
          type="password"
          fullWidth
          value={form.password}
          onChange={handleChange}
          required={!initialData}
        />

        <TextField
          select
          name="role"
          label="Quyền"
          fullWidth
          value={form.role}
          onChange={handleChange}
          disabled={initialData?.role === "HR"}
        >
          {initialData?.role === "HR" ? (
            <MenuItem value="HR">HR</MenuItem>
          ) : (
            <>
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </>
          )}
        </TextField>

        {form.role === "HR" && (
          <Autocomplete
            value={companies.find((c) => c.companyId === form.companyId) || null}
            onChange={(event, newValue) => {
              if (newValue && newValue.inputValue) {
                setNewCompanyName(newValue.inputValue);
                setOpenCompanyModal(true);
              } else {
                setForm((prev) => ({
                  ...prev,
                  companyId: newValue ? newValue.companyId : "",
                }));
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const isExisting = options.some(
                (option) => inputValue.toLowerCase() === option.companyName.toLowerCase()
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push({
                  inputValue,
                  companyName: `+ Thêm mới công ty "${inputValue}"`,
                });
              }
              return filtered;
            }}
            options={companies}
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.companyName || "";
            }}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  {option.companyName}
                </li>
              );
            }}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label="Công ty"
                required
                placeholder="Tìm kiếm hoặc thêm mới..."
              />
            )}
          />
        )}

        <Button variant="outlined" component="label" fullWidth>
          {form.avatar ? `Đã chọn: ${form.avatar.name}` : "Upload Avatar"}
          <input type="file" hidden name="avatar" onChange={handleChange} accept="image/*" />
        </Button>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel} variant="text" color="inherit">Hủy</Button>
          <Button type="submit" variant="contained">Lưu</Button>
        </Stack>
      </Stack>

      {/* Dialog thêm nhanh công ty */}
      <Dialog open={openCompanyModal} onClose={() => setOpenCompanyModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Thêm nhanh công ty mới</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Tên công ty"
              fullWidth
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              required
            />
            <Autocomplete
              options={industries.map((ind) => ind.industryName)}
              freeSolo
              value={newCompanyIndustry}
              onChange={(event, newValue) => setNewCompanyIndustry(newValue || "")}
              onInputChange={(event, newInputValue) => setNewCompanyIndustry(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ngành nghề"
                  required
                  placeholder="Chọn hoặc tự nhập..."
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenCompanyModal(false)} variant="text" color="inherit">Hủy</Button>
          <Button
            onClick={handleCreateCompanyQuick}
            variant="contained"
            disabled={!newCompanyName.trim() || !newCompanyIndustry.trim()}
          >
            Lưu nhanh
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}