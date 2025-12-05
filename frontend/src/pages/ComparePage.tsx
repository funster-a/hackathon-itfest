import { Link } from 'react-router-dom';
import { Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
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
            Добавьте вузы для сравнения
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
              <TableCell sx={{ fontWeight: 'bold' }}>Параметр</TableCell>
              {compareList.map((university) => (
                <TableCell key={university.id} sx={{ fontWeight: 'bold' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link
                      to={`/university/${university.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {university.name}
                    </Link>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeFromCompare(university.id)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Город</TableCell>
              {compareList.map((university) => (
                <TableCell key={university.id}>{university.city}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Стоимость</TableCell>
              {compareList.map((university) => (
                <TableCell key={university.id}>{university.price.toLocaleString()} ₸</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Рейтинг</TableCell>
              {compareList.map((university) => (
                <TableCell key={university.id}>{university.rating}/5</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Проходной балл на грант</TableCell>
              {compareList.map((university) => (
                <TableCell key={university.id}>{university.minEntScore}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Общежитие</TableCell>
              {compareList.map((university) => (
                <TableCell key={university.id}>
                  {university.hasDormitory ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CloseIcon color="error" />
                  )}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Военная кафедра</TableCell>
              {compareList.map((university) => (
                <TableCell key={university.id}>
                  {university.hasMilitaryDept ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CloseIcon color="error" />
                  )}
                </TableCell>
              ))}
            </TableRow>
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

