import React from 'react';
import { GraduationCap, Calendar } from 'lucide-react';
import { localStore } from '@/services/localStore';
import { AcademicCourse } from '@/types';
import { formatShortISTDate } from '@/lib/date-utils';

export const AcademicPage: React.FC = () => {
  const [courses, setCourses] = React.useState<AcademicCourse[]>([]);

  React.useEffect(() => {
    async function loadData() {
      const data = await localStore.getAcademicCourses();
      setCourses(data);
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>B.Tech CSE · Semester 3 Syllabus & Attendance</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Academic Manager
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          University performance remains foundational. When examinations approach, enable Exam Mode from the top bar to auto-adjust extracurricular engineering load.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-surface border border-border rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border text-emerald-400">
                  {course.code} · {course.credits} Credits
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{course.name}</h3>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-white">{course.attendancePct}%</div>
                <div className="text-[10px] text-muted font-mono uppercase">Attendance</div>
              </div>
            </div>

            {/* Syllabus Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Syllabus Covered</span>
                <span>{course.syllabusProgress}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${course.syllabusProgress}%` }}
                />
              </div>
            </div>

            {/* Upcoming Deadlines / Exams */}
            {course.upcomingExams.length > 0 && (
              <div className="pt-2 border-t border-border space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Upcoming Assessment
                </div>
                {course.upcomingExams.map((exam, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-background border border-border rounded-lg text-xs flex items-center justify-between"
                  >
                    <span className="text-white font-medium">{exam.title}</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {formatShortISTDate(exam.date)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
