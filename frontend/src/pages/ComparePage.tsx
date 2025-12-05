import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useCompareStore } from '../store/useCompareStore';

const ComparePage = () => {
  const { compareList, removeFromCompare } = useCompareStore();

  if (compareList.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Сравнение университетов
        </Typography>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Список сравнения пуст
          </Typography>
          <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
            Перейти к каталогу
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Сравнение университетов
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Город</TableCell>
              <TableCell>Стоимость</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {compareList.map((university) => (
              <TableRow key={university.id}>
                <TableCell>
                  <Link
                    to={`/university/${university.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {university.name}
                  </Link>
                </TableCell>
                <TableCell>{university.city}</TableCell>
                <TableCell>{university.price.toLocaleString()} ₸</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeFromCompare(university.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button component={Link} to="/" variant="outlined" sx={{ mt: 3 }}>
        Вернуться к каталогу
      </Button>
    </Container>
  );
};

export default ComparePage;

