import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import filtersReducer from '../../store/filtersSlice';
import vacanciesReducer from '../../store/vacanciesSlice';
import { Sidebar } from './Sidebar';
import { MantineProvider } from '@mantine/core';

const rootReducer = combineReducers({
  filters: filtersReducer,
  vacancies: vacanciesReducer,
});
type RootState = ReturnType<typeof rootReducer>;

function renderWithStore(preloadedState?: Partial<RootState>) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState | undefined,
  });
  return render(
    <MantineProvider>
      <Provider store={store}>
        <Sidebar />
      </Provider>
    </MantineProvider>
  );
}

describe('Sidebar', () => {
  it('renders available skill pills and they are not clickable (no toggle)', async () => {
    const user = userEvent.setup();
    renderWithStore({
      filters: {
        selectedSkills: ['React'],
        availableSkills: ['React', 'Redux', 'TypeScript'],
        newSkill: '',
        areaId: '',
        searchInput: '',
        searchQuery: '',
      },
    });

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    await user.click(screen.getByText('Redux'));
    expect(screen.getByText('Redux')).toBeInTheDocument();
  });

  it('allows removing a skill via close button only', async () => {
    const user = userEvent.setup();
    renderWithStore({
      filters: {
        selectedSkills: ['React', 'Redux'],
        availableSkills: ['React', 'Redux', 'TypeScript'],
        newSkill: '',
        areaId: '',
        searchInput: '',
        searchQuery: '',
      },
    });

    const closeBtn = screen.getByLabelText('Remove Redux');
    await user.click(closeBtn);
    expect(screen.queryByText('Redux')).not.toBeInTheDocument();
  });

  it('adds a new skill via input and plus button', async () => {
    const user = userEvent.setup();
    renderWithStore({
      filters: {
        selectedSkills: [],
        availableSkills: [],
        newSkill: '',
        areaId: '',
        searchInput: '',
        searchQuery: '',
      },
    });

    const input = screen.getByPlaceholderText('Навык');
    await user.type(input, 'Node.js');
    const addBtn = screen.getByRole('button');
    await user.click(addBtn);
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });
});
