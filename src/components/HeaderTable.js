import React from 'react';
import { TableHead, TableCell, TableRow, TableSortLabel} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const headRows = [
  { id: 'id', numeric: true, disablePadding: false, label: 'Id' },
  { id: 'email', numeric: false, disablePadding: true, label: 'Email' },
  { id: 'first_name', numeric: false, disablePadding: true, label: 'First Name' },
  { id: 'last_name', numeric: false, disablePadding: true, label: 'Last Name' },
];

const StyledTableCell = withStyles(theme => ({
  head: {
   fontSize: 18,
   fontWeight: 'bold',
   backgroundColor: '#AFEEEE',
   color: 'black'
  },
}))(TableCell);
  
export default function HeaderTable(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = property => event => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          {headRows.map(row => (
            <StyledTableCell
              key={row.id}
              align={!row.numeric ? 'right' : ''}
              sortDirection={orderBy === row.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === row.id}
                direction={order}
                onClick={createSortHandler(row.id)}
              >
                {row.label}
              </TableSortLabel>
            </StyledTableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }