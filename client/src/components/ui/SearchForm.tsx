import { useState, useEffect } from 'react';
import { BookOpenText, Calendar, Clock, Search, User, Info } from 'lucide-react';
import type { ExamSchedule, SearchFilters } from '../../types/exam';
import { ApiService } from '../../services/api';
import { toast } from 'sonner';

interface SearchFormProps {
    onSearchResults: (results: ExamSchedule[]) => void;
    onReset?: () => void; // Optional reset callback
    resetTrigger?: number; // Trigger form reset from parent
    activeExamPeriod: ActiveExamPeriod; // Pass active exam period from parent
}

interface ActiveExamPeriod {
    school_year: string;
    semester: string;
    exam_type: string;
}

export default function SearchForm({ onSearchResults, onReset, resetTrigger, activeExamPeriod }: SearchFormProps) {
    const [formData, setFormData] = useState<SearchFilters>({
        schoolYear: '',
        semester: '',
        examType: '',
        subjectCode: '',
        classTime: '',
        classDays: '',
        teacher: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [, setError] = useState<string | null>(null);

    // Validation functions
    const validateSubjectCode = (code: string) => {
        // More lenient - allows various subject code formats
        return code.trim().length >= 3 && /[A-Za-z]/.test(code) && /\d/.test(code);
    };

    const validateClassTime = (time: string) => {
        // Allows patterns like "1300-1430", "0800-0930"
        return /^\d{4}-\d{4}$/.test(time.trim());
    };

    const validateClassDays = (days: string) => {
        // Allows MW, TTh, MWF, etc.
        return /^[MTWFSh]+$/i.test(days.trim());
    };

    const validateTeacher = (teacher: string) => {
        // More lenient - allows any teacher name format with minimum length
        return teacher.trim().length >= 2;
    };

    // Initialize form data with active exam period on component mount
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            schoolYear: activeExamPeriod.school_year,
            semester: activeExamPeriod.semester,
            examType: activeExamPeriod.exam_type,
        }));
    }, [activeExamPeriod]);

    // Reset form function (clears form AND results)
    const resetForm = () => {
        setFormData(prev => ({
            schoolYear: prev.schoolYear, // Keep exam period info
            semester: prev.semester,
            examType: prev.examType,
            subjectCode: '',
            classTime: '',
            classDays: '',
            teacher: '',
        }));
        setError(null);
        onReset?.(); // Call parent reset to clear results too
    };

    // Listen for reset trigger from parent (Search Again button)
    useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            resetForm();
        }
    }, [resetTrigger]);

    // Check if required field is filled AND properly formatted
    // Subject Code is always required, other fields are optional for flexible searching
    const isFormValid = formData.subjectCode.trim() !== '' && 
                       validateSubjectCode(formData.subjectCode) &&
                       // Only validate optional fields if they have values
                       (formData.classTime.trim() === '' || validateClassTime(formData.classTime)) &&
                       (formData.classDays.trim() === '' || validateClassDays(formData.classDays)) &&
                       (formData.teacher.trim() === '' || validateTeacher(formData.teacher));


    const handleInputChange = (field: keyof SearchFilters, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setError(null);

        setIsLoading(true);

        try {
            // Build API params - only include non-empty fields for flexible searching
            const apiParams: any = {
                subject_code: formData.subjectCode, // Always required
            };

            // Only add optional fields if they have values
            if (formData.classTime.trim() !== '') {
                apiParams.class_time = formData.classTime;
            }
            if (formData.classDays.trim() !== '') {
                apiParams.class_days = formData.classDays;
            }
            if (formData.teacher.trim() !== '') {
                apiParams.teacher = formData.teacher;
            }

            // Call the API
            const result = await ApiService.searchExamSchedule(apiParams);

            // Transform API results to ExamSchedule format
            const examSchedules: ExamSchedule[] = result.data.map((item, index) => ({
                id: `${item.subject_code || formData.subjectCode}-${Date.now()}-${index}`,
                schoolYear: formData.schoolYear,
                semester: formData.semester as 'First' | 'Second',
                examType: formData.examType as 'Prelim' | 'Midterm' | 'Final',
                subjectCode: item.subject_code || formData.subjectCode,
                classTime: item.class_time || formData.classTime || 'N/A',
                classDays: item.class_days || formData.classDays || 'N/A',
                teacher: item.teacher || formData.teacher || 'N/A',
                examDate: item.exam_date,
                examTimeSlot: `${item.start_time}-${item.end_time}`,
                room: item.exam_room,
                proctor: item.proctor,
                isRoomOnly: item.is_room_only || false
            }));

            onSearchResults(examSchedules);

            // Success toast
            const resultCount = examSchedules.length;
            const isRoomOnly = result.is_room_only;
            const displaySubjectCode = examSchedules[0]?.subjectCode || formData.subjectCode;
            
            toast.success('Exam Schedule Found!', {
                description: isRoomOnly 
                    ? `Found room assignments for ${displaySubjectCode}`
                    : `Found ${resultCount} exam schedule${resultCount > 1 ? 's' : ''} for ${displaySubjectCode}`,
                duration: 3000,
                className: 'cpu-text',
                closeButton: true,
                style: {
                    fontFamily: 'Consolas, Monaco, Menlo, Ubuntu Mono, monospace',
                    paddingRight: '40px',
                    textAlign: 'center'
                },
                classNames: {
                    closeButton: 'sonner-close-button-right'
                }
            });

        } catch (error: any) {
            // Check if it's a 404 (no results) vs other errors
            if (error.status === 404) {
                // No results found - trigger no results state
                onSearchResults([]);
                toast.error('No Results Found', {
                    description: 'No exam schedules match your search criteria.',
                    duration: 4000,
                    className: 'cpu-text',
                    closeButton: true,
                    style: {
                        fontFamily: 'Consolas, Monaco, Menlo, Ubuntu Mono, monospace',
                        paddingRight: '40px',
                        textAlign: 'center'
                    },
                    classNames: {
                        closeButton: 'sonner-close-button-right'
                    }
                });
            } else {
                // Server error or network error
                setError('Failed to fetch exam schedule. Please try again.');
                toast.error('Search Failed', {
                    description: 'There was an error searching for your exam schedule.',
                    duration: 4000,
                    className: 'cpu-text',
                    closeButton: true,
                    style: {
                        fontFamily: 'Consolas, Monaco, Menlo, Ubuntu Mono, monospace',
                        paddingRight: '40px',
                        textAlign: 'center'
                    },
                    classNames: {
                        closeButton: 'sonner-close-button-right'
                    }
                });
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="rounded-md bg-white border border-gray-100 py-12 px-10 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header with Clear Form button */}
            <div className="relative mb-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold cpu-text bg-gradient-to-r from-blue-800 to-yellow-400 bg-clip-text text-transparent">
                        <BookOpenText className="w-8 h-8 inline mr-2 text-blue-800" />CPU Exam Schedule Finder
                    </h1>
                    <h3 className="text-xl text-gray-400 font-medium cpu-text mt-2">
                        Find your exam schedule and room assignment quickly and easily
                    </h3>
                </div>
                <button 
                    type="button"
                    onClick={resetForm}
                    className="hidden sm:block absolute top-0 right-0 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 cpu-text rounded-md transition-colors duration-200"
                >
                    Clear Form
                </button>
            </div>
            {/* Form Fields */}
            {/* Active Exam Period Display */}
            <div className="bg-cpu-beige px-4 py-4 rounded-md border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <label className="block text-sm font-bold cpu-text cpu-blue">Current Exam Period</label>
                </div>
                <div className="cpu-text cpu-blue text-lg font-semibold text-center bg-white px-4 py-3 rounded-md border">
                    School Year {activeExamPeriod.school_year} • {activeExamPeriod.semester} Semester • {activeExamPeriod.exam_type} Exams
                </div>
            </div>
            {/* Second row - Text Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-amber-100 px-2 md:px-4 py-4 rounded-md">
                {/*Subject Code Text Entry*/}
                <div className="space-y-2">
                    <label className="block text-sm font-bold cpu-text cpu-blue">
                        <BookOpenText className="w-4 h-4 inline mr-1" />
                        Subject Code <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text"
                        value={formData.subjectCode}
                        onChange={(e) => handleInputChange('subjectCode', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border-gray-300 rounded-md cpu-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., GESocSci 4"
                        required
                     />
                </div>
                {/* Class Time Text Entry */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold cpu-text cpu-blue">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Class Time <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input 
                        type="text"
                        value={formData.classTime}
                        onChange={(e) => handleInputChange('classTime', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border-gray-300 rounded-md cpu-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 1430-1530"
                    />
                </div>
                {/* Class Days Text Entry */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold cpu-text cpu-blue">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Class Days <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input 
                        type="text"
                        value={formData.classDays}
                        onChange={(e) => handleInputChange('classDays', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border-gray-300 rounded-md cpu-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., MW or TTh"
                    />
                </div>
                {/*Teacher Text Entry*/}
                <div className="space-y-2">
                    <label className="block text-sm font-bold cpu-text cpu-blue">
                        <User className="w-4 h-4 inline mr-1" />
                        Teacher <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input 
                        type="text"
                        value={formData.teacher}
                        onChange={(e) => handleInputChange('teacher', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border-gray-300 rounded-md cpu-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Smith, Dr. Jones, or Garcia"
                    />
                </div>
            </div>
            
            {/* Search Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-blue-800 cpu-text text-sm">
                    <strong>💡 Search Tips:</strong> Enter just your Subject Code to see all sections, 
                    or add Teacher/Time/Days for more specific results.
                </p>
            </div>

            {/* Submit Button */}
            <button 
                type="submit"
                disabled={isLoading || !isFormValid} 
                className={`w-full py-3 px-6 rounded-lg cpu-text font-semibold transition-all duration-200 ${
                        (isLoading || !isFormValid)
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'       
                            : 'cpu-blue-bg text-white cursor-pointer cpu-button-shadow hover:shadow-lg hover:shadow-yellow-400/50'
                    }`}
            >
                <Search className="w-5 h-5 inline mr-2" />
                {isLoading ? 'Searching...' : 'Find My Exam Schedule'}
            </button>

            {/* Clear Form Button - Mobile Only */}
            <button 
                type="button"
                onClick={resetForm}
                className="sm:hidden w-full mt-3 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg cpu-text font-medium hover:bg-gray-200 transition-colors duration-200"
            >
                Clear Form
            </button>
        </form>
        </div>
        
    )
}