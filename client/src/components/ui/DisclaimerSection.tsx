import { TriangleAlert } from "lucide-react";

export default function DisclaimerSection() {
    return (
        <div className="bg-orange-50 border border-amber-300 rounded-md px-4 py-4">
            <div className="flex items-center">
                <TriangleAlert className="w-5 h-5 mr-3 cpu-blue flex-shrink-0" />
                <p className="cpu-text text-amber-800 font-medium text-sm">
                    <span className="font-semibold">Important</span>: This is an unofficial tool created by students for students. Always cross-reference with the official CPU exam schedule to ensure accuracy.
                </p>
            </div>
        </div>
    );
}