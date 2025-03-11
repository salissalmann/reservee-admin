import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface OrganizationState {
  selectedOrganizationId: string | null;
}

const initialState: OrganizationState = {
  selectedOrganizationId: null,
};

export const clearOrganizationThunk = createAsyncThunk(
  "organization/clearOrganizationThunk",
  async (_, { dispatch }) => {
    dispatch(clearOrganization());
  }
);

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    selectOrganization: (state, action: PayloadAction<string>) => {
      // console.log('Selecting organization in slice:', action.payload);
      state.selectedOrganizationId = action.payload;
    },
    clearOrganization: (state) => {
      state.selectedOrganizationId = null;
    }
  },
});

export const { selectOrganization, clearOrganization } = organizationSlice.actions;

export const selectOrganizationId = (state: {
  organization: OrganizationState;
}) => {
  // console.log('Selecting organization ID from state:', state);
  return state?.organization?.selectedOrganizationId;
};

export default organizationSlice.reducer;
