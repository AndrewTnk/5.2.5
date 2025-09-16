import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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

export interface HhVacancyDetail extends HhVacancyItem {
  snippet?: {
    requirement?: string;
    responsibility?: string;
  };
  description?: string;
  url?: string;
}

export interface FetchParams {
  selectedSkills: string[];
  areaId: string;
  searchQuery: string;
  page: number;
  perPage: number;
}

export interface VacanciesResponse {
  items: HhVacancyItem[];
  totalPages: number;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.hh.ru' }),
  endpoints: builder => ({
    getVacancies: builder.query<VacanciesResponse, FetchParams>({
      query: ({ selectedSkills, areaId, searchQuery, page, perPage }) => {
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
        return `/vacancies?${qs.toString()}`;
      },
      transformResponse: (data: any) => {
        return {
          items: (data?.items ?? []) as HhVacancyItem[],
          totalPages: typeof data?.pages === 'number' ? Math.max(1, data.pages) : 1,
        } as VacanciesResponse;
      },
    }),
    getVacancy: builder.query<HhVacancyDetail, string>({
      query: (id) => `/vacancies/${id}`,
      transformResponse: (data: any) => {
        console.log('=== API RESPONSE ===');
        console.log('Full API response:', data);
        console.log('Description field:', data.description);
        console.log('Snippet field:', data.snippet);
        console.log('==================');
        return {
          ...data,
          url: data.alternate_url,
        } as HhVacancyDetail;
      },
    }),
  }),
});

export const { useGetVacanciesQuery, useGetVacancyQuery } = api;


