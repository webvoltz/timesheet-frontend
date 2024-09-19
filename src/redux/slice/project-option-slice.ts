import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PROJECT_QUERY, TL_PROJECT_QUERY } from "../../graphql/schedule.graphql";
import { APOLLO_CLIENT } from "../../services/apollo";
import { QueryError } from "../../types/error.type";
import { ProjectResponse } from "../../types/schdeule.type";

export const fetchProjectOption = createAsyncThunk<ProjectResponse[], { userId: string, isTeamLeader: boolean }, { rejectValue: QueryError }>(
    "query/fetchProjects",
    async ({ userId, isTeamLeader }, { rejectWithValue }) => {
        try {
            let response: ProjectResponse[] = [];

            if (isTeamLeader) {
                const { data } = await APOLLO_CLIENT.query<{ allmemberProject: ProjectResponse[] }>({
                    query: TL_PROJECT_QUERY,
                    variables: { teamLeaderId: userId },
                });
                response = data.allmemberProject;
            } else {
                const { data } = await APOLLO_CLIENT.query<{ filteredProjects: ProjectResponse[] }>({
                    query: PROJECT_QUERY,
                    variables: { usersId: userId },
                });
                response = data.filteredProjects;
            }

            return response;
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
        data: null as ProjectResponse[] | null,
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectOption.fulfilled, (state, action: PayloadAction<ProjectResponse[]>) => {
                state.data = action.payload;
            })
            .addCase(fetchProjectOption.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message || "An unknown error occurred";
                }
            });
    },
});

export default querySlice.reducer;
