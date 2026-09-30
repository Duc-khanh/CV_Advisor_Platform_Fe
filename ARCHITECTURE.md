# 📚 User Pages Architecture Guide

## 🏗️ Cấu Trúc Thư Mục

```
src/pages/user/
│
├── _shared/                          # ← Shared resources cho tất cả user pages
│   ├── types/                        # ← Domain types & interfaces
│   │   ├── job.types.js
│   │   ├── cv.types.js
│   │   ├── user.types.js
│   │   └── index.js
│   │
│   ├── constants/                    # ← Constants, config, enums
│   │   ├── job.constants.js          # Job status, types, categories
│   │   ├── cv.constants.js           # CV scoring, constraints
│   │   ├── api.constants.js          # API endpoints
│   │   └── index.js
│   │
│   ├── hooks/                        # ← Custom React hooks
│   │   ├── useJobs.js               # Hook để fetch & search công việc
│   │   ├── useFavorites.js          # Hook để quản lý yêu thích
│   │   ├── useCVAnalysis.js         # Hook để phân tích CV
│   │   ├── useApplications.js       # Hook để quản lý ứng tuyển
│   │   └── index.js
│   │
│   ├── components/                   # ← Reusable components
│   │   ├── atoms/                   # ← Smallest building blocks
│   │   │   ├── JobTypeChip.jsx
│   │   │   ├── ApplicationStatusBadge.jsx
│   │   │   ├── SalaryDisplay.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── molecules/               # ← Combine multiple atoms
│   │   │   ├── JobCard.jsx
│   │   │   ├── ApplicationRow.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── organisms/               # ← Complex components
│   │   │   └── index.js
│   │   │
│   │   └── index.js (exports all)
│   │
│   ├── layouts/                      # ← Layout components
│   │   └── (To be organized from components/)
│   │
│   └── index.js (barrel export)
│
├── home/                             # ← Home page & sections
│   ├── index.jsx                     # ← UserHome page
│   ├── sections/                     # ← Sub-components
│   │   ├── HeroSection.jsx
│   │   ├── JobListSection.jsx
│   │   ├── JobCategoriesSection.jsx
│   │   ├── HowItWorksSection.jsx
│   │   ├── HomeCTASection.jsx
│   │   └── LastCvAnalysisSection.jsx
│   │
│   ├── hooks/                        # ← Home-specific hooks
│   │   └── useHomeData.js
│   │
│   └── index.js (exports)
│
├── jobs/                             # ← Job management pages
│   ├── list/                         # ← AppliedJobs page
│   │   ├── index.jsx
│   │   ├── components/
│   │   └── hooks/
│   │
│   ├── favorites/                    # ← FavoriteJobs page
│   │   ├── index.jsx
│   │   ├── components/
│   │   └── hooks/
│   │
│   ├── detail/                       # ← JobDetail page
│   │   ├── index.jsx
│   │   ├── components/
│   │   │   └── ApplyModal.jsx       # ← Extracted from JobDetail
│   │   └── hooks/
│   │
│   └── index.js (exports)
│
├── cv/                               # ← CV management pages
│   ├── builder/                      # ← CVBuilder page
│   │   ├── index.jsx
│   │   ├── components/
│   │   └── hooks/
│   │
│   ├── analysis/                     # ← CVAnalysis page
│   │   ├── index.jsx
│   │   ├── components/
│   │   │   └── CVAnalysisResult.jsx
│   │   └── hooks/
│   │
│   ├── roadmap/                      # ← CareerRoadmap page
│   │   ├── index.jsx
│   │   ├── components/               # ← Use existing career-roadmap
│   │   └── hooks/
│   │
│   └── index.js (exports)
│
├── profile/                          # ← UserProfile page
│   ├── index.jsx
│   ├── components/
│   └── hooks/
│
├── legal/                            # ← Legal pages
│   ├── privacy.jsx                   # ← PrivacyPolicy
│   └── index.js
│
└── index.js (main barrel export)
```

---

## 🎯 Architectural Patterns

### **1. Component Hierarchy**

```
Atoms (Smallest)
  ├── JobTypeChip
  ├── ApplicationStatusBadge
  └── SalaryDisplay

    ↓ Combine ↓

Molecules (Combine atoms)
  ├── JobCard (uses JobTypeChip, SalaryDisplay)
  └── ApplicationRow (uses ApplicationStatusBadge)

    ↓ Combine ↓

Organisms (Complex components)
  └── (To be defined for major sections)

    ↓ Use ↓

Pages (Full page components)
  ├── UserHome
  ├── AppliedJobs
  └── JobDetail
```

---

## 🔌 Hooks Pattern

### **Custom Hooks (in `_shared/hooks/`)**

```javascript
// useJobs.js - Manages job listing & search
const { jobs, loading, pagination, searchParams, updateSearchParams } = useJobs();

// useFavorites.js - Manages favorite jobs
const { favoriteJobs, toggleFavorite, isFavorite } = useFavorites();

// useCVAnalysis.js - Manages CV analysis
const { analysis, loading, evaluateCV, analyzeCV } = useCVAnalysis();

// useApplications.js - Manages job applications
const { applications, applyJob, statusFilter } = useApplications();
```

### **Page-Specific Hooks (in each page folder)**

```javascript
// pages/user/home/hooks/useHomeData.js
// - Combine multiple hooks
// - Orchestrate complex logic
```

---

## 📊 Service Layer

Located in `src/services/user/`:

```javascript
// jobService.js
export const jobService = {
  listJobs,           // GET /api/public/jobs
  getJobDetail,       // GET /api/public/jobs/:id
  applyJob,           // POST /api/user/jobs/apply/:id
  getMyApplications,  // GET /api/user/jobs/apply/my-applications
  getFavoriteJobs,    // GET /api/user/jobs/favorite/all
  toggleFavorite,     // POST/DELETE /api/user/jobs/favorite/:id
};

// cvService.js
export const cvService = {
  evaluateCV,         // POST /api/v1/ai/evaluate-cv
  analyzeCV,          // POST /api/v1/ai/analyze-cv
  generateRoadmap,    // POST /api/v1/ai/generate-roadmap
};

// userProfileService.js
export const userProfileService = {
  getProfile,         // GET /api/user/profile
  updateProfile,      // PATCH /api/user/profile/update
};
```

---

## 🎨 Constants Structure

### **job.constants.js**
- `JOB_STATUS_CONFIG` - Status colors & labels
- `JOB_TYPE_CONFIG` - Job type icons & labels
- `JOB_CATEGORIES` - Category list
- `SEARCH_FILTERS` - Filter options

### **cv.constants.js**
- `CV_CONSTRAINTS` - File upload rules
- `CV_SCORE_THRESHOLDS` - Score boundaries
- `CV_SCORE_LABELS` - Score labels
- `CV_SCORE_COLORS` - Score colors

### **api.constants.js**
- `API_ENDPOINTS` - All API endpoints
- `API_METHODS` - HTTP methods

---

## 📝 Types Structure

### **job.types.js**
```javascript
export const JOB_TYPES = { FULL_TIME, PART_TIME, ... }
export const APPLICATION_STATUS = { PENDING, REVIEWING, ... }

/**@typedef {Object} IJob */
/**@typedef {Object} IJobApplication */
/**@typedef {Object} IJobCategory */
```

### **cv.types.js**
```javascript
/**@typedef {Object} ICVAnalysis */
/**@typedef {Object} ICareerRoadmap */
/**@typedef {Object} ICVFile */
```

### **user.types.js**
```javascript
/**@typedef {Object} IUserProfile */
/**@typedef {Object} IUserExperience */
/**@typedef {Object} IUserEducation */
```

---

## 🚀 Usage Examples

### **Example 1: Using useJobs Hook**

```javascript
import { useJobs } from '../_shared/hooks';

export function UserHome() {
  const { jobs, loading, pagination, updateSearchParams } = useJobs();

  return (
    <div>
      <JobListSection 
        jobs={jobs}
        loading={loading}
        pagination={pagination}
      />
    </div>
  );
}
```

### **Example 2: Using JobCard Component**

```javascript
import { JobCard } from '../_shared/components/molecules';
import { useFavorites } from '../_shared/hooks';

export function JobList() {
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <Grid container spacing={2}>
      {jobs.map(job => (
        <Grid item xs={12} sm={6} md={4} key={job.jobId}>
          <JobCard 
            job={job}
            isFavorite={isFavorite(job.jobId)}
            onToggleFavorite={toggleFavorite}
            onViewDetail={handleViewDetail}
          />
        </Grid>
      ))}
    </Grid>
  );
}
```

### **Example 3: API Call through Service**

```javascript
import { jobService } from '../services/user';

// Inside a component or hook
const handleSearch = async (keyword, location) => {
  const data = await jobService.listJobs({
    keyword,
    location,
    page: 0,
    pageSize: 12,
  });
  setJobs(data.content);
};
```

---

## ✅ Best Practices

### **1. Import Paths**
```javascript
// ✅ Good - Use barrel exports
import { useJobs, useFavorites } from '../_shared/hooks';
import { JobCard, ApplicationRow } from '../_shared/components/molecules';

// ❌ Avoid - Direct imports
import useJobs from '../_shared/hooks/useJobs';
```

### **2. Component Placement**
```javascript
// ✅ Shared across multiple pages → _shared/components/
// ✅ Used in one page → pages/user/jobs/detail/components/

// ❌ Don't mix page-specific and shared components
```

### **3. Hook Usage**
```javascript
// ✅ Orchestrate complex logic in hooks
const { jobs, loading, error } = useJobs();

// ✅ Keep components focused on rendering
// ❌ Avoid API calls directly in components
```

### **4. Error Handling**
```javascript
// ✅ Hooks handle errors + show toast
const { error, loading } = useCVAnalysis();

// ✅ Components just check and display
{error && <Alert severity="error">{error}</Alert>}
```

---

## 🔄 Migration Guide (From Old Structure)

### **Old Files → New Location**

| Old Path | New Path | Notes |
|----------|----------|-------|
| UserHome.jsx | pages/user/home/index.jsx | Main page |
| HeroSection.jsx | pages/user/home/sections/ | Sub-component |
| CVBuilder.jsx | pages/user/cv/builder/index.jsx | Main page |
| ApplyModal.jsx | pages/user/jobs/detail/components/ | Extract from JobDetail |
| AIAnalysisCard.jsx | pages/user/_shared/components/molecules/ | Reusable |

---

## 📦 Exports Structure

### **`_shared/index.js`** (Main barrel export)
```javascript
export * from "./types";
export * from "./constants";
export * from "./hooks";
export * from "./components";
```

### **`home/index.js`** (Home page export)
```javascript
export { default as UserHome } from "./index";
export * from "./sections";
export * from "./hooks";
```

### **`jobs/index.js`** (Jobs module export)
```javascript
export { default as AppliedJobs } from "./list/index";
export { default as FavoriteJobs } from "./favorites/index";
export { default as JobDetail } from "./detail/index";
```

---

## 🎓 Next Steps

1. **Move existing files** to new structure
2. **Update imports** in all files
3. **Extract sub-components** from pages
4. **Refactor pages** to use shared hooks & components
5. **Add TypeScript** (optional but recommended)
6. **Add unit tests** for hooks & utilities
7. **Add Storybook** for component library

---

## 📞 Support

For component usage questions, refer to JSDoc comments in each file.

