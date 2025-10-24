import { createSlice } from "@reduxjs/toolkit";


const initialState={
    order:[],
    singleorder:null

}

const orderslice=createSlice({
    name:"order",
    initialState,
    reducers:{

        Addorder:(state,action)=>{
            state.order.push(action.payload)
        },
        Loadorder:(state,action)=>{
            state.order=action.payload
        },
        singleorder:(state,action)=>{
            state.singleorder=action.payload
        }

}})

export const {Loadorder,Addorder,singleorder}= orderslice.actions
export default orderslice.reducer;

