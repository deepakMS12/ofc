import { createSlice } from "@reduxjs/toolkit";
import { convertUrlToPdf } from "@/store/thunks/urlToPdfThunks";

type UrlToPdfStatus = "idle" | "loading" | "succeeded" | "failed";

const initialState: {
  status: UrlToPdfStatus;
  error: string | null;
} = {
  status: "idle",
  error: null,
};

const urlToPdfSlice = createSlice({
  name: "urlToPdf",
  initialState,
  reducers: {
    resetUrlToPdfState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(convertUrlToPdf.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(convertUrlToPdf.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(convertUrlToPdf.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : (action.error.message ?? "Conversion failed.");
      });
  },
});

export const { resetUrlToPdfState } = urlToPdfSlice.actions;
export default urlToPdfSlice.reducer;
