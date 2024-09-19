export interface SingleTaskDetail {
    description: string;
    taskType: string;
    hours: number | string;
    taskStatus?: string;
}

export interface SingleTask {
    projectName?: string;
    name?: string;
    projectId?: string;
    datetime?: string;
    totalHours?: number;
    taskDetail: SingleTaskDetail[];
}

export type OperationName = "update" | "schedule" | "tomorrow";

export interface TaskTypeResponse {
    name: string;
    termTaxonomyId: number;
}

export interface ProjectResponse {
    id: string;
    title: string;
}

export interface SliceResponse {
    updatedDataAndTime: string;
    projectDetail: SingleTask[];
}

export interface IndividualSchedule {
    schedule: SliceResponse;
    update: SliceResponse;
    tomorrow: SliceResponse;
}

export interface ScheduleSlice {
    data: IndividualSchedule;
    loading: boolean;
    error: string | null;
}