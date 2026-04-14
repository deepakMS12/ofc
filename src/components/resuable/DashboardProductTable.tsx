import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const TEAL_PRICE = "#00838f";

const PriceCell = ({ row }:any) => {
  if (row.priceKind === "sale") {
    return (
      <Box component="span" sx={{ whiteSpace: "nowrap" }}>
        <Typography
          component="span"
          sx={{
            textDecoration: "line-through",
            color: "error.main",
            mr: 0.75,
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          {row.original}
        </Typography>
        <Typography
          component="span"
          sx={{ color: "success.main", fontWeight: 700, fontSize: "0.875rem" }}
        >
          {row.current}
        </Typography>
      </Box>
    );
  }
  return (
    <Typography
      component="span"
      sx={{ color: TEAL_PRICE, fontWeight: 600, fontSize: "0.875rem" }}
    >
      {row.price}
    </Typography>
  );
};

const rows = [
  {
    name: "Hoverboard",
    priceKind: "sale",
    original: "$229.99",
    current: "$119.99",
    status: "on_sale",
  },
  { name: "Hiking Shoe", priceKind: "fixed", price: "$46.45", status: "approved" },
  { name: "Gaming Console", priceKind: "fixed", price: "$355.00", status: "pending" },
  {
    name: "Digital Camera",
    priceKind: "sale",
    original: "$324.99",
    current: "$219.95",
    status: "out_of_stock",
  },
  { name: "Laptop", priceKind: "fixed", price: "$899.00", status: "sold" },
];

const DashboardProductTable = () => {
  return (
    <TableContainer
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        overflow: "hidden",
        maxWidth: "100%",
      }}
    >
      <Table
        size="small"
        sx={{
          borderCollapse: "separate",
          "& .MuiTableCell-root": {
            borderRight: "none",
            borderLeft: "none",
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                bgcolor: "#f5f5f5",
                color: "text.secondary",
                fontWeight: 700,
                fontSize: "0.8125rem",
                textTransform: "lowercase",
                borderBottom: "1px solid #e0e0e0",
                py: 1.25,
              }}
            >
              name
            </TableCell>
            <TableCell
              sx={{
                bgcolor: "#f5f5f5",
                color: "text.secondary",
                fontWeight: 700,
                fontSize: "0.8125rem",
                textTransform: "lowercase",
                borderBottom: "1px solid #e0e0e0",
                py: 1.25,
              }}
            >
              price
            </TableCell>
          
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{
                "&:last-child td": { borderBottom: 0 },
                "& td": {
                  borderBottom: "1px solid #eeeeee",
                  py: 1.35,
                },
              }}
            >
              <TableCell>
                <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.875rem" }}>
                  {row.name}
                </Typography>
              </TableCell>
              <TableCell>
                <PriceCell row={row} />
              </TableCell>
         
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DashboardProductTable;
