import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Badge,
  Stack,
  Divider,
  Loader,
  Center,
} from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useGetVacancyQuery } from '../../store/api';
import classes from './VacancyDetail.module.scss';

export function VacancyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: vacancy, isLoading, isError } = useGetVacancyQuery(id || '');

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

  const getRemoteBadge = () => {
    if (!vacancy?.schedule?.id) return null;
    const remoteType = mapRemoteType(vacancy.schedule.id);

    if (remoteType === 'remote') {
      return (
        <Badge color="blue" variant="default">
          МОЖНО УДАЛЕННО
        </Badge>
      );
    }
    if (remoteType === 'hybrid') {
      return (
        <Badge color="dark" variant="default">
          ГИБРИД
        </Badge>
      );
    }
    if (remoteType === 'office') {
      return (
        <Badge color="gray" variant="light">
          ОФИС
        </Badge>
      );
    }
    return null;
  };

  const renderDescription = () => {
    console.log('=== VACANCY DETAIL COMPONENT ===');
    console.log('Vacancy object:', vacancy);
    console.log('Description field:', vacancy?.description);
    console.log('Snippet field:', vacancy?.snippet);
    console.log('================================');
    
    if (!vacancy?.description) {
      console.log('No description field found');
      return null;
    }

    const stripHtml = (html: string) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      let text = doc.body.textContent || '';

      text = text
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();

      return text;
    };

    const cleanDescription = stripHtml(vacancy.description);
    console.log('Cleaned description:', cleanDescription);

    if (!cleanDescription.trim()) {
      console.log('No description after cleaning');
      return null;
    }

    return (
      <Text size="md" className={classes.snippetText}>
        {cleanDescription}
      </Text>
    );
  };

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Center my="xl">
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (isError || !vacancy) {
    return (
      <Container size="xl" py="xl">
        <Center my="xl">
          <Text c="red" size="lg">
            Ошибка загрузки вакансии
          </Text>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack>
        <Paper p="sm" radius="md" className={classes.mainCard}>
          <Stack gap={5}>
            <Title order={1} size="h2" className={classes.title}>
              {vacancy.name}
            </Title>

            <Group>
              <Text size="xl" fw={600} className={classes.salary}>
                {formatSalary(vacancy.salary)}
              </Text>
              <Text size="lg" c="dimmed">
                {vacancy.experience?.name ?? 'Опыт не указан'}
              </Text>
            </Group>

            <Text size="md" fw={400} c="dimmed">
              {vacancy.employer?.name ?? 'Компания не указана'}
            </Text>

            {getRemoteBadge()}

            <Text size="lg" fw={400}>
              {vacancy.area?.name ?? 'Город не указан'}
            </Text>

            <Group gap="md" mt="md">
              <Button
                component="a"
                href={vacancy.url || vacancy.alternate_url || 'https://hh.ru/'}
                target="_blank"
                rel="noopener noreferrer"
                variant="filled"
                color="dark"
                size="md"
                className={classes.applyButton}
              >
                Откликнуться на hh.ru
              </Button>
            </Group>
          </Stack>
        </Paper>

        {vacancy.description && (
          <Paper p="sm" radius="md" className={classes.descriptionCard}>
            <Stack gap="md">
              <Title order={2} size="h3" className={classes.sectionTitle}>
                Компания
              </Title>
              {renderDescription()}
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
