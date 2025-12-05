import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Каталог Университетов
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Каталог
          </Button>
          <Button color="inherit" component={Link} to="/compare">
            Сравнение
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

