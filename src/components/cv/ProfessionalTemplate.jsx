import React, { forwardRef } from 'react';

const ProfessionalTemplate = forwardRef(({ data }, ref) => {
  if (!data) return null;

  return (
    <div ref={ref} className="bg-white text-gray-900 p-10 font-serif h-full" style={{ width: '100%', minHeight: '1056px', boxSizing: 'border-box' }}>
      {/* Header section */}
      <div className="border-b-4 border-gray-800 pb-6 mb-6 flex flex-col items-center">
        <h1 className="text-5xl font-bold uppercase tracking-widest text-center mb-2">{data.personalInfo.fullName || 'Tên của bạn'}</h1>
        <h2 className="text-2xl font-light text-gray-600 mb-4">{data.personalInfo.title || 'Vị trí công việc'}</h2>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm font-sans text-gray-700">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.address && <span>• {data.personalInfo.address}</span>}
          {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-8">
        {/* Summary */}
        {data.summary && (
          <section>
            <h3 className="text-xl font-bold uppercase tracking-wider text-gray-800 mb-3 border-b border-gray-300 pb-1">Tóm tắt</h3>
            <p className="text-base text-gray-700 leading-relaxed text-justify">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h3 className="text-xl font-bold uppercase tracking-wider text-gray-800 mb-4 border-b border-gray-300 pb-1">Kinh nghiệm</h3>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-lg text-gray-900">{exp.role}</h4>
                    <span className="text-sm font-sans font-semibold text-gray-600">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-md font-semibold text-gray-700 mb-2 italic">{exp.company}</div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line ml-4 list-disc list-inside">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section>
            <h3 className="text-xl font-bold uppercase tracking-wider text-gray-800 mb-4 border-b border-gray-300 pb-1">Học vấn</h3>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-baseline">
                  <div>
                    <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                    <p className="text-gray-700 italic">{edu.school}</p>
                  </div>
                  <span className="text-sm font-sans text-gray-600">{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h3 className="text-xl font-bold uppercase tracking-wider text-gray-800 mb-3 border-b border-gray-300 pb-1">Kỹ năng</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm">
              {data.skills.map((skill, index) => (
                <span key={index} className="text-gray-800 flex items-center before:content-['•'] before:mr-2 before:text-gray-400">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
});

export default ProfessionalTemplate;
