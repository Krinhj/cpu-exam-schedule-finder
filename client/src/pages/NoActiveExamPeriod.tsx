import { Calendar, RefreshCw } from 'lucide-react';

interface NoActiveExamPeriodPageProps {
    onRetry: () => void;
    isRetrying?: boolean;
}

export default function NoActiveExamPeriodPage({ onRetry, isRetrying = false }: NoActiveExamPeriodPageProps) {
    return (
        <div className="px-4 py-4">
            <div className="max-w-4xl w-full mx-auto text-center">
                <div className="mb-6">
                    <Calendar className="w-16 h-16 mx-auto text-blue-600" />
                </div>
                
                <h1 className="cpu-text cpu-blue text-3xl font-bold mb-4">
                    No Active Exam Period
                </h1>
                
                <p className="cpu-text text-gray-600 text-base mb-6 leading-relaxed">
                    There is currently no active exam period set. This typically means:
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-red-600 text-lg">✓</span>
                        </div>
                        <h3 className="cpu-text font-semibold text-gray-800 mb-2">Current Exams Ended</h3>
                        <p className="cpu-text text-gray-600 text-sm">The current exam period has concluded</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-md">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-yellow-600 text-lg">⏳</span>
                        </div>
                        <h3 className="cpu-text font-semibold text-gray-800 mb-2">Next Period Pending</h3>
                        <p className="cpu-text text-gray-600 text-sm">The next exam period hasn't been activated yet</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-md">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-blue-600 text-lg">📋</span>
                        </div>
                        <h3 className="cpu-text font-semibold text-gray-800 mb-2">Schedules Preparing</h3>
                        <p className="cpu-text text-gray-600 text-sm">Exam schedules are being prepared</p>
                    </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="cpu-text text-blue-800 font-semibold mb-2">📅 What to do:</h3>
                    <p className="cpu-text text-blue-800 text-sm">
                        Check back later or visit the <strong>official CPU website</strong> to see if exam schedules 
                        have been published. We'll update this tool as soon as the official schedules are available.
                    </p>
                </div>
                
                <button 
                    onClick={onRetry}
                    disabled={isRetrying}
                    className={`px-6 py-3 rounded-lg cpu-text font-semibold transition-all duration-200 ${
                        isRetrying
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    }`}
                >
                    <RefreshCw className={`w-6 h-6 inline mr-3 ${isRetrying ? 'animate-spin' : ''}`} />
                    {isRetrying ? 'Checking for Updates...' : 'Check for Updates'}
                </button>
            </div>
        </div>
    );
}