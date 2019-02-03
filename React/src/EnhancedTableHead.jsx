import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';

let counter = 0;
function createData(name, org, act, trans, delivQ, delivP, uniP) {
  counter += 1;
  let test = { id: counter, name, org, act, trans, delivQ, delivP, uniP};
  console.log(test);
  return test; // { id: counter, name, org, act, trans, delivQ, delivP, uniP};
}

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

const rows = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Product Name' },
  { id: 'org', numeric: false, disablePadding: false, label: 'Organization Name' },
  { id: 'act', numeric: false, disablePadding: false, label: 'Account Name' },
  { id: 'trans', numeric: false, disablePadding: false, label: 'Transaction Date' },
  { id: 'delivQ', numeric: true, disablePadding: false, label: 'Delivered Quantity' },
  { id: 'delivP', numeric: true, disablePadding: false, label: 'Delivered Price' },
  { id: 'uniP', numeric: true, disablePadding: false, label: 'Unit Price' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
          Detected Anomalies
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  image: {
    position: 'center',
    justifyContent: 'center',
    align: 'center',
  }
});

class EnhancedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: [
createData('TRIGGER,SPRAY,RED&WHT,9.75" DIP TUBE', 'WASSER_49',
        'BRINKER TEST KITCHEN', '18-OCT-17', 10.0, 3.1, 0.31),
       createData('BOTTLE, SPRAY, 32OZ,CENTER NECK,9 3/8"H', 'WASSER_49',
        'BRINKER TEST KITCHEN', '18-OCT-17', 10.0, 4.0, 0.4),
       createData('BEEF BURGER 8 OZ FRESH', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '15-JUN-18', 4.0, 325.84, 81.46),
       createData('CHGS FOR FUEL SURCHARGE', 'SYSCO006', 'BRINKER TEST KITCHEN',
        '14-NOV-18', 1.0, 10.0, 10.0),
       createData('CREPE PLAIN 6', 'SYSCO013', 'BRINKER INTERNATIONAL CORP',
        '14-NOV-18', 2.0, 70.56, 35.28),
       createData('CREPE PLAIN 6', 'SYSCO013', 'BRINKER INTERNATIONAL CORP',
        '14-NOV-18', 2.0, 70.56, 35.28),
       createData('CHICKEN CVP BRST BNLS SKLS ESL', 'SYSCO006',
        'BRINKER TEST KITCHEN', '14-NOV-18', 1.0, 42.21, 42.21),
       createData('TORTILLA CHIP CORN WHTE', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '15-SEP-18', 13.0, 179.79, 13.83),
       createData('TORTILLA CHIP CORN WHTE', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '15-SEP-18', 13.0, 179.79, 13.83),
       createData('TORTILLA CHIP CORN WHTE', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '15-SEP-18', 13.0, 179.79, 13.83),
       createData('AVOCADO BR CT. 48CT', 'FRESHPOINT_108', "BRINKER CHILI\'S #1309",
        '01-SEP-18', 5.0, 273.5, 54.7),
       createData('BEEF BURGER 8 OZ FRESH', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '03-AUG-18', 4.0, 307.32, 76.83),
       createData('CORN DOG, W/STICK ORIGINAL', 'YHATA_001',
        "BRINKER INTL - CHILI\'S", '03-MAY-17', 9.0, 260.73, 28.97),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #501", '21-DEC-18', 14.0, 305.89, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #670", '04-JAN-19', 14.0, 305.89, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1553", '04-JAN-19', 14.0, 305.89, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1187", '04-JAN-19', 14.0, 305.89, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #881", '23-NOV-18', 14.0, 305.89, 22.07),
       createData('BEEF FAJITA MEAT OSC MARINADE', 'MAINES_2-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '16-MAR-17', 1.0, 224.0, 6.73),
       createData('BASIL--1#', 'FRESHPOINT_158', "BRINKER-MAGGIANO\'S #183",
        '26-DEC-17', 12.0, 108.11, 9.1),
       createData('AVOCADO--#2 48CT-BR', 'FRESHPOINT_158', "BRINKER-CHILI\'S #712",
        '03-AUG-18', 7.0, 261.95, 37.8),
       createData('AVOCADO--#2 48CT-BR', 'FRESHPOINT_158', "BRINKER-CHILI\'S #712",
        '02-FEB-18', 7.0, 261.95, 37.8),
       createData('AVOCADO--#2 60CT BR', 'FRESHPOINT_158', "BRINKER-CHILI\'S #742",
        '12-JAN-18', 7.0, 268.88, 38.8),
       createData('AVOCADO--#2 48CT-BR', 'FRESHPOINT_158', "BRINKER-CHILI\'S #1178",
        '08-AUG-18', 5.0, 251.46, 50.8),
       createData('LETTUCE--ICEBERG CHPD 1X1 8/2#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #319", '12-FEB-18', 10.0, 109.69, 11.08),
       createData('PASTA SPAGHETTI CHITARRA', 'SYSCO024', 'BRINKER INT.',
        '22-JUN-18', 1.0, 28.3, 28.3),
       createData('LETTUCE--ICEBERG CHPD 1X1 8/2#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1324", '29-NOV-18', 9.0, 91.06, 10.22),
       createData('LETTUCE--ICEBERG CHPD 1X1 8/2#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #712", '26-MAY-17', 12.0, 118.21, 9.95),
       createData('ASPARAGUS--STANDARD 11# BR', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #742", '04-JUN-18', 8.0, 208.45, 26.32),
       createData('LETTUCE ICEBERG CHOP CT 1" 8/2', 'FRESHPOINT_108',
        "BRINKER CHI'S MALL OF GA", '27-MAY-17', 10.0, 130.6, 13.06),
       createData('OIL CLEAR LIQUID FRYING ZTF', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '18-AUG-18', 10.0, 200.8, 20.08),
       createData('ASPARAGUS--STANDARD 11# BR', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #069", '03-JUL-17', 7.0, 181.08, 26.13),
       createData('TOMATO--SALSA 25# UBU', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1229", '06-DEC-17', 8.0, 207.5, 26.2),
       createData('DESSERT PIE MARGARITA', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '02-NOV-18', 1.0, 59.56, 59.56),
       createData('LETTUCE--ICEBERG CHPD 1X1 8/2#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #960", '03-JUL-18', 8.0, 80.94, 10.22),
       createData('MUSHROOM--75CT TRAY PACK MAGGI', 'FRESHPOINT_158',
        "BRINKER-MAGGIANO\'S #183", '26-OCT-18', 9.0, 294.03, 33.0),
       createData('MUSHROOM--75CT TRAY PACK MAGGI', 'FRESHPOINT_158',
        "BRINKER-MAGGIANO\'S #183", '14-SEP-18', 9.0, 294.03, 33.0),
       createData('LETTUCE--ICEBERG CHPD 1X1 8/2#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #069", '03-JUL-17', 10.0, 100.09, 10.11),
       createData('AVOCADO--HAND SCOOPED 8/2# BR', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1187", '17-AUG-18', 7.0, 285.52, 41.2),
       createData('TOMATO--SALSA 25# UBU', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1162", '26-MAY-18', 10.0, 120.78, 12.2),
       createData('AVOCADO--#2 48CT-BR', 'FRESHPOINT_158', "BRINKER-CHILI\'S #1065",
        '11-AUG-18', 6.0, 301.75, 50.8),
       createData('RIBS PORK LOIN BACK DOMESTIC', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '15-SEP-18', 3.0, 322.32, 2.41),
       createData('MUSHROOM--BUTTON 10#', 'FRESHPOINT_158',
        "BRINKER-MAGGIANO\'S #183", '28-DEC-18', 12.0, 258.39, 21.75),
       createData('MUSHROOM--BUTTON 10#', 'FRESHPOINT_158',
        "BRINKER-MAGGIANO\'S #183", '09-FEB-18', 12.0, 258.39, 21.75),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #069", '30-NOV-18', 13.0, 284.04, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #069", '18-JAN-19', 13.0, 284.04, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #881", '18-JAN-19', 13.0, 284.04, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #069", '16-NOV-18', 13.0, 284.04, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #502", '30-NOV-18', 13.0, 284.04, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #069", '25-JAN-19', 13.0, 284.04, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1187", '25-JAN-19', 13.0, 284.04, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1187", '09-NOV-18', 13.0, 284.04, 22.07),
       createData('CORN COB 5.5 INCH', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '18-AUG-18', 10.0, 182.3, 18.23),
       createData('RIBS PORK LOIN BACK DOMESTIC', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '15-SEP-18', 3.0, 307.75, 2.41),
       createData('RIBS PORK LOIN BACK DOMESTIC', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '15-SEP-18', 3.0, 306.81, 2.41),
       createData('BUN BRIOCHE 4 IN', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '15-SEP-18', 11.0, 154.11, 14.01),
       createData('BUN BRIOCHE 4 IN', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '15-SEP-18', 11.0, 154.11, 14.01),
       createData('BUN BRIOCHE 4 IN', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '15-SEP-18', 11.0, 154.11, 14.01),
       createData('PIE MARGARITA', 'MBM2', 'BRINKER TEST KITCHEN 9998',
        '05-NOV-18', 5.0, 297.3, 59.46),
       createData('AVOCADO BR CT. 48CT', 'FRESHPOINT_108',
        "BRINKER CHILI\'S FLOWERY B", '28-OCT-17', 6.0, 325.2, 54.2),
       createData('SPRING MIX--4/3# BR', 'FRESHPOINT_158', "BRINKER-CHILI\'S #712",
        '14-DEC-18', 5.0, 153.05, 30.92),
       createData('LETTUCE ICEBERG CHOP CT 1" 8/2', 'FRESHPOINT_108',
        "BRINKER CHILI\'S #455", '02-JUL-18', 8.0, 110.0, 13.75),
       createData('MESCLUN--3#', 'FRESHPOINT_158', "BRINKER-CHILI\'S #1306",
        '06-MAR-17', 8.0, 107.71, 13.6),
       createData('MESCLUN--3#', 'FRESHPOINT_158', "BRINKER-CHILI\'S #742",
        '06-MAR-17', 8.0, 107.71, 13.6),
       createData('CILANTRO--CLEANED 1#--BG', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #069", '03-JUL-17', 13.0, 60.75, 4.72),
       createData('AVOCADO--#2 60CT BR', 'FRESHPOINT_158', "BRINKER-CHILI\'S #057",
        '06-AUG-18', 5.0, 251.46, 50.8),
       createData('LETTUCE ICEBERG CHOP CT 1" 8/2', 'FRESHPOINT_108',
        "BRINKER-CHILI\'S DALTON", '31-MAR-18', 9.0, 123.39, 13.71),
       createData('LETTUCE ICEBERG CHOP CT 1" 8/2', 'FRESHPOINT_108',
        "BRINKER-CHILI\'S DALTON", '14-APR-18', 9.0, 123.39, 13.71),
       createData('LETTUCE--ROMAINE CHPD 1X1 6/2#', 'FRESHPOINT_158',
        "BRINKER-MAGGIANO\'S #183", '31-AUG-18', 12.0, 164.42, 13.84),
       createData('AVOCADO BR CT. 60CT #2', 'FRESHPOINT_108',
        "BRINKER CHILI\'S P'DENCE", '04-AUG-17', 5.0, 248.5, 49.7),
       createData('AVOCADO--HAND SCOOPED 8/2# BR', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #742", '30-DEC-17', 6.0, 258.03, 43.44),
       createData('AVOCADO--HAND SCOOPED 8/2# BR', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #742", '21-OCT-17', 6.0, 258.03, 43.44),
       createData('AVOCADO--HAND SCOOPED 8/2# BR', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #319", '10-JUN-17', 6.0, 258.03, 43.44),
       createData('AVOCADO--HAND SCOOPED 8/2# BR', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1553", '23-DEC-17', 6.0, 258.03, 43.44),
       createData('AVOCADO--HAND SCOOPED 8/2# BR', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #504", '27-MAY-17', 6.0, 258.03, 43.44),
       createData('AVOCADO--HAND SCOOPED 8/2# BR', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #304", '06-MAY-17', 6.0, 258.03, 43.44),
       createData('AVOCADO--#2 48CT-BR', 'FRESHPOINT_158', "BRINKER-CHILI\'S #670",
        '04-AUG-17', 5.0, 246.51, 49.8),
       createData('AVOCADO--#2 48CT-BR', 'FRESHPOINT_158', "BRINKER-CHILI\'S #742",
        '04-AUG-17', 5.0, 246.51, 49.8),
       createData('AVOCADO--#2 48CT-BR', 'FRESHPOINT_158', "BRINKER-CHILI\'S #670",
        '28-DEC-18', 4.0, 142.76, 36.05),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #742", '26-JAN-19', 14.0, 305.89, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1066", '29-DEC-18', 14.0, 305.89, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #970", '10-NOV-18', 14.0, 305.89, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #960", '10-NOV-18', 14.0, 305.89, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1176", '10-NOV-18', 14.0, 305.89, 22.07),
       createData('MUSHROOM--LARGE 1 3/4"-2 1/2', 'FRESHPOINT_158',
        "BRINKER-MAGGIANO\'S #183", '22-DEC-17', 10.0, 248.98, 25.15),
       createData('MUSHROOM--LARGE 1 3/4"-2 1/2', 'FRESHPOINT_158',
        "BRINKER-MAGGIANO\'S #183", '09-JUN-17', 10.0, 248.98, 25.15),
       createData('LETTUCE--ROMAINE CHPD 1X1 8/2#', 'FRESHPOINT_158',
        "BRINKER-MAGGIANO\'S #183", '28-SEP-18', 8.0, 140.18, 17.7),
       createData('LETTUCE--ROMAINE CHPD 1X1 6/2#', 'FRESHPOINT_158',
        "BRINKER-MAGGIANO\'S #183", '20-MAR-18', 8.0, 112.86, 14.25),
       createData('CUP, 20 OZ FOAM BRINKER LOGO', 'MBM35',
        'BRINKER-OFFICE SERVICES BLDG A', '05-APR-17', 9.0, 201.51,
        22.39),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #745", '26-DEC-18', 11.0, 240.34, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1187", '23-JAN-19', 11.0, 240.34, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1439", '16-JAN-19', 11.0, 240.34, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #670", '21-NOV-18', 11.0, 240.34, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #1439", '23-JAN-19', 11.0, 240.34, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #501", '05-DEC-18', 11.0, 240.34, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #970", '14-NOV-18', 11.0, 240.34, 22.07),
       createData('FRIES--3/8"CUT COATED ZTF 6/6#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #501", '21-NOV-18', 11.0, 240.34, 22.07),
       createData('LETTUCE--ICEBERG CHPD 1X1 8/2#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #712", '28-APR-17', 7.0, 110.53, 15.95),
       createData('LETTUCE--ICEBERG CHPD 1X1 8/2#', 'FRESHPOINT_158',
        "BRINKER-CHILI\'S #069", '05-MAY-17', 7.0, 110.53, 15.95),
       createData('CHIX FRIED UNCOOKED', 'MAINES_1-BRINKER',
        "CHILI\'S BRINKER OFFC ACCT", '15-SEP-18', 2.0, 97.18, 48.59),
    ],
    page: 0,
    rowsPerPage: 10,
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.name}
                      </TableCell>
                      <TableCell align="right">{n.org}</TableCell>
                      <TableCell align="right">{n.act}</TableCell>
                      <TableCell align="right">{n.trans}</TableCell>
                      <TableCell align="right">{n.delivQ}</TableCell>
                      <TableCell align="right">{n.delivP}</TableCell>
                      <TableCell align="right">{n.uniP}</TableCell>

                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <div style={styles.image}> <img src="static/beans.png" width="50%" height="auto"/> </div>
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);