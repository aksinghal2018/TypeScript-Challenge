import * as React from 'react';
import { useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Typography, Paper } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios'
import { Button } from '@mui/material'
import NewRow from './newRow'
import styled from 'styled-components';

const Wrapper = styled.section`
  color:white;
  `;

interface Data {
  product: string,
  tags: String,
  energy: number,
  protein: number,
  fat: number,
  monounsaturatedFat: number,
  polyunsaturatedFat: number,
  carbohydrate: number,
  sugar: number,
  transFat: number,
  dietaryfibre: number,
  sodium: number,
  potassium: number,
  calcium: number,
  vitamine: number,
}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'product',
    numeric: false,
    disablePadding: true,
    label: 'Product',
  },
  {
    id: 'tags',
    numeric: false,
    disablePadding: false,
    label: 'tags',
  },
  {
    id: 'energy',
    numeric: true,
    disablePadding: false,
    label: 'energy',
  },
  {
    id: 'protein',
    numeric: true,
    disablePadding: false,
    label: 'protein',
  },
  {
    id: 'fat',
    numeric: true,
    disablePadding: false,
    label: 'fat',
  },

  {
    id: 'monounsaturatedFat',
    numeric: true,
    disablePadding: false,
    label: 'monounsaturatedFat',
  },

  {
    id: 'polyunsaturatedFat',
    numeric: true,
    disablePadding: false,
    label: 'polyunsaturatedFat',
  },

  {
    id: 'carbohydrate',
    numeric: true,
    disablePadding: false,
    label: 'carbohydrate',
  },

  {
    id: 'sugar',
    numeric: true,
    disablePadding: false,
    label: 'Sugar',
  },

  {
    id: 'transFat',
    numeric: true,
    disablePadding: false,
    label: 'transFat',
  },

  {
    id: 'dietaryfibre',
    numeric: true,
    disablePadding: false,
    label: 'dietaryFibre',
  },
  {
    id: 'sodium',
    numeric: true,
    disablePadding: false,
    label: 'sodium',
  },
  {
    id: 'potassium',
    numeric: true,
    disablePadding: false,
    label: 'potassium',
  },
  {
    id: 'calcium',
    numeric: true,
    disablePadding: false,
    label: 'calcium',
  },
  {
    id: 'vitamine',
    numeric: true,
    disablePadding: false,
    label: 'vitamin-e',
  },

];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {  order, orderBy,onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow style={{ backgroundColor: "grey" }}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ textAlign: "center", color: "white" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
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
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}


const ProductsTable: React.FC = () => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('product');
  const [selectedProducts, setSelectedProducts] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [productsList, setproductsList] = React.useState([]);
  const [rows, setrows] = React.useState([])
  const [upperRow, setupperRow] = React.useState(<></>)
  function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  const comparedata = () => {
    showupperrow()
  }
  const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Nutrition
          </Typography>
        )}
        <Button disabled={selectedProducts.length !== 2 ? true : false} variant="contained" style={{ width: "400px", backgroundColor: "grey", color: "whitey" }} id="mybtn" onClick={comparedata}>{selectedProducts.length !== 2 ? "SELECT 2 PRODUCT TO COMPARE" : "COMPARE PRODUCTS"}</Button>

      </Toolbar>
    );
  };
  useEffect(() => {
    var productData = []
    axios.get("http://localhost:3000/api/products").then(res => {
      setproductsList(res.data)
      res.data.map(data => {
        productData.push({productid:data.id,product:data.name,tags: data.tags,energy: data.nutrition.energy,protein: data.nutrition.protein,fat: data.nutrition.fat,monounsaturatedFat: data.nutrition.monounsaturatedFat,polyunsaturatedFat: data.nutrition.polyunsaturatedFat,carbohydrate: data.nutrition.carbohydrate, sugar:data.nutrition.sugar, transFat:data.nutrition.transFat,dietaryFibre: data.nutrition.dietaryFibre,sodium: data.nutrition.sodium,potassium: data.nutrition.potassium,calcium: data.nutrition.calcium,"vitamin-e": data.nutrition["vitamin-e"]})
      })
      setrows(productData)
    })
  }, [])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelectedProducts(newSelecteds);
      return;
    }
    setSelectedProducts([]);
  };
  
  const showupperrow = () => {
    
    const firstSelectedProductData=productsList.find(item=>item.id==selectedProducts[0])
    const secondSelectedProductData=productsList.find(item=>item.id==selectedProducts[1])
      
    const itemData = [
      { item1: firstSelectedProductData.name, item2: secondSelectedProductData.name },
      { item1: firstSelectedProductData.tags, item2: secondSelectedProductData.tags },
      { item1: firstSelectedProductData.nutrition.energy, item2: secondSelectedProductData.nutrition.energy },
      { item1: firstSelectedProductData.nutrition.protein, item2: secondSelectedProductData.nutrition.protein },
      { item1: firstSelectedProductData.nutrition.fat, item2: secondSelectedProductData.nutrition.fat },
      { item1: firstSelectedProductData.nutrition.monounsaturatedFat, item2: secondSelectedProductData.nutrition.monounsaturatedFat },
      { item1: firstSelectedProductData.nutrition.polyunsaturatedFat, item2: secondSelectedProductData.nutrition.polyunsaturatedFat },
      { item1: firstSelectedProductData.nutrition.carbohydrate, item2: secondSelectedProductData.nutrition.carbohydrate },
      { item1: firstSelectedProductData.nutrition.sugar, item2: secondSelectedProductData.nutrition.sugar },
      { item1: firstSelectedProductData.nutrition.transFat, item2: secondSelectedProductData.nutrition.transFat },
      { item1: firstSelectedProductData.nutrition.dietaryFibre, item2: secondSelectedProductData.nutrition.dietaryFibre },
      { item1: firstSelectedProductData.nutrition.sodium, item2: secondSelectedProductData.nutrition.sodium },
      { item1: firstSelectedProductData.nutrition.potassium, item2: secondSelectedProductData.nutrition.potassium },
      { item1: firstSelectedProductData.nutrition.calcium, item2: secondSelectedProductData.nutrition.calcium },
      { item1: firstSelectedProductData.nutrition["vitamin-e"], item2: secondSelectedProductData.nutrition["vitamin-e"] }

    ]
    setupperRow(<>
      {itemData.map((item,index) => {
        return (
          <NewRow item1={item} key={index} />
        )
      })}
    </>
    )

  }
  const handleClick = (event: React.MouseEvent<unknown>, productid: string, id: string) => {
    const selectedIndex = selectedProducts.indexOf(productid);
    let newSelected: readonly string[] = [];
    if (selectedProducts.length < 2) {
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedProducts, productid);
        setSelectedProducts(newSelected);
      }
    }

    if (selectedIndex !== -1) {
      if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedProducts.slice(1));
        setSelectedProducts(newSelected);
        setupperRow(<></>)

      } else if (selectedIndex === selectedProducts.length - 1) {
        newSelected = newSelected.concat(selectedProducts.slice(0, -1));
        setSelectedProducts(newSelected);
        setupperRow(<></>)

      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selectedProducts.slice(0, selectedIndex),
          selectedProducts.slice(selectedIndex + 1)
        );
        setupperRow(<></>)
        setSelectedProducts(newSelected);

      }

    }
    
  }


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  const isSelected = (name: string) => selectedProducts.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
  return (
    <Box sx={{ width: '80%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}
        style={{ backgroundColor: "rgb(77, 77, 77)", color: "white" }}
      >
        <EnhancedTableToolbar numSelected={selectedProducts.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='medium'
          >
            <EnhancedTableHead
              numSelected={selectedProducts.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}

            />
            <TableBody
            >
              <TableRow>
                {upperRow}
              </TableRow>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected("row.name");
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.productid, `enhanced-table-checkbox-${index}`)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                      id={`enhanced-table-checkbox-${index}`}
                      style={{ backgroundColor: selectedProducts.includes(row.productid) ? "#955073" : "rgb(77,77,77)" }}
                    >
                      <TableCell
                        component="th" id={labelId} scope="row" padding="none"><Wrapper>{row.product}</Wrapper>
                      </TableCell>
                      <TableCell align="right" ><Wrapper>{row.tags}</Wrapper></TableCell>
                      <TableCell align="right" ><Wrapper>{row.energy}</Wrapper></TableCell>
                      <TableCell align="right" ><Wrapper>{row.protein}</Wrapper></TableCell>
                      <TableCell align="right" ><Wrapper>{row.fat}</Wrapper></TableCell>
                      <TableCell align="right" ><Wrapper>{row.monounsaturatedFat}</Wrapper></TableCell>
                      <TableCell align="right" ><Wrapper>{row.polyunsaturatedFat}</Wrapper></TableCell>
                      <TableCell align="right" ><Wrapper>{row.carbohydrate}</Wrapper></TableCell>
                      <TableCell align="right" ><Wrapper>{row.sugar}</Wrapper></TableCell>
                      <TableCell align="right" ><Wrapper>{row.transFat}</Wrapper></TableCell>
                      <TableCell align="right" ><Wrapper>{row.dietaryfibre}</Wrapper></TableCell>
                      <TableCell align="right" ><Wrapper>{row.sodium}</Wrapper></TableCell>
                      <TableCell align="right" ><Wrapper>{row.potassium}</Wrapper></TableCell>
                      <TableCell align="right" ><Wrapper>{row.calcium}</Wrapper></TableCell>
                      <TableCell align="right" ><Wrapper>{row.vitamine}</Wrapper></TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height:  53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
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
          style={{ color: "white" }}
        />
      </Paper>

    </Box>
  );
}
export default ProductsTable