import { useState, useEffect } from 'react';
import { BookOpenText, Calendar, Clock, Search, User } from 'lucide-react';
import type { ExamSchedule, SearchFilters } from '../../types/exam';
import { DEFAULT_EXAM_CONFIG } from '../../config/defaults';
import CustomSelect from './CustomSelect';
import { ApiService } from '../../services/api';
import { toast } from 'sonner';

interface SearchFormProps {
    onSearchResults: (results: ExamSchedule[]) => void;
    onReset?: () => void; // Optional reset callback
    resetTrigger?: number; // Trigger form reset from parent
}

export default function SearchForm({ onSearchResults, onReset, resetTrigger }: SearchFormProps) {
    const [formData, setFormData] = useState<SearchFilters>({
        schoolYear: DEFAULT_EXAM_CONFIG.schoolYear,
        semester: DEFAULT_EXAM_CONFIG.semester,
        examType: DEFAULT_EXAM_CONFIG.examType,
        subjectCode: '',
        classTime: '',
        classDays: '',
        teacher: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        // Allows "Prof. LastName, F." or "LastName, F."
        return teacher.trim().length > 3 && teacher.includes(',');
    };

    // Reset form function (clears form AND results)
    const resetForm = () => {
        setFormData({
            schoolYear: DEFAULT_EXAM_CONFIG.schoolYear,
            semester: DEFAULT_EXAM_CONFIG.semester,
            examType: DEFAULT_EXAM_CONFIG.examType,
            subjectCode: '',
            classTime: '',
            classDays: '',
            teacher: '',
        });
        setError(null);
        onReset?.(); // Call parent reset to clear results too
    };

    // Listen for reset trigger from parent (Search Again button)
    useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            resetForm();
        }
    }, [resetTrigger]);

    // Check if all required fields are filled AND properly formatted
    const isFormValid = formData.subjectCode.trim() !== '' && 
                       formData.classTime.trim() !== '' && 
                       formData.classDays.trim() !== '' && 
                       formData.teacher.trim() !== '' &&
                       validateSubjectCode(formData.subjectCode) &&
                       validateClassTime(formData.classTime) &&
                       validateClassDays(formData.classDays) &&
                       validateTeacher(formData.teacher);

    // Dropdown options
    const schoolYearOptions = [
        { value: '2025-2026', label: '2025-2026' },
        { value: '2024-2025', label: '2024-2025' },
        { value: '2023-2024', label: '2023-2024' }
    ];

    const semesterOptions = [
        { value: 'First', label: 'First' },
        { value: 'Second', label: 'Second' }
    ];

    const examTypeOptions = [
        { value: 'Prelim', label: 'Prelim' },
        { value: 'Midterm', label: 'Midterm' },
        { value: 'Final', label: 'Final' }
    ];

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
            const apiParams = {
                subject_code: formData.subjectCode,
                class_time: formData.classTime,
                class_days: formData.classDays,
                teacher: formData.teacher,
            };

            // Call the API
            const result = await ApiService.searchExamSchedule(apiParams);

            // Success
            const examSchedule: ExamSchedule= {
                id: `${formData.subjectCode}-${Date.now()}`,
                schoolYear: formData.schoolYear,
                semester: formData.semester as 'First' | 'Second',
                examType: formData.examType as 'Prelim' | 'Midterm' | 'Final',
                subjectCode: formData.subjectCode,
                classTime: formData.classTime,
                classDays: formData.classDays,
                teacher: formData.teacher,
                examDate: result.exam_date,
                examTimeSlot: `${result.start_time}-${result.end_time}`,
                room: result.exam_room,
                proctor: result.proctor,
            };

            onSearchResults([examSchedule]);

            // Success toast
            toast.success('Exam Schedule Found!', {
                description: `Found exam for ${formData.subjectCode}`,
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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 space-y-3 sm:space-y-0">
                <div className="text-center sm:flex-1">
                    <h1 className="text-3xl font-bold cpu-text cpu-blue">
                        <BookOpenText className="w-8 h-8 inline mr-2" />CPU Exam Schedule Finder
                    </h1>
                    <h3 className="text-xl text-gray-400 font-medium cpu-text mt-2">
                        Find your exam schedule and room assignment quickly and easily
                    </h3>
                </div>
                <button 
                    type="button"
                    onClick={resetForm}
                    className="hidden sm:block px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 cpu-text rounded-md transition-colors duration-200"
                >
                    Clear Form
                </button>
            </div>
            {/* Form Fields */}
            {/* First row - Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-cpu-beige px-2 md:px-4 py-4 rounded-md">
                {/* School Year Dropdown */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold cpu-text cpu-blue">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        School Year
                    </label>
                    <CustomSelect
                        options={schoolYearOptions}
                        value={formData.schoolYear}
                        onChange={(value) => handleInputChange('schoolYear', value)}
                    />
                </div>
                {/* Semester Dropdown */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold cpu-text cpu-blue">
                        Semester
                    </label>
                    <CustomSelect
                        options={semesterOptions}
                        value={formData.semester}
                        onChange={(value) => handleInputChange('semester', value)}
                    />
                </div>
                {/* Exam Type Dropdown */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold cpu-text cpu-blue">
                        Exam Type
                    </label>
                    <CustomSelect
                        options={examTypeOptions}
                        value={formData.examType}
                        onChange={(value) => handleInputChange('examType', value)}
                    />
                </div>
            </div>
            {/* Second row - Text Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-amber-100 px-2 md:px-4 py-4 rounded-md">
                {/*Subject Code Text Entry*/}
                <div className="space-y-2">
                    <label className="block text-sm font-bold cpu-text cpu-blue">
                        <BookOpenText className="w-4 h-4 inline mr-1" />
                        Subject Code
                    </label>
                    <input 
                        type="text"
                        value={formData.subjectCode}
                        onChange={(e) => handleInputChange('subjectCode', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border-gray-300 rounded-md cpu-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., GESocSci 4"
                     />
                </div>
                {/* Class Time Text Entry */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold cpu-text cpu-blue">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Class Time
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
                        Class Days
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
                        Teacher
                    </label>
                    <input 
                        type="text"
                        value={formData.teacher}
                        onChange={(e) => handleInputChange('teacher', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border-gray-300 rounded-md cpu-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Prof. Doe, J."
                    />
                </div>
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