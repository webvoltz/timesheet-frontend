import { Tag } from "antd";
import { FaRegCopy } from "react-icons/fa";
import { SingleTask } from "../../../types/schdeule.type";
import { capitalizeFirstLetter } from "../../../utils/common-functions";
import { CopySingleWork } from "../../../utils/copy-work";
import { calculateTaskTotalHours } from "../../../utils/date-time-calculation";

type TomorrowPlanProps = {
    tomorrowIndex: number;
    taskDetailData: SingleTask;
    isOnlyPlan?: boolean;
};
export function TomorrowPlan({ tomorrowIndex, taskDetailData, isOnlyPlan }: Readonly<TomorrowPlanProps>) {
    return (
        <div className={`tomorrow-sheet ${!isOnlyPlan ? "border-t" : ""} pt-4`} key={tomorrowIndex}>
            {isOnlyPlan && (
                <h3 className="text-sm font-bold flex items-center">
                    Tomorrow’s Plan | {capitalizeFirstLetter(taskDetailData.projectName!)} (
                    {calculateTaskTotalHours(taskDetailData.taskDetail)}h) &nbsp; <Tag color="blue">NEW</Tag>
                    <button onClick={() => CopySingleWork("Tomorrow plan", taskDetailData)}>
                        <FaRegCopy className="mr-2 h-5 w-5 cursor-pointer" />
                    </button>
                </h3>
            )}
            {!isOnlyPlan && (
                <h2 className="text-sm font-bold mb-2 flex gap-2 items-center">
                    Tomorrow’s Plan ({calculateTaskTotalHours(taskDetailData.taskDetail)}h){" "}
                    <button onClick={() => CopySingleWork("Tomorrow plan", taskDetailData)}>
                        <FaRegCopy className="mr-2 h-5 w-5 cursor-pointer" />
                    </button>
                </h2>
            )}
            <ul className="py-2 ">
                {taskDetailData.taskDetail.map((taskData) => (
                    <li className="text-sm" key={taskData.taskType}>
                        - {taskData.description} <span className="font-medium text-black">({taskData.hours}h)</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
