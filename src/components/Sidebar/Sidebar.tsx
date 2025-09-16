import {
  Paper,
  Title,
  TextInput,
  Button,
  Group,
  Stack,
  Select,
  PillsInput,
  Pill,
  CloseButton,
  Text,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import classes from './Sidebar.module.scss';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setAreaId,
  removeAvailableSkill,
  setNewSkill,
  commitNewSkill,
  toggleSkill,
} from '../../store/filtersSlice';
import map from '../../assets/map.svg';

export function Sidebar() {
  const dispatch = useAppDispatch();
  const { availableSkills, selectedSkills, newSkill, areaId } = useAppSelector(s => s.filters);

  const addSkill = () => {
    dispatch(commitNewSkill());
  };

  const removeSkillCompletely = (skillToRemove: string) => {
    dispatch(removeAvailableSkill(skillToRemove));
  };

  return (
    <div className={classes.sidebar}>
      <Stack gap="md">
        <Paper p="md" radius="md" className={classes.filterCard}>
          <Title order={3} size="h4" mb="md" className={classes.title}>
            Ключевые навыки
          </Title>

          <Group gap="xs" mb="md">
            <TextInput
              placeholder="Навык"
              value={newSkill}
              radius={10}
              onChange={e => dispatch(setNewSkill(e.target.value))}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              className={classes.skillInput}
            />
            <Button variant="filled" color="#228BE6" onClick={addSkill}>
              <IconPlus size={26} />
            </Button>
          </Group>

          <PillsInput variant="unstyled">
            <Pill.Group>
              {availableSkills.map(skill => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <Pill
                    key={skill}
                    size="sm"
                    variant={isSelected ? "filled" : "default"}
                    color={isSelected ? "blue" : undefined}
                    className={classes.skillBadge}
                    onClick={() => dispatch(toggleSkill(skill))}
                    style={{ cursor: 'pointer' }}
                  >
                    <Text className={classes.pillContent}>{skill}</Text>
                    <CloseButton
                      size="sm"
                      className={classes.pillRemove}
                      onClick={e => {
                        e.stopPropagation();
                        removeSkillCompletely(skill);
                      }}
                      aria-label={`Remove ${skill}`}
                    />
                  </Pill>
                );
              })}
            </Pill.Group>
          </PillsInput>
        </Paper>

        <Paper p="md" radius="md" className={classes.filterCard}>
          <Select
            placeholder="Все города"
            data={[
              { value: '1', label: 'Москва' },
              { value: '2', label: 'Санкт-Петербург' },
            ]}
            value={areaId}
            onChange={val => dispatch(setAreaId(val ?? ''))}
            searchable={false}
            clearable
            radius={10}
            className={classes.citySelect}
            leftSection={<img src={map} />}
          />
        </Paper>
      </Stack>
    </div>
  );
}
