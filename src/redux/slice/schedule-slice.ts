import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getWorkScheduleQuery } from "../../graphql/schedule.graphql";
import { APOLLO_CLIENT } from "../../services/apollo";
import { QueryError } from "../../types/error.type";
import { ScheduleSlice, SliceResponse } from "../../types/schdeule.type";

const initialData: SliceResponse = {
    updatedDataAndTime: '',
    projectDetail: []
}

// Generic function to perform the GraphQL query
const fetchQuery = async (type: string, userId: string) => {
    const query = getWorkScheduleQuery(type, userId);
    const response = await APOLLO_CLIENT.query({ query, fetchPolicy: 'network-only' });
    return response.data.getUserSchedule || initialData;
};

// Generic function to create a createAsyncThunk instance
const createQueryThunk = (type: string) => {
    return createAsyncThunk<SliceResponse, { userId: string }, { rejectValue: QueryError }>(
        `query/fetch${type.charAt(0).toUpperCase() + type.slice(1)}`,
        async ({ userId }, { rejectWithValue }) => {
            try {
                return await fetchQuery(type, userId);
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
};

export const fetchSchedule = createQueryThunk("schedule");
export const fetchUpdate = createQueryThunk("update");
export const fetchTomorrow = createQueryThunk("tomorrow");

export const fetchAllWorkSchedules = createAsyncThunk<
    { schedule: SliceResponse; update: SliceResponse; tomorrow: SliceResponse },
    { userId: string },
    { rejectValue: QueryError }
>("query/fetchAllSchedules", async ({ userId }, { dispatch, rejectWithValue }) => {
    try {
        const [schedule, update, tomorrow] = await Promise.all([
            dispatch(fetchSchedule({ userId })).unwrap(),
            dispatch(fetchUpdate({ userId })).unwrap(),
            dispatch(fetchTomorrow({ userId })).unwrap(),
        ]);
        return { schedule, update, tomorrow };
    } catch (error: unknown) {
        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }
        return rejectWithValue({ message: errorMessage });
    }
});

const initialState: ScheduleSlice = {
    data: {
        schedule: initialData,
        update: initialData,
        tomorrow: initialData,
    },
    loading: false,
    error: null,
};

const querySlice = createSlice({
    name: "query",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllWorkSchedules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchAllWorkSchedules.fulfilled,
                (
                    state,
                    action: PayloadAction<{ schedule: SliceResponse; update: SliceResponse; tomorrow: SliceResponse }>
                ) => {
                    state.loading = false;
                    state.data = action.payload;
                }
            )
            .addCase(fetchAllWorkSchedules.rejected, (state, action) => {
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