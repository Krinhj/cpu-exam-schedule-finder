import SearchForm from '../components/ui/SearchForm';
import DisclaimerSection from '../components/ui/DisclaimerSection';
import { SquareArrowOutUpRight, Bug } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import ExamResults from '../components/ui/ExamResults';

export default function Index() {
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
                <SearchForm />
                <ExamResults />
            </div>
        </div>
    )
}