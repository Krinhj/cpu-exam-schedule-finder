import { CalendarDays, Clock, MapPin, User, Building2, Users, BookOpenText } from "lucide-react";
import { format } from "date-fns";
import type { ExamSchedule } from "../../types/exam";

interface ExamResultsProps {
    results: ExamSchedule[];
}

// Format date from "2025-08-28" to "August 28, 2025"
const formatExamDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM dd, yyyy");
};

// Format time from "0700-0830" to "7:00-8:30 AM"
const formatExamTime = (timeString: string) => {
    const [startTime, endTime] = timeString.split('-');
    const formatTime = (time: string) => {
        const hour = parseInt(time.substring(0, 2));
        const minute = time.substring(2);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minute}`;
    };
    
    const start = formatTime(startTime);
    const end = formatTime(endTime);
    const startPeriod = parseInt(startTime.substring(0, 2)) >= 12 ? 'PM' : 'AM';
    const endPeriod = parseInt(endTime.substring(0, 2)) >= 12 ? 'PM' : 'AM';
    
    if (startPeriod === endPeriod) {
        return `${start}-${end} ${endPeriod}`;
    } else {
        return `${start} ${startPeriod}-${end} ${endPeriod}`;
    }
};

// Room-only subject card component
function RoomOnlyCard({ examSchedule, index }: { examSchedule: ExamSchedule; index: number }) {
    return (
        <div className="rounded-md bg-white border border-gray-100 px-4 sm:px-10 py-6 sm:py-12 shadow-md">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-4">
                <div className="flex items-center gap-3">
                    <Building2 className="cpu-text w-6 h-6 text-blue-600" />
                    <h1 className="cpu-text cpu-blue text-2xl sm:text-3xl font-semibold text-center sm:text-left">{examSchedule.subjectCode}</h1>
                    <span className="cpu-text text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded-full">Room Only</span>
                </div>
                <div className="flex justify-center sm:justify-end items-center gap-2 sm:gap-4">
                    <h3 className="cpu-text cpu-blue text-center text-xs sm:text-sm font-semibold rounded-3xl border px-2 py-1">{examSchedule.examType}</h3>
                    <h3 className="cpu-text cpu-blue text-center text-xs sm:text-sm font-semibold rounded-3xl bg-cpu-gold px-2 py-1">{examSchedule.semester} Semester {examSchedule.schoolYear}</h3>
                </div>
            </div>
            
            {/* Room-only specific layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-2 px-4 py-4 bg-cpu-beige rounded-sm flex items-center">
                    <CalendarDays className="cpu-text w-5 h-5 mr-3 flex-shrink-0" />
                    <div>
                        <label className="block text-md text-gray-600 font-medium cpu-text">Exam Date</label>
                        <h1 className="cpu-text cpu-blue font-bold text-xl">{formatExamDate(examSchedule.examDate)}</h1>
                    </div>
                </div>
                <div className="space-y-2 px-4 py-4 bg-amber-100 rounded-sm flex items-center">
                    <Clock className="cpu-text w-5 h-5 mr-3 flex-shrink-0" />
                    <div>
                        <label className="block text-md text-gray-600 font-medium cpu-text">Exam Time</label>
                        <h1 className="cpu-text cpu-blue font-bold text-xl">{formatExamTime(examSchedule.examTimeSlot)}</h1>
                    </div>
                </div>
            </div>
            
            {/* Room assignments section */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="cpu-text w-5 h-5 text-blue-600" />
                    <h3 className="cpu-text cpu-blue font-semibold text-lg">Room Assignments</h3>
                </div>
                <div className="cpu-text cpu-blue text-xl font-bold">
                    {examSchedule.room}
                </div>
                <p className="cpu-text text-sm text-gray-600 mt-2">
                    This subject has room-only assignments. No specific class schedules or teacher assignments are required.
                </p>
            </div>
        </div>
    );
}

// Regular exam schedule card component
function RegularExamCard({ examSchedule, index, totalResults }: { examSchedule: ExamSchedule; index: number; totalResults: number }) {
    return (
        <div className="rounded-md bg-white border border-gray-100 px-4 sm:px-10 py-6 sm:py-12 shadow-md">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-4">
                <div className="flex items-center gap-3">
                    <BookOpenText className="cpu-text w-6 h-6 text-blue-600" />
                    <h1 className="cpu-text cpu-blue text-2xl sm:text-3xl font-semibold text-center sm:text-left">{examSchedule.subjectCode}</h1>
                    {totalResults > 1 && <span className="cpu-text text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Section {index + 1}</span>}
                </div>
                <div className="flex justify-center sm:justify-end items-center gap-2 sm:gap-4">
                    <h3 className="cpu-text cpu-blue text-center text-xs sm:text-sm font-semibold rounded-3xl border px-2 py-1">{examSchedule.examType}</h3>
                    <h3 className="cpu-text cpu-blue text-center text-xs sm:text-sm font-semibold rounded-3xl bg-cpu-gold px-2 py-1">{examSchedule.semester} Semester {examSchedule.schoolYear}</h3>
                </div>
            </div>
            
            {/* Regular exam info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-2 px-4 py-4 bg-cpu-beige rounded-sm flex items-center">
                    <CalendarDays className="cpu-text w-5 h-5 mr-3 flex-shrink-0" />
                    <div>
                        <label className="block text-md text-gray-600 font-medium cpu-text">Exam Date</label>
                        <h1 className="cpu-text cpu-blue font-bold text-xl">{formatExamDate(examSchedule.examDate)}</h1>
                    </div>
                </div>
                <div className="space-y-2 px-4 py-4 bg-amber-100 rounded-sm flex items-center">
                    <MapPin className="cpu-text w-5 h-5 mr-3 flex-shrink-0" />
                    <div>
                        <label className="block text-md text-gray-600 font-medium cpu-text">Room</label>
                        <h1 className="cpu-text cpu-blue font-bold text-xl">{examSchedule.room}</h1>
                    </div>
                </div>
                <div className="space-y-2 px-4 py-4 bg-cpu-beige rounded-sm flex items-center">
                    <Clock className="cpu-text w-5 h-5 mr-3 flex-shrink-0" />
                    <div>
                        <label className="block text-md text-gray-600 font-medium cpu-text">Exam Time</label>
                        <h1 className="cpu-text cpu-blue font-bold text-xl">{formatExamTime(examSchedule.examTimeSlot)}</h1>
                    </div>
                </div>
                <div className="space-y-2 px-4 py-4 bg-amber-100 rounded-sm flex items-center">
                    <User className="cpu-text w-5 h-5 mr-3 flex-shrink-0" />
                    <div>
                        <label className="block text-md text-gray-600 font-medium cpu-text">Proctor</label>
                        <h1 className="cpu-text cpu-blue font-bold text-xl">{examSchedule.proctor}</h1>
                    </div>
                </div>
            </div>
            
            <hr className="mt-5 border-gray-400" />
            {/* Class Information Section */}
            <div className="mt-5">
                <h1 className="cpu-text font-medium text-center sm:text-left">Class Information</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 mt-5">
                    <div className="space-y-2 text-center sm:text-left">
                        <label className="cpu-text cpu-blue font-bold">Teacher:</label>
                        <h1 className="cpu-text font-extralight inline"> {examSchedule.teacher}</h1>
                    </div>
                    <div className="space-y-2 text-center sm:text-left">
                        <label className="cpu-text cpu-blue font-bold">Class Time:</label>
                        <h1 className="cpu-text font-extralight inline"> {examSchedule.classTime}</h1>
                    </div>
                    <div className="space-y-2 text-center sm:text-left">
                        <label className="cpu-text cpu-blue font-bold">Class Days:</label>
                        <h1 className="cpu-text font-extralight inline"> {examSchedule.classDays}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ExamResults({ results }: ExamResultsProps) {

    const isRoomOnly = results.length > 0 && results[0].isRoomOnly;
    const subjectCode = results[0]?.subjectCode || 'Unknown Subject';
    
    return (
        <div className="mt-15">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                    {isRoomOnly ? (
                        <Building2 className="cpu-text w-6 h-6 text-blue-600" />
                    ) : (
                        <Users className="cpu-text w-6 h-6 text-blue-600" />
                    )}
                    <h1 className="cpu-text cpu-blue text-xl sm:text-2xl font-semibold text-center sm:text-left">
                        {isRoomOnly ? 'Room Assignment Results' : 'Exam Schedule Results'}
                    </h1>
                </div>
                <h1 className="cpu-text cpu-blue text-center text-sm sm:text-xl font-semibold rounded-3xl bg-cpu-gold px-3 py-2 self-center sm:self-auto">
                    {results.length} Result{results.length !== 1 ? 's' : ''} Found
                </h1>
            </div>
            
            {/* Subject header for multiple results */}
            {results.length > 1 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h2 className="cpu-text cpu-blue text-xl font-semibold text-center">
                        {subjectCode} - Multiple Sections Found
                    </h2>
                    <p className="cpu-text text-sm text-gray-600 text-center mt-2">
                        Choose the section that matches your class schedule
                    </p>
                </div>
            )}
            
            {/* Cards container */}
            <div className="space-y-6 mt-6">
                {results.map((examSchedule, index) => 
                    examSchedule.isRoomOnly ? (
                        <RoomOnlyCard key={examSchedule.id} examSchedule={examSchedule} index={index} />
                    ) : (
                        <RegularExamCard key={examSchedule.id} examSchedule={examSchedule} index={index} totalResults={results.length} />
                    )
                )}
            </div>
        </div>
    )

}