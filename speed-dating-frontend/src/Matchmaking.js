import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TableSortLabel, Typography,
  Checkbox, FormControlLabel, Switch, Button, Container
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import StatusBar from './StatusBar'; // Make sure to create this component

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Deltagare' },
  { id: 'willMatch', numeric: false, disablePadding: false, label: 'Jag vill matcha' },
  { id: 'interesting', numeric: false, disablePadding: false, label: 'Verkar intressant' },
];

const Matchmaking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/events/${id}/participants`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRows(response.data.map((p) => ({ 
          id: p.id, 
          name: p.name, 
          willMatch: false, 
          interesting: false 
        })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching participants:', error);
        setError('Failed to fetch participants. Please try again.');
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [id]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleChoiceChange = (id, choice) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        return { ...row, willMatch: choice === 'willMatch', interesting: choice === 'interesting' };
      }
      return row;
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/api/events/${id}/save-choices`, 
        { choices: rows },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Choices saved successfully!');
    } catch (error) {
      console.error('Error saving choices:', error);
      alert('Failed to save choices. Please try again.');
    }
  };

  const handleSend = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:3000/api/events/${id}/send-choices`, 
        { choices: rows },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Choices sent to participants successfully!');
      if (response.data.matches) {
        console.log('Matches:', response.data.matches);
      }
    } catch (error) {
      console.error('Error sending choices:', error);
      alert('Failed to send choices. Please try again.');
    }
  };

  const getComparator = useCallback((order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }, []);

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const visibleRows = useMemo(
    () =>
      rows.slice()
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows, getComparator]
  );

  if (loading) return <Container maxWidth="sm"><Typography>Loading...</Typography></Container>;
  if (error) return <Container maxWidth="sm"><Typography variant="h6" color="error">{error}</Typography></Container>;

  return (
    <Box sx={{ width: '100%' }}>
      <StatusBar activeStep={3} />
      <Box sx={{ mb: 2 }}>
        <Button onClick={() => navigate(`/event/${id}`)}>Back to Event Details</Button>
        <Button onClick={() => navigate('/events')}>Back to Event List</Button>
      </Box>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow hover tabIndex={-1} key={row.id}>
                  <TableCell component="th" scope="row" padding="none">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">
                    <Checkbox
                      checked={row.willMatch}
                      onChange={() => handleChoiceChange(row.id, 'willMatch')}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Checkbox
                      checked={row.interesting}
                      onChange={() => handleChoiceChange(row.id, 'interesting')}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Spara val
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSend}>
          Skicka till deltagare
        </Button>
      </Box>
    </Box>
  );
};

export default Matchmaking;