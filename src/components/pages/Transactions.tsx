"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ArrowLeftRight } from "lucide-react";
import { accountApi } from "@/lib/api/account";
import type { Transaction } from "@/lib/api/account";
import dayjs, { Dayjs } from "dayjs";

export default function Transactions() {
  const [invoiceId, setInvoiceId] = useState("");
  // Set default dates to last 3 months
  const threeMonthsAgo = dayjs().subtract(3, "month");
  const today = dayjs();
  const [fromDate, setFromDate] = useState<Dayjs | null>(threeMonthsAgo);
  const [toDate, setToDate] = useState<Dayjs | null>(today);
  const [amount, setAmount] = useState("");
  const [tranType, setTranType] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (fromDate) params.fromDate = fromDate.format("DD-MM-YYYY");
      if (toDate) params.toDate = toDate.format("DD-MM-YYYY");
      if (tranType !== "all") params.type = tranType;
      if (invoiceId) params.transactionId = invoiceId;
      if (amount) params.amount = parseFloat(amount);

      const data = await accountApi.getTransactions(params);
      // Handle both array and object response formats
      let transactionsList: Transaction[] = [];
      if (Array.isArray(data)) {
        transactionsList = data;
      } else {
        const response = data as any;
        transactionsList = response.transactions || [];
      }
      setTransactions(transactionsList);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadTransactions();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 4, backgroundColor: "#fafafa", minHeight: "100vh" }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ArrowLeftRight size={25} />
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, mb: 1, color: "#333" }}
            >
              Converter
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>
            View and manage your transaction history. Filter by date, amount,
            or transaction type to find specific records.
          </Typography>
        </Box>

      
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", md: "row" },
              height: "calc(100vh - 200px)"
            }}
          >
            {/* Grid 35% - Filter Section */}
            <Box
              sx={{
                flex: { xs: "1 1 100%", md: "0 0 calc(35% - 12px)" },
                maxWidth: { xs: "100%", md: "calc(35% - 12px)" },
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "white",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 1, color: "#333" }}
                >
                  Filter Criteria
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p:1,
                    minHeight: "calc(100vh - 350px)",
                     maxHeight: "calc(100vh - 350px)",
                  overflowY: "auto",
                  }}
                >
                  {/* Invoice ID */}
                  <TextField
                    id="invoice-id"
                    label="Invoice ID"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                    sx={{
                      backgroundColor: "#f5f5f5",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#f5f5f5",
                        "& fieldset": {
                          borderColor: "#e0e0e0",
                        },
                      },
                    }}
                  />

                  {/* From Date */}
                  <DatePicker
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
                    format="DD-MM-YYYY"
                    minDate={threeMonthsAgo}
                    maxDate={today}
                    disableFuture
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                    sx={{
                      backgroundColor: "#f5f5f5",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#f5f5f5",
                        "& fieldset": {
                          borderColor: "#e0e0e0",
                        },
                      },
                    }}
                  />

                  {/* To Date */}
                  <DatePicker
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    format="DD-MM-YYYY"
                    minDate={fromDate || threeMonthsAgo}
                    maxDate={today}
                    disableFuture
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                    sx={{
                      backgroundColor: "#f5f5f5",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#f5f5f5",
                        "& fieldset": {
                          borderColor: "#e0e0e0",
                        },
                      },
                    }}
                  />

                  {/* Amount */}
                  <TextField
                    id="amount"
                    label="Amount"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    sx={{
                      backgroundColor: "#f5f5f5",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#f5f5f5",
                        "& fieldset": {
                          borderColor: "#e0e0e0",
                        },
                      },
                    }}
                  />

                  {/* Tran. Type */}
                  <FormControl
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#f5f5f5",
                        "& fieldset": {
                          borderColor: "#e0e0e0",
                        },
                      },
                    }}
                  >
                    <Select
                      value={tranType}
                      onChange={(e) => setTranType(e.target.value)}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="credit">Credit</MenuItem>
                      <MenuItem value="debit">Debit</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Search Button */}
               
                </Box>
                   <Button
                    variant="outlined"
                    onClick={handleSearch}
                    fullWidth
                    sx={{
                      borderColor: "#e0e0e0",
                      color: "#666",
                      textTransform: "none",
                    
                      "&:hover": {
                        borderColor: "#0b996e",
                        color: "#0b996e",
                        backgroundColor: "rgba(11, 153, 110, 0.04)",
                      },
                    }}
                  >
                    Search
                  </Button>
              </Paper>
            </Box>

            {/* Grid 65% - Data Table Section */}
            <Box
              sx={{
                flex: { xs: "1 1 100%", md: "0 0 calc(65% - 12px)" },
                maxWidth: { xs: "100%", md: "calc(65% - 12px)" },
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: "white",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ height: "100%", width: "100%" }}>
                  <DataGrid
                    rows={transactions}
                    loading={loading}
                    columns={[
                      {
                        field: "transId",
                        headerName: "Trans. ID",
                        width: 150,
                        flex: 1,
                      },
                      {
                        field: "detail",
                        headerName: "Detail",
                        width: 200,
                        flex: 2,
                      },
                      {
                        field: "type",
                        headerName: "Type",
                        width: 120,
                        flex: 1,
                      },
                      {
                        field: "price",
                        headerName: "Price",
                        width: 120,
                        flex: 1,
                        valueFormatter: (value: number | null | undefined) => {
                          if (value == null) return "";
                          return typeof value === "number"
                            ? `$${value.toFixed(2)}`
                            : String(value);
                        },
                      },
                      {
                        field: "transDt",
                        headerName: "Date/Time",
                        width: 200,
                        flex: 1.5,
                        valueFormatter: (value: string | null | undefined) => {
                          if (!value) return "";
                          return value;
                        },
                      },
                    ]}
                    getRowId={(row) => row.transId}
                    disableColumnMenu
                    disableRowSelectionOnClick
                    hideFooterSelectedRowCount
                    sx={{
                      border: "none",
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#424242",
                        color: "#333",
                        fontWeight: 600,
                        fontSize: "14px",
                      },
                      "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: 600,
                        color: "#333",
                      },
                      "& .MuiDataGrid-cell": {
                        borderBottom: "1px solid #e0e0e0",
                      },
                      "& .MuiDataGrid-row:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                      "& .MuiDataGrid-footerContainer": {
                        borderTop: "1px solid #e0e0e0",
                      },
                    }}
                    slots={{
                      noRowsOverlay: () => (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            gap: 2,
                          }}
                        >
                          <Box
                            component="img"
                            src="/assets/assets/images/icon/empty.svg"
                            alt="No data"
                            sx={{
                              width: 200,
                              height: 200,
                              opacity: 0.6,
                            }}
                          />
                        </Box>
                      ),
                    }}
                  />
                </Box>
              </Paper>
            </Box>
          </Box>
    
      </Box>
    </LocalizationProvider>
  );
}
