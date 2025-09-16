import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface HhSalary {
  from?: number | null;
  to?: number | null;
  currency?: string | null;
}

export interface HhVacancyItem {
  id: string;
  name: string;
  salary: HhSalary | null;
  experience?: { id: string; name: string } | null;
  employer?: { name: string } | null;
  area?: { name: string } | null;
  schedule?: { id: string; name: string } | null;
  alternate_url?: string;
}

export interface VacanciesState {
  items: HhVacancyItem[];
  page: number;
  perPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: VacanciesState = {
  items: [],
  page: 1,
  perPage: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

export interface FetchParams {
  selectedSkills: string[];
  areaId: string;
  searchQuery: string;
  page: number;
  perPage: number;
}

export const fetchVacancies = createAsyncThunk(
  'vacancies/fetch',
  async (params: FetchParams) => {
    const { selectedSkills, areaId, searchQuery, page, perPage } = params;
    const qs = new URLSearchParams();
    qs.set('industry', '7');
    qs.set('professional_role', '96');
    if (areaId) qs.set('area', areaId);
    selectedSkills.forEach(s => {
      if (s && s.trim()) qs.append('skill_set', s.trim());
    });
    if (searchQuery) {
      qs.set('text', searchQuery);
      qs.append('search_field', 'name');
      qs.append('search_field', 'company_name');
    }
    qs.set('page', String(page - 1));
    qs.set('per_page', String(perPage));

    const res = await fetch(`https://api.hh.ru/vacancies?${qs.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      items: (data.items ?? []) as HhVacancyItem[],
      totalPages: typeof data.pages === 'number' ? Math.max(1, data.pages) : 1,
    };
  }
);

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetPage(state) {
      state.page = 1;
    },
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchVacancies.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacancies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchVacancies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка загрузки';
      });
  },
});

export const { setPage, resetPage, setPerPage } = vacanciesSlice.actions;
export default vacanciesSlice.reducer;
