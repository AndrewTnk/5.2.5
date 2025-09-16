import {
  Container,
  Title,
  Text,
  Group,
  TextInput,
  Button,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import classes from './SearchHeader.module.scss';
import { useAppDispatch, useAppSelector } from '../../store';
import { commitSearch, setSearchInput } from '../../store/filtersSlice';

export function SearchHeader() {
  const dispatch = useAppDispatch();
  const searchInput = useAppSelector(s => s.filters.searchInput);

  return (
    <div className={classes.searchHeader}>
      <Container size="xl">
        <Group justify="space-between" align="center" py="xl">
          <div>
            <Title order={1} className={classes.mainTitle}>
              Список вакансий
            </Title>
            <Text size="lg" c="dimmed" className={classes.lowTitle}>
              по профессии Frontend-разработчик
            </Text>
          </div>

          <Group gap="md">
            <TextInput
              placeholder="Должность или название компании"
              size="md"
              className={classes.searchInput}
              value={searchInput}
              onChange={e => dispatch(setSearchInput(e.currentTarget.value))}
              onKeyDown={e => {
                if (e.key === 'Enter') dispatch(commitSearch());
              }}
              leftSection={<IconSearch size={18} stroke={1.8} />}
            />
            <Button
              size="md"
              color="blue"
              onClick={() => dispatch(commitSearch())}
            >
              Найти
            </Button>
          </Group>
        </Group>
      </Container>
    </div>
  );
}
