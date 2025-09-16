import {
  Stack,
  Divider,
  Pagination,
  Center,
  Loader,
  Text,
} from '@mantine/core';
import { useEffect } from 'react';
import { VacancyCard } from '../VacancyCard/VacancyCard';
import classes from './VacancyList.module.scss';
import { useAppDispatch, useAppSelector } from '../../store';
import { setPage } from '../../store/vacanciesSlice';
import { useGetVacanciesQuery } from '../../store/api';

export function VacancyList() {
  const dispatch = useAppDispatch();
  const { selectedSkills, areaId, searchQuery } = useAppSelector(
    s => s.filters
  );
  const { page, perPage } = useAppSelector(s => s.vacancies);
  const { data, isLoading, isError } = useGetVacanciesQuery({
    selectedSkills,
    areaId,
    searchQuery,
    page,
    perPage,
  });

  useEffect(() => {}, [dispatch]);

  const formatSalary = (s: any) => {
    if (!s) return 'З/п не указана';
    const from = s.from ?? null;
    const to = s.to ?? null;
    const currency = s.currency ?? 'RUR';
    const fmt = (n: number) => n.toLocaleString('ru-RU');
    const cur = currency === 'RUR' ? '₽' : currency;
    if (from && to) return `${fmt(from)} – ${fmt(to)} ${cur}`;
    if (from) return `от ${fmt(from)} ${cur}`;
    if (to) return `до ${fmt(to)} ${cur}`;
    return 'З/п не указана';
  };

  const mapRemoteType = (scheduleId?: string | null) => {
    if (!scheduleId) return undefined;
    if (scheduleId === 'remote') return 'remote' as const;
    if (scheduleId === 'flexible') return 'hybrid' as const;
    return 'office' as const;
  };

  return (
    <div className={classes.container}>
      <Stack gap="md">
        {isLoading && (
          <Center my="xl">
            <Loader />
          </Center>
        )}

        {isError && !isLoading && (
          <Center my="xl">
            <Text c="red">Ошибка загрузки</Text>
          </Center>
        )}

        {!isLoading &&
          !isError &&
          (data?.items ?? []).map((vacancy, index) => (
            <div key={vacancy.id}>
              <VacancyCard
                id={vacancy.id}
                title={vacancy.name}
                salary={formatSalary(vacancy.salary)}
                experience={vacancy.experience?.name ?? 'Опыт не указан'}
                company={vacancy.employer?.name ?? 'Компания не указана'}
                location={vacancy.area?.name ?? 'Город не указан'}
                remoteType={mapRemoteType(vacancy.schedule?.id)}
                hhUrl={vacancy.alternate_url ?? 'https://hh.ru/'}
              />
              {index < (data?.items?.length ?? 0) - 1 && (
                <Divider my="md" color="#e9ecef" />
              )}
            </div>
          ))}

        <Center mt="lg">
          <Pagination
            total={data?.totalPages ?? 10}
            siblings={1}
            value={page}
            color="gray"
            onChange={p => dispatch(setPage(p))}
            withEdges
          />
        </Center>
      </Stack>
    </div>
  );
}
