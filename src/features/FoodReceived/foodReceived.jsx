import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Pagination,
  Rating,
  Typography,
} from "@mui/material";
import cartApi from "../../Api/cartApi";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Modal from "@mui/material/Modal";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import dayjs from "dayjs";
import queryString from "query-string";
import RatingForm from "./RatingForm/RatingForm";
const FoodReceived = (props) => {
  const [list, setList] = useState([]);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const open = Boolean(anchorEl2);
  const history = useHistory();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemFood, setSelectedItemFood] = useState(null);
  const [selectedItemFoodStatus, setSelectedItemFoodStatus] = useState(null);
  const [selectedItemFoodDonorStatus, setSelectedItemFoodDonorStatus] =
    useState(null);
  const [selectedItemFoodReceiverStatus, setSelectedItemFoodReceiverStatus] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialogRates, setOpenDialogRates] = React.useState(false);
  const [loadData, setLoadData] = useState(false);
  const location = useLocation();
  const [totalPage, setTotalPage] = useState(0);
  const [contentRating, setContentRating] = useState("");

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAnchorEl2(null);
  };

  const handleClick = (
    event,
    itemId,
    itemFood,
    itemFoodStatus,
    itemFoodDonorStatus,
    itemFoodReceiverStatus
  ) => {
    setAnchorEl2(event.currentTarget);
    setSelectedItemId(itemId);
    setSelectedItemFood(itemFood);
    setSelectedItemFoodStatus(itemFoodStatus);
    setSelectedItemFoodDonorStatus(itemFoodDonorStatus);
    setSelectedItemFoodReceiverStatus(itemFoodReceiverStatus);
    console.log(itemFoodStatus, itemFoodDonorStatus, itemFoodReceiverStatus);
  };
  const handleClose = () => {
    setAnchorEl2(null);
    setSelectedItemId(null);
  };

  const handleViewDetail = () => {
    history.push(`/foods/${selectedItemFood}`);
  };

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      ...params,
      _page: Number.parseInt(params._page) || 1,
    };
  }, [location.search]);

  const handlePageChange = (event, newPage) => {
    const filters = {
      ...queryParams,
      _page: newPage,
    };
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRes = await cartApi.getReceivedList(queryParams);
        const data = dataRes.received_list.data;
        if (data.length > 0) {
          setList(data);
          setTotalPage(dataRes.received_list.last_page);
          console.log(list);
        } else {
          setList(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [queryParams, loadData]);

  const handleCancelReceived = async () => {
    try {
      const received_id = selectedItemId;
      const result = await cartApi.cancelReceived(received_id);
      console.log(result);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setLoadData(true);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleClickRating = () => {
    setOpenDialogRates(true);
    setAnchorEl2(null);
  };

  const handleCloseRating = () => {
    setOpenDialogRates(false);
    setAnchorEl2(null);
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    // console.log('Rating:', point);
    // console.log('Content:', contentRating);
    // handleCloseDialog();
    console.log("submit");
  };

  if (loading) {
    return (
      <Box marginTop={9} sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box
      marginTop={12}
      marginBottom={4}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <TableContainer component={Paper} style={{ width: "80%" }}>
        <Typography className="p-3 fw-bolder">
          Danh Sách Thực Phẩm Đã Nhận
        </Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="left">Tên Thực Phẩm</TableCell>
              <TableCell align="left">Tên Người Tặng</TableCell>
              <TableCell align="left">Số Lượng</TableCell>
              <TableCell align="left">Trạng Thái</TableCell>
              <TableCell align="left">Thời Gian Nhận</TableCell>
              <TableCell align="left">Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item) => (
              <TableRow
                key={item.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item.id}
                </TableCell>
                <TableCell align="left">{item.food.title}</TableCell>
                <TableCell align="left">{item.food.user.full_name}</TableCell>
                <TableCell align="left">{item.quantity_received}</TableCell>
                <TableCell align="left">
                  {item.status === 0 && item.donor_status === 1 ? (
                    <Alert severity="warning">Người Tặng Đã Xác Nhận</Alert>
                  ) : item.status === 0 ? (
                    <Alert severity="warning">Đang Đợi Xác Nhận</Alert>
                  ) : item.status === 1 ? (
                    <Alert severity="success">Đã Lấy</Alert>
                  ) : item.status === 2 && item.donor_status === 2 ? (
                    <Alert severity="error">Người Tặng Từ Chối</Alert>
                  ) : item.status === 2 ? (
                    <Alert severity="error">Đã Hủy Nhận</Alert>
                  ) : item.status === 3 ? (
                    <Alert severity="error">Hết Thời Gian Nhận</Alert>
                  ) : item.status === 4 ? (
                    <Alert severity="error">Thực Phẩm Này Đã Bị Khóa</Alert>
                  ) : null}
                </TableCell>
                <TableCell align="left">
                  {dayjs(item.created_at).format("DD/MM/YYYY HH:mm")}
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
                        item.id,
                        item.id,
                        item.status,
                        item.donor_status,
                        item.receiver_status
                      )
                    }
                  >
                    <EditNoteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div
          style={{
            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "center",
            marginTop: "30px",
            padding: "10px",
          }}
        >
          <Pagination
            container
            justify="center"
            color="warning"
            count={totalPage}
            page={queryParams._page}
            onChange={handlePageChange}
          />
        </div>
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
        {selectedItemFoodStatus !== 4 ? (
          selectedItemFoodStatus == 0 ? (
            <MenuItem onClick={handleClickOpenDialog}>Hủy Nhận</MenuItem>
          ) : selectedItemFoodStatus === 1 &&
            selectedItemFoodDonorStatus === 1 &&
            selectedItemFoodReceiverStatus === 0 ? (
            <MenuItem onClick={handleClickRating}>Đánh Giá</MenuItem>
          ) : null
        ) : null}
        <MenuItem onClick={handleViewDetail}>Xem Chi Tiết Thực Phẩm</MenuItem>
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
            Bạn có thực sự muốn hủy nhận thực phẩm này?
            <br />
            Lưu ý: sau 4 giờ tiếp theo bạn mới có thể nhận lại thực phẩm này!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReceived}>Đồng Ý</Button>
          <Button onClick={handleCloseDialog} autoFocus>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialogRates}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <RatingForm closeDialogRating={handleCloseRating} />
      </Dialog>
      {/* <form onSubmit={handleSubmit}>
      <Dialog
        open={openDialogRates}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Đánh giá</DialogTitle>
        <DialogContent>
          <Typography component="legend">Số điểm đánh giá</Typography>
          <Rating
            name="simple-controlled"
            value={point}
            onChange={(event, newValue) => {
              setPoint(newValue);
            }}
          />
          <DialogContentText id="alert-dialog-description">
            <textarea
              className="form-control"
              id="contentRating"
              name="contentRating"
              aria-label="With textarea"
              value={contentRating}
              onChange={(event) => setContentRating(event.target.value)}
            ></textarea>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="submit">Đồng Ý</Button>
          <Button onClick={handleCloseDialog} autoFocus>
            Hủy
          </Button>
        </DialogActions>
      </Dialog> */}
      {/* </form> */}
    </Box>
  );
};

FoodReceived.propTypes = {};

export default FoodReceived;
