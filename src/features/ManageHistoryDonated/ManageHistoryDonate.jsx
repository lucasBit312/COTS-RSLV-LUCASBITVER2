import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import transactionsApi from "../../Api/transaction";
import { useState } from "react";
import { baseURL } from "../../constants/env";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { enqueueSnackbar } from "notistack";
import TableSkeleton from "../../Components/Skeleton/TableSkeleton";
ManageHistoryDonate.propTypes = {};
function ManageHistoryDonate(props) {
  const [list, setList] = useState([]);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [status, setStatus] = useState(null);
  const [donor_status, setDonor_status] = useState(null);
  const [loadData, setLoadData] = useState(false);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl2);

  const handleClick = (event, itemId, status, donor_status) => {
    setAnchorEl2(event.currentTarget);
    setSelectedItemId(itemId);
    setStatus(status);
    setDonor_status(donor_status);
  };

  const handleClose = () => {
    setAnchorEl2(null);
    setSelectedItemId(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAnchorEl2(null);
  };

  const handleConfirmReceived = () => {
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    try {
      const transaction_id = selectedItemId;
      const result = await transactionsApi.confirmReceived(transaction_id);
      console.log(result);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setLoadData(true);
        setAnchorEl2(null);
        setOpenDialog(false);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dataRes = await transactionsApi.history_transactions();
        const data = dataRes;
        if (data && data.transactions) {
          const foodTransactions = data.transactions.filter(
            (transaction) => transaction.food_transactions.length > 0
          );
          setList(foodTransactions);
          console.log(list);
          setLoading(false);
        } else {
          console.error("Invalid response format");
        }
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    fetchData();
  }, [loadData]);

  if (loading) {
    return (
      <Box
        marginTop={14}
        sx={{ width: "80%", marginX: "auto", textAlign: "center" }}
      >
        <TableSkeleton />
      </Box>
    );
  }
  return (
    <Box
      marginTop={12}
      marginBottom={4}
      minHeight={"700px"}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <TableContainer component={Paper} style={{ width: "80%" }}>
        <Typography variant="h4" className="p-3">
          Lịch Sử Giao Dịch
        </Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="text-nowrap" align="left">
                ID
              </TableCell>
              <TableCell className="text-nowrap" align="left">
                Tên Thực Phẩm
              </TableCell>
              <TableCell className="text-nowrap" align="left">
                Hình Ảnh
              </TableCell>
              <TableCell className="text-nowrap" align="left">
                Người Nhận
              </TableCell>
              <TableCell className="text-nowrap" align="left">
                Số Lượng Nhận
              </TableCell>
              <TableCell className="text-nowrap" align="left">
                Thời Gian Ấn Nhận
              </TableCell>
              <TableCell className="text-nowrap" align="left">
                Thời Gian Nhận
              </TableCell>
              <TableCell className="text-nowrap" align="left">
                Trạng Thái
              </TableCell>
              <TableCell className="text-nowrap" align="left">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((food) => (
              <React.Fragment key={food.id}>
                {food.food_transactions &&
                  food.food_transactions.length > 0 &&
                  food.food_transactions.map((foodTransaction) => (
                    <TableRow
                      key={foodTransaction.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="left">{foodTransaction.id}</TableCell>
                      <TableCell align="left">{food.title}</TableCell>
                      <TableCell align="left">
                        <Avatar
                          alt={food.title}
                          src={
                            food.image_urls && food.image_urls.length > 0
                              ? `${baseURL}${food.image_urls[0]}`
                              : ""
                          }
                        />
                      </TableCell>
                      <TableCell align="left">
                        {foodTransaction.receiver.full_name}
                      </TableCell>
                      <TableCell align="left">
                        {foodTransaction.quantity_received}
                      </TableCell>
                      <TableCell align="left">
                        {foodTransaction.created_at}
                      </TableCell>
                      <TableCell align="left">
                        {foodTransaction.pickup_time}
                      </TableCell>
                      <TableCell>
                        {foodTransaction.status === 0 ? (
                          <Alert
                            style={{ minWidth: "140px" }}
                            severity="warning"
                          >
                            Chưa lấy
                          </Alert>
                        ) : foodTransaction.status === 1 ? (
                          <Alert
                            style={{ minWidth: "110px" }}
                            severity="success"
                          >
                            Đã Lấy
                          </Alert>
                        ) : foodTransaction.status === 2 ? (
                          <Alert style={{ minWidth: "150px" }} severity="error">
                            Đã Hủy Nhận
                          </Alert>
                        ) : foodTransaction.status === 3 ? (
                          <Alert severity="error" style={{ minWidth: "250px" }}>
                            Bị Hủy Do Hết Thời Gian Nhận
                          </Alert>
                        ) : null}
                      </TableCell>
                      <TableCell align="left">
                        <IconButton
                          id="basic-button"
                          aria-controls={open ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={(e) =>
                            handleClick(
                              e,
                              foodTransaction.id,
                              foodTransaction.status,
                              foodTransaction.donor_status
                            )
                          }
                        >
                          <EditNoteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl2}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {status === 0 && donor_status === 1 ? (
          <MenuItem onClick={handleConfirmReceived}>Xác nhận đã nhận</MenuItem>
        ) : null}
      </Menu>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác Nhận</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn đang thực hiện xác nhận người nhận đã nhận thực phẩm!
            <br />
            Ấn xác nhận để hoàn tất quá trình
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm}>Đồng Ý</Button>
          <Button onClick={handleCloseDialog} autoFocus>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageHistoryDonate;
