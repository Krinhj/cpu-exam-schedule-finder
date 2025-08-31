interface ApiResponseItem {
    exam_date: string;
    start_time: string;
    end_time: string;
    exam_room: string;
    proctor: string;
    subject_code?: string;
    class_time?: string;
    class_days?: string;
    teacher?: string;
    is_room_only: boolean;
}

interface ApiResponse {
    success: boolean;
    data: ApiResponseItem[];
    total_results: number;
    is_room_only: boolean;
}

interface SearchParams {
    subject_code: string; // Always required
    class_time?: string;  // Optional
    class_days?: string;  // Optional
    teacher?: string;     // Optional
}

interface ActiveExamPeriod {
    school_year: string;
    semester: string;
    exam_type: string;
}

interface ActiveExamPeriodResponse {
    success: boolean;
    data: ActiveExamPeriod;
}

export class ApiService {
    private static BASE_URL = 'http://localhost:3000/api';

    static async getActiveExamPeriod(): Promise<ActiveExamPeriodResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/active-exam-period`);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    const error = new Error(data.message || 'No active exam period found');
                    (error as any).status = 404;
                    throw error;
                } else {
                    const error = new Error(data.message || 'Failed to fetch active exam period');
                    (error as any).status = response.status;
                    throw error;
                }
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            
            if (error instanceof Error && (error as any).status) {
                throw error;
            }
            
            const networkError = new Error('Network error occurred');
            (networkError as any).status = 0;
            throw networkError;
        }
    }

    static async searchExamSchedule(params: SearchParams): Promise<ApiResponse> {
        try {
            const url = new URL(`${this.BASE_URL}/exam-schedule`);
            
            // Always include subject_code (required)
            url.searchParams.append('subject_code', params.subject_code);
            
            // Only include optional parameters if they are provided
            if (params.class_time) {
                url.searchParams.append('class_time', params.class_time);
            }
            if (params.class_days) {
                url.searchParams.append('class_days', params.class_days);
            }
            if (params.teacher) {
                url.searchParams.append('teacher', params.teacher);
            }

            const response = await fetch(url.toString());
            const data = await response.json();

            if (!response.ok) {
                // Create specific error types for different HTTP status codes
                if (response.status === 404) {
                    const error = new Error(data.message || 'No exam schedule found');
                    (error as any).status = 404;
                    throw error;
                } else {
                    const error = new Error(data.message || 'Failed to fetch exam schedule');
                    (error as any).status = response.status;
                    throw error;
                }
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            
            // If it's not a fetch error (like network issues), re-throw as is
            if (error instanceof Error && (error as any).status) {
                throw error;
            }
            
            // For network errors, create a generic error
            const networkError = new Error('Network error occurred');
            (networkError as any).status = 0;
            throw networkError;
        }
    }
}