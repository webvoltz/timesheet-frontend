import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import morningSchedule from "../../assets/images/morning_schedule.png";
import nightSchedule from "../../assets/images/night_schedule.png";
import DisplayDate from "../../component/display-date";
import Spinner from "../../component/loader";
import WorkPlan from "../../component/work-plan";
import { fetchEmployeeWorkPlan } from "../../redux/slice/employee-work-plan-slice";
import { fetchProjectOption } from "../../redux/slice/project-option-slice";
import { fetchTaskType } from "../../redux/slice/task-type-slice";
import { AppDispatch, RootState } from "../../store";
import { compareDate } from "../../utils/date-time-calculation";

const TodayTimesheet = () => {
    const [isWorkScheduleExist, setIsWorkScheduleExist] = useState(false);
    const [isWorkUpdateExist, setIsWorkUpdateExist] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { data: employeeWorkPlan, loading, error } = useSelector((state: RootState) => state.employeeWorkPlan);
    const { data: userData } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (userData?.viewer) {
            dispatch(fetchEmployeeWorkPlan({ userId: userData.viewer.userId }));
            dispatch(fetchTaskType());
            const isTeamLeader = userData?.viewer?.userrole?.includes("team_leader");
            dispatch(fetchProjectOption({ userId: userData.viewer.userId, isTeamLeader }));
        }
    }, [userData]);

    useEffect(() => {
        if (employeeWorkPlan) {
            setIsWorkScheduleExist(employeeWorkPlan?.schedule ? compareDate(employeeWorkPlan.schedule) : false);
            setIsWorkUpdateExist(employeeWorkPlan?.update ? compareDate(employeeWorkPlan.update) : false);
        }
    }, [employeeWorkPlan]);

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <Spinner loading={loading}>
            <DisplayDate />
            {/* Work Schedule */}
            <WorkPlan
                scheduleTitle={"Work schedule"}
                scheduleicon={morningSchedule}
                operationName={"schedule"}
                isWorkExist={isWorkScheduleExist}
                workData={employeeWorkPlan}
            />
            {isWorkScheduleExist && (
                <>
                    {/* Work Update */}
                    <WorkPlan
                        scheduleTitle={"Work update"}
                        operationName={"update"}
                        scheduleicon={nightSchedule}
                        isWorkExist={isWorkUpdateExist}
                        workData={employeeWorkPlan}
                    />
                </>
            )}
        </Spinner>
    );
};

export default TodayTimesheet;
