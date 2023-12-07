import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import transactionsApi from "../../Api/transaction";
export const viewedNotice = createAsyncThunk(
    '/notifi-viewed',
    async (payload) => {
        try {
            console.log(payload)
            const response = await transactionsApi.notifiViewed(payload);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    }
);
export const noticeSlice = createSlice({
    name: 'notice',
    initialState: {
        noticeItems: 0,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(viewedNotice.fulfilled, (state, action) => {
            console.log(action)
            state.noticeItems = state.noticeItems + 1;
        });
    },
});
const { actions, reducer } = noticeSlice;
export default reducer;
