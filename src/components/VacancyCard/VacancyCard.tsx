import { Paper, Title, Text, Group, Button, Badge, Stack } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import classes from './VacancyCard.module.scss';

interface VacancyCardProps {
  id: string;
  title: string;
  salary: string;
  experience: string;
  company: string;
  location: string;
  remoteType?: 'remote' | 'hybrid' | 'office';
  hhUrl: string;
}

export function VacancyCard({
  id,
  title,
  salary,
  experience,
  company,
  location,
  remoteType,
  hhUrl,
}: VacancyCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/vacancies/${id}`);
  };
  const getRemoteBadge = () => {
    if (remoteType === 'remote') {
      return (
        <Badge color="blue" variant="deffault">
          МОЖНО УДАЛЕННО
        </Badge>
      );
    }
    if (remoteType === 'hybrid') {
      return (
        <Badge color="dark" variant="deffault">
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

  return (
    <Paper 
      p="lg" 
      radius="md" 
      className={classes.card}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <Stack gap="sm">
        <Title order={3} size="h4" className={classes.title}>
          {title}
        </Title>
        <Group>
          <Text size="lg" fw={600} className={classes.salary}>
            {salary}
          </Text>

          <Text size="md" c="dimmed">
            {experience}
          </Text>
        </Group>
        <Text size="md" fw={500} c="dimmed" mt="sm">
          {company}
        </Text>

        {getRemoteBadge()}

        <Text size="lg">{location}</Text>

        <Group gap="md" mt="sm">
          <Button
            component={Link}
            to={`/vacancies/${id}`}
            variant="filled"
            color="dark"
            size="md"
            className={classes.viewButton}
            onClick={(e) => e.stopPropagation()}
          >
            Смотреть вакансию
          </Button>
          <Button
            component="a"
            href={hhUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="filled"
            color="gray"
            size="md"
            className={classes.applyButton}
            onClick={(e) => e.stopPropagation()}
          >
            Откликнуться
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
