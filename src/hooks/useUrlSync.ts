import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setSearchQuery,
  setAreaId,
  setSelectedSkills,
  setSearchInput,
} from '../store/filtersSlice';

export function useUrlSync() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery, areaId, selectedSkills, searchInput } = useAppSelector(
    s => s.filters
  );

  useEffect(() => {
    const urlSearchQuery = searchParams.get('search') || '';
    const urlAreaId = searchParams.get('area') || '';
    const urlSkills = searchParams.get('skills') || '';

    if (urlSearchQuery !== searchQuery) {
      dispatch(setSearchQuery(urlSearchQuery));
      dispatch(setSearchInput(urlSearchQuery));
    }

    if (urlAreaId !== areaId) {
      dispatch(setAreaId(urlAreaId));
    }

    if (urlSkills) {
      const skillsArray = urlSkills.split(',').filter(Boolean);
      if (
        JSON.stringify(skillsArray.sort()) !==
        JSON.stringify(selectedSkills.sort())
      ) {
        dispatch(setSelectedSkills(skillsArray));
      }
    }
  }, []);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();

    if (searchQuery) {
      newSearchParams.set('search', searchQuery);
    }

    if (areaId) {
      newSearchParams.set('area', areaId);
    }

    if (selectedSkills.length > 0) {
      newSearchParams.set('skills', selectedSkills.join(','));
    }

    const newSearchString = newSearchParams.toString();
    const currentSearchString = searchParams.toString();

    if (newSearchString !== currentSearchString) {
      setSearchParams(newSearchString ? `?${newSearchString}` : '', {
        replace: true,
      });
    }
  }, [searchQuery, areaId, selectedSkills, searchParams, setSearchParams]);
}
