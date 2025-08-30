import { useState } from 'react';
import SearchForm from '../components/ui/SearchForm';
import DisclaimerSection from '../components/ui/DisclaimerSection';
import { SquareArrowOutUpRight, Bug, BookOpen } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import ExamResults from '../components/ui/ExamResults';
import type { ExamSchedule } from '../types/exam';

export default function Index() {
    const [examResults, setExamResults] = useState<ExamSchedule[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [resetTrigger, setResetTrigger] = useState(0);

    const handleSearchResults = (results: ExamSchedule[]) => {
        setExamResults(results);
        setShowResults(results.length > 0);
        setNoResultsFound(results.length === 0);
        
        // Smooth scroll to results or no-results section
        setTimeout(() => {
            if (results.length > 0) {
                document.querySelector('#exam-results')?.scrollIntoView({ behavior: 'smooth' });
            } else {
                document.querySelector('#no-results')?.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const handleNoResults = () => {
        setExamResults([]);
        setShowResults(false);
        setNoResultsFound(true);
    };

    const handleReset = () => {
        setExamResults([]);
        setShowResults(false);
        setNoResultsFound(false);
        // Also trigger form reset
        setResetTrigger(Date.now());
    };

    return (
        <div className="min-h-screen cpu-beige py-8">
            <Toaster position="bottom-right" richColors />
            <div className="max-w-6xl mx-auto px-2 sm:px-4 space-y-4 sm:space-y-6">
                <DisclaimerSection />
                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                    <a 
                        href="https://cpu.edu.ph" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cpu-text cpu-blue">
                        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-cpu-gold cpu-text text-sm font-medium cpu-blue cursor-pointer">
                            <SquareArrowOutUpRight className="w-4 h-4 mr-2" />Visit the official CPU website
                        </button>
                    </a>
                    <button
                        onClick={() => {
                            toast('Bug Report', {
                                description: 'Please email your bug report to examschedulefinder@gmail.com with details about the issue.',
                                duration: 8000,
                                closeButton: true,
                                className: 'cpu-text',
                                style: {
                                    color: '#1e3a8a',
                                    fontFamily: 'Consolas, Monaco, Menlo, Ubuntu Mono, monospace'
                                },
                                classNames: {
                                    closeButton: 'sonner-close-button-right'
                                }
                            });
                        }}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-cpu-gold cpu-text text-sm font-medium cpu-blue cursor-pointer"
                    >
                        <Bug className="w-4 h-4 mr-2" />
                        Report Bug or Issue
                    </button>
                </div>
                <SearchForm onSearchResults={handleSearchResults} onReset={handleReset} resetTrigger={resetTrigger} />
                {showResults && (
                    <div id="exam-results">
                        <ExamResults results={examResults} />
                        <div className="text-center mt-6">
                            <button 
                                onClick={handleReset}
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg cpu-text font-medium hover:bg-gray-200 transition-colors duration-200"
                            >
                                Search Again
                            </button>
                        </div>
                    </div>
                )}
                {noResultsFound && (
                    <div id="no-results" className="mt-8">
                        <div className="rounded-md bg-white border border-gray-100 py-16 px-10 shadow-md text-center">
                            <div className="space-y-6">
                                {/* Graduation Cap Icon */}
                                <div className="flex justify-center">
                                    <BookOpen className="w-20 h-20 text-gray-400" />
                                </div>
                                
                                {/* Heading */}
                                <h2 className="text-2xl font-semibold cpu-text cpu-blue">No Exam Schedule Found</h2>
                                
                                {/* Description */}
                                <p className="text-gray-600 cpu-text max-w-lg mx-auto">
                                    No matching exam schedule found for the provided criteria. Please check your subject code, class time, class days, and teacher information.
                                </p>
                                
                                {/* Search Again Button */}
                                <div className="mt-6">
                                    <button 
                                        onClick={handleReset}
                                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg cpu-text font-medium hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        Search Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}