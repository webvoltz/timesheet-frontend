import { notification } from "antd";
import dayjs from "dayjs";
import { IndividualSchedule, OperationName, SingleTask } from "../types/schdeule.type";
import { capitalizeFirstLetter } from "./common-functions";
import { calculateTaskTotalHours } from "./date-time-calculation";

const formattedDate = dayjs().format('DD-MM-YYYY'); // Use current date or format as needed

export const CopyClipboard = (formattedPlan: string) => {
    // Copying to clipboard
    navigator.clipboard.writeText(formattedPlan)
        .then(() => {
            notification.open({
                message: 'Work Plan copied to clipboard', placement: 'top', style: {
                    width: 250,
                },
            });
        })
        .catch((err) => {
            notification.error({ message: `Failed to copy text: ${err}`, });
        });
};

const NestedWorkPlan = (projectData: SingleTask[]) => {
    return `
${projectData.map((project) =>
        `
Project Name: ${capitalizeFirstLetter(project.projectName!)} (${calculateTaskTotalHours(project.taskDetail)}h)
---------------------------------
${project.taskDetail.map(task => `- ${task.description} (${task.hours}h)`).join('\n')}
`.trim()
    ).join('\n---------------------------------\n')}   
`
}

export const CopySingleWork = (workAction: string, projectData: SingleTask) => {
    const formattedPlan = `
Work ${workAction} : ${formattedDate}
=============================
Project Name: ${capitalizeFirstLetter(projectData.projectName!)} (${calculateTaskTotalHours(projectData.taskDetail)}h)
---------------------------------
${projectData.taskDetail.map(task => `- ${task.description} (${task.hours}h)`).join('\n')}
`.trim();
    CopyClipboard(formattedPlan);

};

export const CopyAllWork = (workAction: OperationName, workData: IndividualSchedule) => {
    const projectData = workData[workAction].projectDetail;
    const clipboardData = `
Work ${workAction} : ${formattedDate}
=============================
${NestedWorkPlan(projectData)}   
${workAction === 'update' && workData.tomorrow.projectDetail.length > 0 &&
        `\n=============================
Tomorrow's Plan:
---------------------------------
${NestedWorkPlan(workData.tomorrow.projectDetail)}
        `
        }
`;
    CopyClipboard(clipboardData);
};