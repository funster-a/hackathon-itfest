import { Link } from 'react-router-dom';
import { Container, Typography, Box, Paper } from '@mui/material';
import { universities } from '../data/mockData';

const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Каталог университетов
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
        {universities.map((university) => (
          <Paper key={university.id} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              <Link
                to={`/university/${university.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {university.name}
              </Link>
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {university.description}
            </Typography>
            <Typography variant="body2">
              <strong>Город:</strong> {university.city}
            </Typography>
            <Typography variant="body2">
              <strong>Стоимость:</strong> {university.price.toLocaleString()} ₸
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default HomePage;

