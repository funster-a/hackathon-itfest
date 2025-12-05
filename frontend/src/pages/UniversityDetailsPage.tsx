import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { universities } from '../data/mockData';
import { useCompareStore } from '../store/useCompareStore';

const UniversityDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const university = universities.find((u) => u.id === id);
  const { addToCompare, compareList } = useCompareStore();
  const isInCompare = compareList.some((u) => u.id === id);

  if (!university) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Университет не найден</Typography>
        <Button component={Link} to="/" sx={{ mt: 2 }}>
          Вернуться к каталогу
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button component={Link} to="/" sx={{ mb: 3 }}>
        ← Назад к каталогу
      </Button>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {university.name}
        </Typography>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          {university.description}
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body1">
            <strong>Город:</strong> {university.city}
          </Typography>
          <Typography variant="body1">
            <strong>Стоимость обучения:</strong> {university.price.toLocaleString()} ₸
          </Typography>
          <Typography variant="body1">
            <strong>Проходной балл на грант:</strong> {university.minEntScore}
          </Typography>
          <Typography variant="body1">
            <strong>Рейтинг:</strong> {university.rating}/5
          </Typography>
          <Typography variant="body1">
            <strong>Общежитие:</strong> {university.hasDormitory ? 'Да' : 'Нет'}
          </Typography>
          <Typography variant="body1">
            <strong>Военная кафедра:</strong> {university.hasMilitaryDept ? 'Да' : 'Нет'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => addToCompare(university)}
          disabled={isInCompare}
        >
          {isInCompare ? 'Уже в сравнении' : 'Добавить к сравнению'}
        </Button>
      </Paper>
    </Container>
  );
};

export default UniversityDetailsPage;

