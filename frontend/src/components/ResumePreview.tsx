import { useRef, useState, useEffect } from "react";
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Award, Briefcase, GraduationCap, Code } from "lucide-react";
import { BuilderFormValues } from "../schemas/builderSchema.ts";

interface ResumePreviewProps {
  data: Partial<BuilderFormValues>;
}

// Section heading — styled with Papertrail teal ink bar accent
const SectionHeading = ({ icon: Icon, children }: { icon: any; children: string }) => (
  <div className="flex items-center gap-2 border-b border-[#C9D3C6] pb-1.5 mb-3">
    <Icon className="w-3.5 h-3.5 text-[#2C5F5B]" />
    <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#2C5F5B]">{children}</h3>
  </div>
);

export const ResumePreview = ({ data }: ResumePreviewProps) => {
  const { personal, summary, educations = [], experiences = [], projects = [], skills = [], certificates = [] } = data;
  const hasPersonal = personal && (personal.fullName || personal.email || personal.phone || personal.location);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.getBoundingClientRect().width;
      if (parentWidth < 794) {
        setScale(parentWidth / 794);
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex justify-center overflow-hidden"
      style={{ height: `${1123 * scale}px` }}
    >
      <div
        id="resume-preview-print"
        className="bg-white p-8 shadow-sm border border-[#C9D3C6] rounded-2xl text-[#1E3A34] flex flex-col justify-start select-none overflow-hidden shrink-0"
        style={{
          width: "794px",
          height: "1123px",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* ── 1. Personal Header ── */}
        {hasPersonal ? (
          <div className="border-b-2 border-[#1E3A34] pb-5 mb-5">
            <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl font-extrabold text-[#1E3A34] tracking-tight text-center">
              {personal.fullName || "Your Name"}
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-semibold text-[#3E5750] mt-2.5">
              {personal.email && (
                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#2C5F5B]" />{personal.email}</span>
              )}
              {personal.phone && (
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#2C5F5B]" />{personal.phone}</span>
              )}
              {personal.location && (
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#2C5F5B]" />{personal.location}</span>
              )}
              {personal.website && (
                <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-[#2C5F5B]" />{personal.website}</span>
              )}
              {personal.github && (
                <span className="flex items-center gap-1"><Github className="w-3 h-3 text-[#2C5F5B]" />{personal.github}</span>
              )}
              {personal.linkedin && (
                <span className="flex items-center gap-1"><Linkedin className="w-3 h-3 text-[#2C5F5B]" />{personal.linkedin}</span>
              )}
            </div>
          </div>
        ) : (
          <div className="border-b-2 border-dashed border-[#C9D3C6] pb-5 mb-5 text-center">
            <span className="font-mono text-[10px] text-[#5B6B60] italic">Fill in Personal info to see your header here...</span>
          </div>
        )}

        <div className="space-y-5 flex-grow">

          {/* ── 2. Summary ── */}
          {summary && (
            <div>
              <SectionHeading icon={Mail}>Professional Summary</SectionHeading>
              <p className="text-xs text-[#3E5750] leading-relaxed text-justify">{summary}</p>
            </div>
          )}

          {/* ── 3. Experience ── */}
          {experiences.length > 0 && (
            <div>
              <SectionHeading icon={Briefcase}>Work Experience</SectionHeading>
              <div className="space-y-3.5">
                {experiences.map((exp, i) => (
                  <div key={exp.id || i} className="text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-[#1E3A34]">
                        {exp.position} <span className="text-[#2C5F5B]">at {exp.company}</span>
                      </span>
                      <span className="text-[#5B6B60] font-mono text-[9px] font-semibold whitespace-nowrap ml-2">
                        {exp.start_date || "Start"} — {exp.is_current ? "Present" : (exp.end_date || "End")}
                      </span>
                    </div>
                    {exp.location && <div className="text-[9px] text-[#5B6B60] font-mono font-semibold mt-0.5">{exp.location}</div>}
                    {exp.description && (
                      <p className="text-[#3E5750] mt-1.5 leading-relaxed whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 4. Education ── */}
          {educations.length > 0 && (
            <div>
              <SectionHeading icon={GraduationCap}>Education</SectionHeading>
              <div className="space-y-3">
                {educations.map((edu, i) => (
                  <div key={edu.id || i} className="text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-[#1E3A34]">
                        {edu.degree || "Degree"} <span className="text-[#2C5F5B]">in {edu.field_of_study || "Field"}</span>
                      </span>
                      <span className="text-[#5B6B60] font-mono text-[9px] font-semibold whitespace-nowrap ml-2">
                        {edu.start_date || "Start"} — {edu.end_date || "End"}
                      </span>
                    </div>
                    <div className="text-[9px] text-[#5B6B60] font-mono font-semibold mt-0.5">{edu.institution}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 5. Projects ── */}
          {projects.length > 0 && (
            <div>
              <SectionHeading icon={Code}>Projects</SectionHeading>
              <div className="space-y-3.5">
                {projects.map((proj, i) => (
                  <div key={proj.id || i} className="text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-[#1E3A34]">
                        {proj.name}
                        {proj.role && <span className="text-[#5B6B60] font-normal ml-1.5">— {proj.role}</span>}
                      </span>
                      <span className="text-[#5B6B60] font-mono text-[9px] font-semibold whitespace-nowrap ml-2">
                        {proj.start_date} {proj.end_date ? `— ${proj.end_date}` : ""}
                      </span>
                    </div>
                    {proj.url && <div className="text-[9px] text-[#2C5F5B] font-mono font-semibold truncate mt-0.5">{proj.url}</div>}
                    {proj.description && (
                      <p className="text-[#3E5750] mt-1.5 leading-relaxed">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 6. Skills ── */}
          {skills.length > 0 && (
            <div>
              <SectionHeading icon={Code}>Skills</SectionHeading>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <span
                    key={skill.id || i}
                    className="bg-[#EFF3EC] border border-[#C9D3C6] rounded-md px-2 py-0.5 text-[#1E3A34] font-mono text-[9px] font-semibold inline-flex items-center gap-1"
                  >
                    {skill.name}
                    {skill.level && <span className="text-[#5B6B60] text-[8px]">· {skill.level}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── 7. Certificates ── */}
          {certificates.length > 0 && (
            <div>
              <SectionHeading icon={Award}>Certifications</SectionHeading>
              <div className="grid grid-cols-2 gap-3">
                {certificates.map((cert, i) => (
                  <div key={cert.id || i} className="text-xs">
                    <div className="font-bold text-[#1E3A34]">{cert.name}</div>
                    <div className="text-[9px] text-[#5B6B60] font-mono font-semibold mt-0.5">
                      {cert.issuer}{cert.issue_date ? ` · ${cert.issue_date}` : ""}
                    </div>
                    {cert.url && (
                      <div className="text-[9px] text-[#2C5F5B] font-mono font-semibold truncate mt-0.5">{cert.url}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
