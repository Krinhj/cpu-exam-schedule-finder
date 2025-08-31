import { RefreshCw, Database, AlertTriangle } from 'lucide-react';

interface DatabaseDownPageProps {
    onRetry: () => void;
    isRetrying?: boolean;
}

export default function DatabaseDownPage({ onRetry, isRetrying = false }: DatabaseDownPageProps) {
    return (
        <div className="px-4 py-4">
            <div className="max-w-4xl w-full mx-auto text-center">
                <div className="mb-6">
                    <Database className="w-16 h-16 mx-auto text-gray-400" />
                </div>
                
                <h1 className="cpu-text cpu-blue text-3xl font-bold mb-4">
                    Database Temporarily Unavailable
                </h1>
                
                <p className="cpu-text text-gray-600 text-base mb-6 leading-relaxed">
                    The exam schedule database is currently inactive due to no recent activity. 
                    This is normal during periods when there are no upcoming exams.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-gray-600 text-lg">😴</span>
                        </div>
                        <h3 className="cpu-text font-semibold text-gray-800 mb-2">Database Sleeping</h3>
                        <p className="cpu-text text-gray-600 text-sm">Free tier database goes to sleep after inactivity</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-md">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-blue-600 text-lg">⚡</span>
                        </div>
                        <h3 className="cpu-text font-semibold text-gray-800 mb-2">Auto-Recovery</h3>
                        <p className="cpu-text text-gray-600 text-sm">Will wake up when admins turn it on again</p>
                    </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h3 className="cpu-text text-red-800 font-semibold mb-2">🔧 Technical Issue</h3>
                    <p className="cpu-text text-red-800 text-sm">
                        This is a temporary technical issue with the free database service. The database will automatically 
                        wake up when admins reactivate it or during active exam periods. Try refreshing in a few moments.
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
                    {isRetrying ? 'Waking Database...' : 'Try Again'}
                </button>
            </div>
        </div>
    );
}