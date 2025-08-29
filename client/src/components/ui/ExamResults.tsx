import { useState } from "react";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";
import { format } from "date-fns";
import type { ExamSchedule } from "../../types/exam";

export default function ExamResults() {
    const [results, setResults] = useState<ExamSchedule[]>([]);
    const mockResults: ExamSchedule[] = [
        {
            id: "1",
            schoolYear: "2025-2026",
            semester: "First",
            examType: "Prelim",
            subjectCode: "ELS 2227",
            classTime: "1300-1430",
            classDays: "MWF",
            teacher: "Prof. Parcia, G",
            examDate: "2025-08-28",
            examTimeSlot: "0700-0830",
            room: "LHB102",
            proctor: "Prof. Ganza, P"
        }
    ];

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

    return (
        <div className="mt-15">
            <div className="flex justify-between items-center">
                {/* Exam Results Text*/}
                <h1 className="cpu-text cpu-blue text-2xl font-semibold">Exam Schedule Results</h1>
                <h1 className="cpu-text cpu-blue text-center text-xl font-semibold rounded-3xl bg-cpu-gold px-3 py-2">
                    {mockResults.length} Result{mockResults.length !== 1 ? 's' : ''} Found
                </h1>
            </div>
            
            {/* Main Exam Results Container*/}
            <div className="rounded-md bg-white border border-gray-100 px-10 py-12 mt-6 shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="cpu-text cpu-blue text-3xl font-semibold">{mockResults[0].subjectCode}</h1>
                    {/* Exam Type and Semester Badges */}
                    <div className="flex justify-between items-center gap-4">
                        <h3 className="cpu-text cpu-blue text-center text-sm font-semibold rounded-3xl border px-2 py-1">{mockResults[0].examType}</h3>
                        <h3 className="cpu-text cpu-blue text-center text-sm font-semibold rounded-3xl bg-cpu-gold px-2 py-1">{mockResults[0].semester} Semester {mockResults[0].schoolYear}</h3>
                    </div>
                </div>
                {/* 4 Card Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* First Row*/}
                    <div className="space-y-2 px-4 py-4 bg-cpu-beige rounded-sm flex items-center">
                        <CalendarDays className="cpu-text w-5 h-5 mr-3 flex-shrink-0" />
                        <div>
                            <label className="block text-md text-gray-600 font-medium cpu-text">
                                Exam Date
                            </label>
                            <h1 className="cpu-text cpu-blue font-bold text-xl">{formatExamDate(mockResults[0].examDate)}</h1>
                        </div>

                    </div>
                    <div className="space-y-2 px-4 py-4 bg-amber-100 rounded-sm flex items-center">
                        <MapPin className="cpu-text w-5 h-5 mr-3 flex-shrink-0" />
                        <div>
                            <label className="block text-md text-gray-600 font-medium cpu-text">
                                Room
                            </label>
                            <h1 className="cpu-text cpu-blue font-bold text-xl">{mockResults[0].room}</h1>
                        </div>
                    </div>
                    {/* Second Row*/}
                    <div className="space-y-2 px-4 py-4 bg-cpu-beige rounded-sm flex items-center">
                        <Clock className="cpu-text w-5 h-5 mr-3 flex-shrink-0"></Clock>
                        <div>
                            <label className="block text-md text-gray-600 font-medium cpu-text">
                                Exam Time
                            </label>
                            <h1 className="cpu-text cpu-blue font-bold text-xl">{formatExamTime(mockResults[0].examTimeSlot)}</h1>
                        </div>
                    </div>
                    <div className="space-y-2 px-4 py-4 bg-amber-100 rounded-sm flex items-center">
                        <User className="cpu-text w-5 h-5 mr-3 flex-shrink-0" />
                        <div>
                            <label className="block text-md text-gray-600 font-medium cpu-text">
                                Proctor
                            </label>
                            <h1 className="cpu-text cpu-blue font-bold text-xl">{mockResults[0].proctor}</h1>
                        </div>
                    </div>
                </div>
                <hr className="mt-5 border-gray-400" />
                {/* Class Information Section*/}
                <div className="mt-5">
                    <h1 className="cpu-text font-medium">Class Information</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 mt-5">
                        <div className="space-y-2">
                            <label className="cpu-text cpu-blue font-bold">
                                Teacher: 
                            </label>
                            <h1 className="cpu-text font-extralight inline"> {mockResults[0].teacher}</h1>
                        </div>
                        <div className="space-y-2">
                            <label className="cpu-text cpu-blue font-bold">
                                Class Time: 
                            </label>
                            <h1 className="cpu-text font-extralight inline"> {mockResults[0].classTime}</h1>
                        </div>
                        <div className="space-y-2">
                            <label className="cpu-text cpu-blue font-bold">
                                Class Days: 
                            </label>
                            <h1 className="cpu-text font-extralight inline"> {mockResults[0].classDays}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}