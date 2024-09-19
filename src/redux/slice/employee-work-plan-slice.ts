import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getEmployeeWorkPlan } from "../../graphql/schedule.graphql";
import { APOLLO_CLIENT } from "../../services/apollo";
import { QueryError } from "../../types/error.type";
import { IndividualSchedule, ScheduleSlice, SliceResponse } from "../../types/schdeule.type";

const initialData: SliceResponse = {
    updatedDataAndTime: '',
    projectDetail: []
}

const initialState: ScheduleSlice = {
    data: {
        schedule: initialData,
        update: initialData,
        tomorrow: initialData,
    },
    loading: false,
    error: null,
}
export const fetchEmployeeWorkPlan = createAsyncThunk<IndividualSchedule, { userId: string }, { rejectValue: QueryError }>(
    "query/fetchEmployeeWorkPlan",
    async ({ userId }, { rejectWithValue }) => {
        try {
            const query = getEmployeeWorkPlan(userId);
            const response = await APOLLO_CLIENT.query({ query, fetchPolicy: 'network-only' });
            return response.data;
        } catch (error: unknown) {
            let errorMessage = "An unknown error occurred";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "string") {
                errorMessage = error;
            }
            return rejectWithValue({ message: errorMessage });
        }
    }
);

const querySlice = createSlice({
    name: "query",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployeeWorkPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeWorkPlan.fulfilled, (state, action: PayloadAction<IndividualSchedule>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchEmployeeWorkPlan.rejected, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message || "An unknown error occurred";
                }
            });
    },
});

export default querySlice.reducer;