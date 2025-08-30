interface ApiResponse {
    exam_date: string;
    start_time: string;
    end_time: string;
    exam_room: string;
    proctor: string;
}

interface SearchParams {
    subject_code: string;
    class_time: string;
    class_days: string;
    teacher: string;
}

export class ApiService {
    private static BASE_URL = 'http://localhost:3000/api';

    static async searchExamSchedule(params: SearchParams): Promise<ApiResponse> {
        try {
            const url = new URL(`${this.BASE_URL}/exam-schedule`);
            url.searchParams.append('subject_code', params.subject_code);
            url.searchParams.append('class_time', params.class_time);
            url.searchParams.append('class_days', params.class_days);
            url.searchParams.append('teacher', params.teacher);

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

            return data.data;
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