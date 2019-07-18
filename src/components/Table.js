import React from 'react';
import { Table, TableBody, TableCell, TablePagination, TableRow, Paper, InputLabel, MenuItem, FormControl, Select, TextField} from '@material-ui/core';
import { Modal, Button, Image } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import HeaderTable from './HeaderTable';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 180,
  },
  root: {
    width: '60%',
    marginLeft: '20%',
    background: '#FFC0CB',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
}));

export default function EnhancedTable(props) {
  const classes = useStyles();

  const rows = props.rows;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [modalShow, setModalShow] = React.useState(false);
  const [singleRow, setSingleRow] = React.useState({});
  const [values, setValues] = React.useState({
    columnToQuery: '',
    search: ''
  });

  function handleChange(event) {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));
  }

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleClick(row) {
    setSingleRow(row);
    setModalShow(true);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  const handleTextChange = search => event => {
    if(values.columnToQuery === '') {
      alert('select a column first')
    } else {
      setValues({...values, [search]: event.target.value})
    }
  }

  function MyModal(props) {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Id: {singleRow.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{display: 'flex', flexDirection: 'row'}}>
          <Image src={singleRow.avatar} roundedCircle/>
          <div style={{marginTop: '20px', marginLeft: '15px'}}>
            <h4>{singleRow.first_name} {singleRow.last_name}</h4>
            <p>email: {singleRow.email} </p>
          </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <div style={{marginTop: '90px'}}>

      <Paper className={classes.root}>
        
        { page === 0 ?
          <form autoComplete="off" style={{marginLeft: '20px'}}>
            <TextField
              label="Search"
              value={values.search}
              onChange={handleTextChange('search')}
              margin="normal"
              inputProps={{
                name: 'search',
              }}/>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-column">Select a Column</InputLabel>
              <Select
                value={values.columnToQuery}
                onChange={handleChange}
                inputProps={{
                  name: 'columnToQuery',
                  id: 'select-column',
                }}>
                <MenuItem value='email'>Email</MenuItem>
                <MenuItem value='first_name'>First Name</MenuItem>
                <MenuItem value='last_name'>Last Name</MenuItem>
              </Select>
            </FormControl>
          </form>: null
        }
 
        <div>
          <Table aria-labelledby="tableTitle" className={classes.table}>
            <HeaderTable
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              { stableSort(values.search ? rows.filter(x => x[values.columnToQuery].includes(values.search) || x[values.columnToQuery].toLowerCase().includes(values.search)): rows, 
                getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={() => handleClick(row)}
                      key={row.id}
                    >
                      <MyModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        onClick={e => e.stopPropagation()}
                      />
                      <TableCell component="th" id={labelId} scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.first_name}</TableCell>
                      <TableCell align="right">{row.last_name}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          rowsPerPageOptions={[3,4]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{ 'aria-label': 'Previous Page',}}
          nextIconButtonProps={{ 'aria-label': 'Next Page',}}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />

      </Paper>

    </div>
  );
}