import { notification } from "antd";
import { SingleTask, SingleTaskDetail } from "../types/schdeule.type";


export const vaildateSchedule = (
    workSchedule: SingleTask[],
    isShowMessage?: boolean
) => {
    const changeField = workSchedule[workSchedule.length - 1];
    if (changeField.projectName === "") {
        !isShowMessage && notification.error({ message: "Project Name should not be empty" });
        return false;
    }
    if (!validateTaskDetail(changeField.taskDetail)) {
        !isShowMessage && notification.error({ message: "Task description and task type should not be empty" });
        return false;
    }
    return true;
};

export const validateTaskDetail = (taskDetails: SingleTaskDetail[]) => {
    return taskDetails.every((task) => task.description !== "" && task.taskType !== "");
};

export const capitalizeFirstLetter = (value: string) => {
    if (typeof value !== "string") return "";
    return value
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const getHoursProgressInfo = (totalHours: number) => {
    const maxHours = 9;
    const progressPercentage = Math.min((totalHours / maxHours) * 100, 200);
    let color;
    if (totalHours <= maxHours) {
        color = "green";
    } else if (totalHours > maxHours) {
        color = "#ce0800";
    }
    return { color, progressPercentage, maxHours }
}
