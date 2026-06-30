# 🚀 Quick Start Guide - User Pages

## 📁 Folder Structure

```
src/pages/user/
├── _shared/           # Shared resources
├── home/              # Home page
├── jobs/              # Jobs management
├── cv/                # CV tools
├── profile/           # User profile
├── legal/             # Legal pages
└── ARCHITECTURE.md    # Full architecture guide
```

---

## 🎯 For Page Developers

### **Creating a New Page**

```bash
# 1. Create folder structure
mkdir -p src/pages/user/my-feature/{components,hooks}

# 2. Create main page file
# src/pages/user/my-feature/index.jsx
import { useJobs } from '../_shared/hooks';

export function MyFeaturePage() {
  const { jobs, loading } = useJobs();
  
  return (
    <div>
      {/* Your JSX */}
    </div>
  );
}

# 3. Create sub-components (if needed)
# src/pages/user/my-feature/components/MyComponent.jsx

# 4. Export from index.js
export { default as MyFeaturePage } from './index';
export * from './components';
```

---

## 🔌 Common Hooks Usage

### **Get Jobs with Search**
```javascript
import { useJobs } from '../_shared/hooks';

const { 
  jobs, 
  loading, 
  searchParams, 
  updateSearchParams,
  handlePageChange,
  pagination 
} = useJobs();

// Search
updateSearchParams({ keyword: 'Developer', location: 'Hà Nội' });

// Paginate
handlePageChange(2);
```

### **Manage Favorites**
```javascript
import { useFavorites } from '../_shared/hooks';

const { 
  favoriteJobs, 
  toggleFavorite, 
  isFavorite 
} = useFavorites();

// Toggle
toggleFavorite(jobId);

// Check
if (isFavorite(jobId)) { /* ... */ }
```

### **Analyze CV**
```javascript
import { useCVAnalysis } from '../_shared/hooks';

const { 
  analysis, 
  loading, 
  evaluateCV, 
  analyzeCV 
} = useCVAnalysis();

// Evaluate
const result = await evaluateCV(file, 'Frontend Developer');

// Use result
const { score, strengths, weaknesses } = result;
```

### **Manage Applications**
```javascript
import { useApplications } from '../_shared/hooks';

const { 
  applications, 
  statusFilter, 
  setStatusFilter, 
  applyJob 
} = useApplications();

// Filter by status
setStatusFilter('PENDING');

// Apply for job
await applyJob(jobId, { cvId, coverLetter });
```

---

## 🎨 Shared Components

### **Atoms (Smallest)**
```javascript
import { 
  JobTypeChip, 
  ApplicationStatusBadge, 
  SalaryDisplay 
} from '../_shared/components';

// Usage
<JobTypeChip jobType="full-time" />
<ApplicationStatusBadge status="PENDING" />
<SalaryDisplay salaryRange="10 - 15 triệu" />
```

### **Molecules (Combined)**
```javascript
import { 
  JobCard, 
  ApplicationRow 
} from '../_shared/components';

// JobCard usage
<JobCard 
  job={job}
  isFavorite={isFavorite}
  onViewDetail={handleViewDetail}
  onToggleFavorite={handleToggleFavorite}
/>

// ApplicationRow in Table
<TableBody>
  {applications.map(app => (
    <ApplicationRow 
      key={app.applicationId}
      application={app}
      job={jobsMap[app.jobId]}
      onViewDetail={handleViewDetail}
      onCancel={handleCancel}
    />
  ))}
</TableBody>
```

---

## 📊 Constants & Types

### **Using Constants**
```javascript
import { 
  JOB_STATUS_CONFIG,
  JOB_TYPE_CONFIG,
  SEARCH_FILTERS,
  API_ENDPOINTS
} from '../_shared/constants';

// Example
const { label, color } = JOB_STATUS_CONFIG['PENDING'];
const { label: jobLabel, icon } = JOB_TYPE_CONFIG['full-time'];

// Render status badge
<Chip 
  label={JOB_STATUS_CONFIG[status].label}
  sx={{ color: JOB_STATUS_CONFIG[status].color }}
/>
```

### **Using Types (JSDoc)**
```javascript
/**
 * @param {IJob} job
 * @param {IJobApplication} application
 * @returns {JSX.Element}
 */
function MyComponent({ job, application }) {
  return <div>{job.title}</div>;
}
```

---

## 🔗 API Service Usage

### **Job Service**
```javascript
import { jobService } from '../services/user';

// List jobs
const jobs = await jobService.listJobs({ 
  keyword: 'Dev', 
  location: 'Hà Nội', 
  page: 0 
});

// Get single job
const job = await jobService.getJobDetail(jobId);

// Apply
await jobService.applyJob(jobId, { cvId });

// Favorites
await jobService.addToFavorite(jobId);
await jobService.removeFromFavorite(jobId);
```

### **CV Service**
```javascript
import { cvService } from '../services/user';

// Evaluate CV
const analysis = await cvService.evaluateCV(file, targetRole);

// Generate roadmap
const roadmap = await cvService.generateRoadmap(file, targetRole);
```

### **User Profile Service**
```javascript
import { userProfileService } from '../services/user';

// Get profile
const profile = await userProfileService.getProfile();

// Update profile
await userProfileService.updateProfile({ 
  fullName: 'John Doe', 
  headline: 'Developer' 
});
```

---

## 💡 Best Practices

### **✅ DO**
- Use hooks for state management
- Place shared components in `_shared/components/`
- Keep pages focused on layout & orchestration
- Use service layer for API calls
- Import from barrel exports (`_shared/hooks` not `_shared/hooks/useJobs.js`)

### **❌ DON'T**
- Call API directly in components (use hooks instead)
- Place page-specific components in `_shared/`
- Duplicate logic across pages (extract to hooks)
- Ignore error handling (use toast + error state)
- Hard-code constants (use `constants/` files)

---

## 🧪 Testing Components

```javascript
import { render, screen } from '@testing-library/react';
import { JobCard } from '../_shared/components';

describe('JobCard', () => {
  it('renders job title', () => {
    const job = { jobId: '1', title: 'React Developer' };
    render(<JobCard job={job} />);
    
    expect(screen.getByText('React Developer')).toBeInTheDocument();
  });
});
```

---

## 📚 More Information

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture guide.

