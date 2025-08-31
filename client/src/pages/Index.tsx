import { useState, useEffect } from 'react';
import SearchForm from '../components/ui/SearchForm';
import DisclaimerSection from '../components/ui/DisclaimerSection';
import Footer from '../components/ui/Footer';
import DatabaseDownPage from './DatabaseDown';
import NoActiveExamPeriodPage from './NoActiveExamPeriod';
import { SquareArrowOutUpRight, Bug, BookOpen } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import ExamResults from '../components/ui/ExamResults';
import { ApiService } from '../services/api';
import type { ExamSchedule } from '../types/exam';

interface ActiveExamPeriod {
    school_year: string;
    semester: string;
    exam_type: string;
}

export default function Index() {
    const [examResults, setExamResults] = useState<ExamSchedule[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [resetTrigger, setResetTrigger] = useState(0);
    
    // App state management
    const [activeExamPeriod, setActiveExamPeriod] = useState<ActiveExamPeriod | null>(null);
    const [isLoadingActivePeriod, setIsLoadingActivePeriod] = useState(true);
    const [isDatabaseDown, setIsDatabaseDown] = useState(false);
    const [noActiveExamPeriod, setNoActiveExamPeriod] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);

    // Fetch active exam period function
    const fetchActiveExamPeriod = async (isRetryAttempt = false) => {
        try {
            if (isRetryAttempt) {
                setIsRetrying(true);
            } else {
                setIsLoadingActivePeriod(true);
            }
            
            // TEMPORARY: For testing Database Down page - uncomment next line
            // throw new Error('Network error occurred');
            
            const result = await ApiService.getActiveExamPeriod();
            setActiveExamPeriod(result.data);
            setIsDatabaseDown(false);
            setNoActiveExamPeriod(false);
        } catch (error: any) {
            console.error('Failed to fetch active exam period:', error);
            
            // Distinguish between different error types
            if (error.status === 404) {
                // No active exam period found - this is normal between exam periods
                setNoActiveExamPeriod(true);
                setIsDatabaseDown(false);
            } else if (error.status === 0 || error.status === 500 || error.message === 'Network error occurred') {
                // Network error, server error, or test error - database is likely down
                setIsDatabaseDown(true);
                setNoActiveExamPeriod(false);
            } else {
                // Default to database down for any other errors
                setIsDatabaseDown(true);
                setNoActiveExamPeriod(false);
            }
        } finally {
            if (isRetryAttempt) {
                setIsRetrying(false);
            } else {
                setIsLoadingActivePeriod(false);
            }
        }
    };

    // Fetch active exam period on component mount
    useEffect(() => {
        fetchActiveExamPeriod();
    }, []);

    // Retry function for error pages
    const handleRetry = () => {
        fetchActiveExamPeriod(true);
    };

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

    // Removed handleNoResults - functionality moved to handleSearchResults

    const handleReset = () => {
        setExamResults([]);
        setShowResults(false);
        setNoResultsFound(false);
        // Also trigger form reset
        setResetTrigger(Date.now());
    };

    // Show loading state while checking active exam period
    if (isLoadingActivePeriod) {
        return (
            <div className="min-h-screen cpu-beige flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-pulse">
                        <h1 className="text-2xl font-bold cpu-text cpu-blue">
                            Loading Exam Schedule Finder...
                        </h1>
                    </div>
                </div>
            </div>
        );
    }

    // Show appropriate error page based on the error type
    if (isDatabaseDown) {
        return (
            <div className="min-h-screen cpu-beige py-8">
                <Toaster position="bottom-right" richColors />
                <div className="max-w-6xl mx-auto px-2 sm:px-4 space-y-4 sm:space-y-6">
                    <DisclaimerSection />
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
                </div>
                <div className="mt-6">
                    <DatabaseDownPage onRetry={handleRetry} isRetrying={isRetrying} />
                </div>
                <div className="mt-6">
                    <Footer />
                </div>
            </div>
        );
    }

    if (noActiveExamPeriod) {
        return (
            <div className="min-h-screen cpu-beige py-8">
                <Toaster position="bottom-right" richColors />
                <div className="max-w-6xl mx-auto px-2 sm:px-4 space-y-4 sm:space-y-6">
                    <DisclaimerSection />
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
                </div>
                <div className="mt-6">
                    <NoActiveExamPeriodPage onRetry={handleRetry} isRetrying={isRetrying} />
                </div>
                <div className="mt-6">
                    <Footer />
                </div>
            </div>
        );
    }

    // Normal operation - show main search form
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
                <SearchForm 
                    onSearchResults={handleSearchResults} 
                    onReset={handleReset} 
                    resetTrigger={resetTrigger}
                    activeExamPeriod={activeExamPeriod!} 
                />
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
                <Footer />
            </div>
        </div>
    )
}