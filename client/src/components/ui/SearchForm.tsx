import { useState } from 'react';
import { BookOpenText, Calendar, Clock, Search, User } from 'lucide-react';
import type { SearchFilters } from '../../types/exam';
import { DEFAULT_EXAM_CONFIG } from '../../config/defaults';
import CustomSelect from './CustomSelect';

export default function SearchForm() {
    const [formData, setFormData] = useState<SearchFilters>({
        schoolYear: DEFAULT_EXAM_CONFIG.schoolYear,
        semester: DEFAULT_EXAM_CONFIG.semester,
        examType: DEFAULT_EXAM_CONFIG.examType,
        subjectCode: '',
        classTime: '',
        classDays: '',
        teacher: '',
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // API Call Here
        console.log('Form submitted: ', formData);
    };

    return (
        <div className="rounded-md bg-white border py-12 px-10 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-3xl font-bold text-center cpu-text cpu-blue"><BookOpenText className="w-8 h-8 inline mr-2" />CPU Exam Schedule Finder</h1>
            <h3 className="text-xl text-gray-400 font-medium text-center cpu-text">Find your exam schedule and room assignment quickly and easily</h3>
            {/* Form Fields */}
            {/* First row - Dropdowns */}
            <div className="grid grid-cols-3 gap-4 bg-cpu-beige px-4 py-4 rounded-md">
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
            <div className="grid grid-cols-4 gap-4 bg-amber-100 px-4 py-4 rounded-md">
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
            <button type="submit" className="w-full cpu-blue-bg text-white py-3 px-6 rounded-lg cpu-text font-semibold cursor-pointer">
                <Search className="w-5 h-5 inline mr-2" />
                Find My Exam Schedule
            </button>
        </form>
        </div>
        
    )
}