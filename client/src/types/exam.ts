export interface ExamSchedule {
    id: string;
    schoolYear: string;
    semester: 'First' | 'Second';
    examType: 'Prelim' | 'Midterm' | 'Final';
    subjectCode: string;
    classTime: string;
    classDays: string;
    teacher: string;
    examDate: string; // ISO date string
    examTimeSlot: string;
    room: string;
    proctor: string;
    isRoomOnly?: boolean; // New field for room-only subjects
}

export interface SearchFilters {
    schoolYear: string;
    semester: string;
    examType: string;
    subjectCode: string;
    classTime: string;
    classDays: string;
    teacher: string;
}