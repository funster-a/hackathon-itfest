import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Paper, TextField, Chip, Stack } from '@mui/material';
import { universities } from '../data/mockData';
import { useCompareStore } from '../store/useCompareStore';

const HomePage = () => {
  const { userEntScore, setEntScore } = useCompareStore();
  const [entScoreInput, setEntScoreInput] = useState<string>('');

  const handleEntScoreChange = (value: string) => {
    setEntScoreInput(value);
    const numValue = value === '' ? null : Number(value);
    if (numValue === null || (!isNaN(numValue) && numValue >= 0 && numValue <= 140)) {
      setEntScore(numValue);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Каталог университетов
      </Typography>

      {/* Блок фильтрации */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Абитуриент-Советник
        </Typography>
        <TextField
          label="Твой балл ЕНТ"
          type="number"
          value={entScoreInput}
          onChange={(e) => handleEntScoreChange(e.target.value)}
          inputProps={{ min: 0, max: 140 }}
          sx={{ width: 300 }}
          helperText="Введите ваш балл ЕНТ (0-140) для расчета шансов на грант"
        />
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {universities.map((university) => {
          const hasChance = userEntScore !== null && userEntScore >= university.minEntScore;
          const showIndicator = userEntScore !== null;

          return (
            <Paper key={university.id} sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                  <Link
                    to={`/university/${university.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {university.name}
                  </Link>
                </Typography>
                {showIndicator && (
                  <Chip
                    label={hasChance ? 'Шанс на грант' : 'Только платно'}
                    color={hasChance ? 'success' : 'warning'}
                    size="medium"
                  />
                )}
              </Stack>
              <Typography variant="body1" color="text.secondary" paragraph>
                {university.description}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="body2">
                  <strong>Город:</strong> {university.city}
                </Typography>
                <Typography variant="body2">
                  <strong>Стоимость:</strong> {university.price.toLocaleString()} ₸
                </Typography>
                <Typography variant="body2">
                  <strong>Проходной балл на грант:</strong> {university.minEntScore}
                </Typography>
                <Typography variant="body2">
                  <strong>Рейтинг:</strong> {university.rating}/5
                </Typography>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Container>
  );
};

export default HomePage;

