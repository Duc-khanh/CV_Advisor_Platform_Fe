import React, { forwardRef } from 'react';

const ModernTemplate = forwardRef(({ data }, ref) => {
  if (!data) return null;

  return (
    <div ref={ref} className="bg-white text-gray-800 p-8 shadow-sm h-full" style={{ width: '100%', minHeight: '1056px', boxSizing: 'border-box' }}>
      {/* Header section */}
      <div className="flex flex-col items-center border-b-2 border-blue-600 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wider">{data.personalInfo.fullName || 'Tên của bạn'}</h1>
        <h2 className="text-xl text-blue-600 font-semibold mb-4">{data.personalInfo.title || 'Vị trí công việc'}</h2>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {data.personalInfo.email && <span>📧 {data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
          {data.personalInfo.address && <span>📍 {data.personalInfo.address}</span>}
          {data.personalInfo.linkedin && <span>🔗 {data.personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        
        {/* Left Column: Summary, Education, Skills */}
        <div className="col-span-1 space-y-6">
          
          {/* Summary */}
          {data.summary && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3 uppercase">Mục tiêu nghề nghiệp</h3>
              <p className="text-sm text-gray-700 leading-relaxed text-justify">{data.summary}</p>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3 uppercase">Học vấn</h3>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                    <p className="text-sm text-blue-600">{edu.school}</p>
                    <p className="text-xs text-gray-500 italic">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3 uppercase">Kỹ năng</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Experience, Projects */}
        <div className="col-span-2 space-y-6">
          
          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3 uppercase">Kinh nghiệm làm việc</h3>
              <div className="space-y-5">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-4 border-l-2 border-blue-200">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5"></div>
                    <h4 className="font-bold text-gray-800 text-base">{exp.role}</h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-blue-600">{exp.company}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
});

export default ModernTemplate;
