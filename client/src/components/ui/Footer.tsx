import { Github } from 'lucide-react';

export default function Footer() {
    return (
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="cpu-text text-gray-500 text-sm">
                Built by{' '}
                <a 
                    href="https://github.com/Krinhj" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cpu-blue hover:text-blue-800 font-medium inline-flex items-center gap-1"
                >
                    <Github className="w-4 h-4" />
                    @Krinhj
                </a>
            </p>
        </div>
    );
}