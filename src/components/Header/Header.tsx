import { Group, Button, Container } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import classes from './Header.module.scss';
import logo from '../../assets/logo.svg';
import about from '../../assets/about.svg';

export function Header() {
  const navigate = useNavigate();

  const handleVacanciesClick = () => {
    navigate('/vacancies');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className={classes.header}>
      <Container size="xl" className={classes.container}>
        <Group className={classes.items} h="100%">
          <Group align="center">
            <div 
              className={classes.logo}
              onClick={handleLogoClick}
              style={{ cursor: 'pointer' }}
            >
              <img src={logo} alt="logo" className={classes.logoRed} />
              <span className={classes.logoWhite}>.FrontEnd</span>
            </div>
          </Group>

          <Group className={classes.buttons}>
            <Button 
              variant="subtle" 
              className={classes.navLink}
              onClick={handleVacanciesClick}
            >
              <span>Вакансии FE</span>
              <div className={classes.blueDot}></div>
            </Button>
            <Button variant="subtle" className={classes.navLink}>
              <div className={classes.about}>
                <img src={about} alt="about" />
                <span>Обо мне</span>
              </div>
            </Button>
          </Group>
        </Group>
      </Container>
    </header>
  );
}
