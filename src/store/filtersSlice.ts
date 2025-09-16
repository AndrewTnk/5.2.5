import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  selectedSkills: string[];
  availableSkills: string[];
  newSkill: string;
  areaId: string;
  searchInput: string;
  searchQuery: string;
}

const initialState: FiltersState = {
  selectedSkills: ['TypeScript', 'React', 'Redux'],
  availableSkills: ['React', 'Redux', 'TypeScript'],
  newSkill: '',
  areaId: '',
  searchInput: '',
  searchQuery: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSelectedSkills(state, action: PayloadAction<string[]>) {
      state.selectedSkills = action.payload;
      state.availableSkills = Array.from(
        new Set([...state.availableSkills, ...action.payload])
      );
    },
    addAvailableSkill(state, action: PayloadAction<string>) {
      const value = action.payload.trim();
      if (!value) return;
      if (!state.availableSkills.includes(value))
        state.availableSkills.push(value);
    },
    removeAvailableSkill(state, action: PayloadAction<string>) {
      const value = action.payload;
      state.availableSkills = state.availableSkills.filter(s => s !== value);
      state.selectedSkills = state.selectedSkills.filter(s => s !== value);
    },
    toggleSkill(state, action: PayloadAction<string>) {
      const value = action.payload;
      if (state.selectedSkills.includes(value)) {
        state.selectedSkills = state.selectedSkills.filter(s => s !== value);
      } else {
        state.selectedSkills.push(value);
      }
      if (!state.availableSkills.includes(value))
        state.availableSkills.push(value);
    },
    setNewSkill(state, action: PayloadAction<string>) {
      state.newSkill = action.payload;
    },
    commitNewSkill(state) {
      const value = state.newSkill.trim();
      if (!value) return;
      if (!state.availableSkills.includes(value))
        state.availableSkills.push(value);
      state.newSkill = '';
    },
    setAreaId(state, action: PayloadAction<string>) {
      state.areaId = action.payload;
    },
    setSearchInput(state, action: PayloadAction<string>) {
      state.searchInput = action.payload;
    },
    commitSearch(state) {
      state.searchQuery = state.searchInput.trim();
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setSelectedSkills,
  addAvailableSkill,
  removeAvailableSkill,
  toggleSkill,
  setNewSkill,
  commitNewSkill,
  setAreaId,
  setSearchInput,
  commitSearch,
  setSearchQuery,
} = filtersSlice.actions;
export default filtersSlice.reducer;
