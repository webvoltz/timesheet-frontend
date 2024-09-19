import { Collapse, CollapseProps, Input, notification, Select } from "antd";
import React, { useEffect, useState } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { OptionArray } from "../../types/common.type";
import { SingleTask } from "../../types/schdeule.type";
import { validateTaskDetail } from "../../utils/common-functions";
import { calculateTaskTotalHours } from "../../utils/date-time-calculation";

type AddScheduleFormProps = {
    workSchedule: SingleTask[];
    setWorkSchedule: (e: SingleTask[]) => void;
    projectDetail: SingleTask;
    projectIndex: number;
    showBillingType?: boolean;
};

const AddScheduleForm = ({
    workSchedule,
    setWorkSchedule,
    projectDetail,
    projectIndex,
    showBillingType,
}: AddScheduleFormProps) => {
    const { data: taskTypeData } = useSelector((state: RootState) => state.taskType);
    const { data: projectOptionData } = useSelector((state: RootState) => state.projectOption);
    const { taskDetail, projectId, totalHours } = projectDetail;
    const { TextArea } = Input;
    const [projectOption, setProjectOption] = useState<OptionArray>([
        { label: "Project 1", value: "project1" },
        { label: "Project 2", value: "project2" },
        { label: "Project 3", value: "project3" },
    ]);
    const [taskTypeOption, setTaskTypeOption] = useState<OptionArray>([
        { label: "Client change", value: "clientChange" },
        { label: "Desgin", value: "desgin" },
        { label: "Development", value: "developmenet" },
    ]);
    const billingTypeOption = [
        { value: "Billable", label: "Billable" },
        { value: "Non Billable", label: "Non Billable" },
    ];

    const handleProjectSelectChange = (selectedValue: string) => {
        const changeDetail = [...workSchedule];
        const selectedOption = projectOption.find((option) => option.value === selectedValue);
        changeDetail[projectIndex] = {
            ...changeDetail[projectIndex],
            projectId: selectedValue,
            projectName: selectedOption ? selectedOption.label : "",
        };
        setWorkSchedule(changeDetail);
    };

    const handleTaskDetailChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        taskDetailIndex: number
    ) => {
        const { value, name } = e.target;
        const changeDetail = [...workSchedule];
        if (name === "hours") {
            // Validate if the input is a valid number and within the increments of 0.5 after the decimal
            const regex = /^\d*\.?\d{0,2}$/;
            if (!regex.test(value)) {
                return;
            }
            const [, decimalPart] = value.split(".");
            if (decimalPart && decimalPart.length === 2) {
                const decimalValue = decimalPart.split(".")[0][1] && parseFloat(decimalPart.split(".")[0][1]);
                if (decimalValue && decimalValue % 5 !== 0) {
                    return;
                }
            }
        }

        const updatedTaskDetail = [...changeDetail[projectIndex].taskDetail];
        updatedTaskDetail[taskDetailIndex] = {
            ...updatedTaskDetail[taskDetailIndex],
            [name]: value,
        };
        if (name === "hours") {
            const totalHours = calculateTaskTotalHours(updatedTaskDetail);
            changeDetail[projectIndex] = {
                ...changeDetail[projectIndex],
                taskDetail: updatedTaskDetail,
                totalHours,
            };
        } else {
            changeDetail[projectIndex] = {
                ...changeDetail[projectIndex],
                taskDetail: updatedTaskDetail,
            };
        }
        setWorkSchedule(changeDetail);
    };

    const handleTaskTypeChange = (e: string, taskDetailIndex: number, name: string) => {
        const changeDetail = [...workSchedule];
        const updatedTaskDetail = [...changeDetail[projectIndex].taskDetail];
        if (name === "taskStatus") {
            updatedTaskDetail[taskDetailIndex] = {
                ...updatedTaskDetail[taskDetailIndex],
                taskStatus: e,
            };
        } else {
            updatedTaskDetail[taskDetailIndex] = {
                ...updatedTaskDetail[taskDetailIndex],
                taskType: e,
            };
        }
        changeDetail[projectIndex] = {
            ...changeDetail[projectIndex],
            taskDetail: updatedTaskDetail,
        };
        setWorkSchedule(changeDetail);
    };

    const handleAddMoreTask = () => {
        const changeDetail = [...workSchedule];
        if (!validateTaskDetail(workSchedule[projectIndex].taskDetail)) {
            notification.error({ message: "Task description and task type should not be empty" });
            return;
        }
        const updatedTaskDetail = [
            ...changeDetail[projectIndex].taskDetail,
            { description: "", taskType: "", hours: 0 },
        ];
        changeDetail[projectIndex] = {
            ...changeDetail[projectIndex],
            taskDetail: updatedTaskDetail,
        };
        setWorkSchedule(changeDetail);
    };

    const handleRemoveTask = (taskDetailIndex: number) => {
        const changeDetail = [...workSchedule];
        const updatedTaskDetail = [...changeDetail[projectIndex].taskDetail];
        updatedTaskDetail.splice(taskDetailIndex, 1);
        changeDetail[projectIndex] = {
            ...changeDetail[projectIndex],
            taskDetail: updatedTaskDetail,
            totalHours: updatedTaskDetail.reduce((total, task) => total + (parseFloat(task.hours.toString()) || 0), 0),
        };

        setWorkSchedule(changeDetail);
    };

    const items: CollapseProps["items"] = [
        {
            key: "1",
            label: (
                <div className="accordian-head">
                    <Select
                        id="projectName"
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        className="custom-select text-sm text-[#667085] "
                        value={projectId ?? null}
                        onChange={(value) => handleProjectSelectChange(value)}
                        placeholder="Client / Project Name"
                        options={projectOption}
                    />
                    <div className="font-bold text-black">{totalHours}h</div>
                </div>
            ),
            children: (
                <div className="p-0">
                    <form className="w-full custom-form ">
                        {taskDetail.map((singleTaskDetail, taskDetailIndex) => {
                            const { description, taskType, hours, taskStatus = "" } = singleTaskDetail;
                            return (
                                <React.Fragment key={singleTaskDetail.taskType}>
                                    <div className="flex flex-wrap -mx-3 items-center pb-3 relative">
                                        <div className="grow  md:mb-0">
                                            <TextArea
                                                id="grid-city"
                                                placeholder="Enter task details"
                                                value={description}
                                                name="description"
                                                onChange={(e) => handleTaskDetailChange(e, taskDetailIndex)}
                                            />
                                        </div>
                                        {showBillingType && (
                                            <div className=" md:mb-0">
                                                <div className="relative">
                                                    <Select
                                                        id="grid-state"
                                                        value={taskStatus || null}
                                                        onChange={(e) =>
                                                            handleTaskTypeChange(e, taskDetailIndex, "taskStatus")
                                                        }
                                                        options={billingTypeOption}
                                                        placeholder="Select billing type"
                                                    />
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className=" md:mb-0">
                                            <div className="relative">
                                                <Select
                                                    id="grid-state"
                                                    value={taskType || null}
                                                    onChange={(e) =>
                                                        handleTaskTypeChange(e, taskDetailIndex, "taskType")
                                                    }
                                                    options={taskTypeOption}
                                                    placeholder="Select task type"
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" md:mb-0">
                                            <Input
                                                id="grid-zip"
                                                type="text"
                                                placeholder="Enter hours"
                                                addonAfter="Hours"
                                                value={hours}
                                                name="hours"
                                                onChange={(e) => handleTaskDetailChange(e, taskDetailIndex)}
                                            />
                                        </div>
                                        <div className="cursor-pointer plus-close">
                                            {taskDetail.length === 1 || taskDetail.length - 1 === taskDetailIndex ? (
                                                <>
                                                    <HiOutlinePlusCircle
                                                        className="ml-2 h-7 w-7 "
                                                        onClick={() => handleAddMoreTask()}
                                                    />
                                                    {taskDetail.length !== 1 &&
                                                        taskDetail.length - 1 === taskDetailIndex && (
                                                            <IoMdCloseCircleOutline
                                                                className="ml-2 h-7 w-7"
                                                                onClick={() => handleRemoveTask(taskDetailIndex)}
                                                            />
                                                        )}
                                                </>
                                            ) : (
                                                <IoMdCloseCircleOutline
                                                    className="ml-2 h-7 w-7"
                                                    onClick={() => handleRemoveTask(taskDetailIndex)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </form>
                </div>
            ),
        },
    ];

    useEffect(() => {
        if (taskTypeData) {
            const arr: OptionArray = [];
            taskTypeData.map((task) => {
                arr.push({ value: `${task.termTaxonomyId}`, label: task.name });
            });
            setTaskTypeOption([...arr]);
        }
    }, [taskTypeData]);

    useEffect(() => {
        if (projectOptionData) {
            const arr: OptionArray = [];
            projectOptionData.map((task) => {
                arr.push({ value: task.id, label: task.title });
            });
            setProjectOption([...arr]);
        }
    }, [projectOptionData]);

    return <Collapse items={items} expandIconPosition="end" defaultActiveKey={[1]} />;
};

export default AddScheduleForm;
