import { Container, Group } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { SearchHeader } from './components/SearchHeader/SearchHeader';
import { Sidebar } from './components/Sidebar/Sidebar';
import { VacancyList } from './components/VacancyList/VacancyList';
import { VacancyDetail } from './components/VacancyDetail/VacancyDetail';
import classes from './App.module.scss';

function VacanciesPage() {
  return (
    <>
      <SearchHeader />
      <Container size="xl" py="xl">
        <Group gap="xl" align="flex-start">
          <Sidebar />
          <div className={classes.mainContent}>
            <VacancyList />
          </div>
        </Group>
      </Container>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className={classes.app}>
        <Header />
        <Routes>
          <Route path="/" element={<VacanciesPage />} />
          <Route path="/vacancies" element={<VacanciesPage />} />
          <Route path="/vacancies/:id" element={<VacancyDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
