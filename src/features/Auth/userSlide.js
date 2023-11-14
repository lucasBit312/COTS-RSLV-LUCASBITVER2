import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StorageKey from "../../constants/storage-keys";
import userApi from "../../Api/userApi";

export const register = createAsyncThunk(
    'users/register',
    async (payload) => {
        try{
            const data = await userApi.register(payload);
            if(data.errors){
                return data.errors;
            }
            console.log(data.message);
            return data.user;
        }catch(error){
            throw error;
        }
    }
);

export const login = createAsyncThunk(
    'users/login',
    async (payload) => {
        try {
            const response = await userApi.login(payload);
            console.log(response);
            if(response.errors){
                return response.errors;
            }else{
                localStorage.setItem(StorageKey.token, response.authorization.token);
                localStorage.setItem(StorageKey.user, JSON.stringify(response.user));
                return response.user;
            }
        } catch (error) {
            throw error;
        }
    }
);

const initialState = {
    current: JSON.parse(localStorage.getItem(StorageKey.user)) || {},
    settings: {},
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state){
            localStorage.removeItem(StorageKey.user);
            localStorage.removeItem(StorageKey.token);
            state.current ={};
        }
    },
    extraReducers: (builder) => {
        // builder.addCase(register.fulfilled, (state, action) => {
        //     state.current = action.payload;
        // });
        builder.addCase(login.fulfilled, (state, action) => {
            state.current = action.payload;
        });
    },
});

const {actions, reducer } = userSlice;
export const {logout} = actions;
export default reducer;
