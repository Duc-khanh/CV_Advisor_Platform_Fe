const fs = require('fs');
const path = require('path');
const files = [
  'src/pages/public/ForEmployers.jsx',
  'src/pages/user/AppliedJobs.jsx',
  'src/pages/user/CareerGuide.jsx',
  'src/pages/user/CareerGuideDetail.jsx',
  'src/pages/user/CareerRoadmap.jsx',
  'src/pages/user/CVAnalysis.jsx',
  'src/pages/user/CVBuilder.jsx',
  'src/pages/user/FavoriteJobs.jsx',
  'src/pages/user/JobDetail.jsx',
  'src/pages/user/PrivacyPolicy.jsx',
  'src/pages/user/SearchResults.jsx',
  'src/pages/user/UserHome.jsx',
  'src/pages/user/UserProfile.jsx',
];

for (const rel of files) {
  const filePath = path.resolve(rel);
  if (!fs.existsSync(filePath)) {
    console.log('Missing', rel);
    continue;
  }

  let text = fs.readFileSync(filePath, 'utf8');
  let updated = text
    .replace(/import\s+UserLayout\s+from\s+['\"][^'\"]*UserLayout['\"];?\r?\n/g, '')
    .replace(/<UserLayout>\s*/g, '')
    .replace(/<\/UserLayout>\s*/g, '');

  if (updated !== text) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('Updated', rel);
  }
}
