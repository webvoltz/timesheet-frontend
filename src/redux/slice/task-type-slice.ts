import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APOLLO_CLIENT } from "../../services/apollo";
import { TASK_TYPE } from "../../graphql/schedule.graphql";
import { TaskTypeResponse } from "../../types/schdeule.type";
import { QueryError } from "../../types/error.type";

export const fetchTaskType = createAsyncThunk<TaskTypeResponse[], void, { rejectValue: QueryError }>(
    "query/fetchTaskType",
    async (_, { rejectWithValue }) => {
        try {
            const response = await APOLLO_CLIENT.query({ query: TASK_TYPE });
            return response.data.taskTypes.nodes;
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
    initialState: {
        data: null as TaskTypeResponse[] | null,
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaskType.fulfilled, (state, action: PayloadAction<TaskTypeResponse[]>) => {
                state.data = action.payload;
            })
            .addCase(fetchTaskType.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message || "An unknown error occurred";
                }
            });
    },
});

export default querySlice.reducer;
