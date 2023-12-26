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
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import foodApi from "../../Api/foodApi";
import { useState } from "react";
import { baseURL } from "../../constants/env";
import EditNoteIcon from "@mui/icons-material/EditNote";
import queryString from "query-string";
import dayjs from "dayjs";
import TableSkeleton from "../../Components/Skeleton/TableSkeleton";
import {
  useHistory,
  useRouteMatch,
} from "react-router-dom/cjs/react-router-dom";
import { useMemo } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { enqueueSnackbar } from "notistack";
ManageFoodDonated.propTypes = {};
function ManageFoodDonated(props) {
  const [list, setList] = useState([]);
  const [menuAction, setMenuAction] = React.useState(null);
  // const [foodId, setFoodId] = React.useState(null);
  // const [foodStatus, setFoodStatus] = React.useState(null);
  // const [foodQuantity, setFoodQuantity] = React.useState(null);
  // const [foodExpiryDate, setFoodExpiryDate] = React.useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const history = useHistory();
  const [loadData, setLoadData] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const open = Boolean(menuAction);
  const now = dayjs();
  const location = useLocation();

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleNotificationClick = (event, food) => {
    try {
      setSelectedFood(food);
      setMenuAction(event.currentTarget);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMenuAction(null);
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
        const dataRes = await foodApi.getDonateList(queryParams);
        setList(dataRes.donatedFoods.data);
        setTotalPage(dataRes.donatedFoods.last_page);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [queryParams, loadData]);

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

  // const handleClick = (event, id, status, quantity, expiry_date) => {
  //   setMenuAction(event.currentTarget);
  //   setFoodId(id);
  //   setFoodStatus(status);
  //   setFoodQuantity(quantity);
  //   setFoodExpiryDate(expiry_date);
  // };
  const handleClose = () => {
    setMenuAction(null);
  };
  const EditFood = () => {
    history.push(`/manager-food-donated/edit/${selectedFood?.slug}`);
  };
  const cancelDonate = async () => {
    try {
      const food_id = selectedFood?.id;
      const result = await foodApi.cancelDonate(food_id);
      console.log(result);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setLoadData(true);
        setMenuAction(null);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const continuesDonate = () => {};
  const viewDetailFood = () => {
    history.push(`/foods/${selectedFood?.slug}`);
  };

  const menuItems = [];
  if (selectedFood?.status !== 4) {
    if (
      selectedFood?.status !== 2 &&
      dayjs(selectedFood?.expiry_date, "DD/MM/YYYY HH:mm").isAfter(now)
    ) {
      menuItems.push(
        <MenuItem key="edit" onClick={EditFood}>
          Chỉnh sửa
        </MenuItem>
      );
    }
    if (
      dayjs(selectedFood?.expiry_date, "DD/MM/YYYY HH:mm").isAfter(now) &&
      selectedFood?.quantity > 1 &&
      selectedFood?.status !=="2"
    ) {
      menuItems.push(
        <MenuItem key="cancel" onClick={handleClickOpenDialog}>
          Dừng Tặng
        </MenuItem>
      );
    }
  }

  return (
    <Box
      marginTop={14}
      marginBottom={4}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <TableContainer component={Paper} style={{ width: "80%", minHeight:700 }}>
        <Typography variant="h4" className="p-3" style={{ color: "#ED6C02" }}>
          Danh Sách Thực Phẩm Đã Tặng
        </Typography>
        <Table sx={{ minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell className="text-nowrap" align="left">Tên Thực Phẩm</TableCell>
              <TableCell className="text-nowrap" align="left">Hình Ảnh</TableCell>
              <TableCell className="text-nowrap" align="left">Số Lượng Còn</TableCell>
              <TableCell className="text-nowrap" align="left">Trạng Thái</TableCell>
              <TableCell className="text-nowrap" align="left">Thời Gian Tạo</TableCell>
              <TableCell className="text-nowrap" align="left">Thao Tác</TableCell>
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
                <TableCell align="left">{item.title}</TableCell>
                <TableCell align="left">
                  <Avatar
                    alt={item.title}
                    src={`${baseURL}${item.images[0]?.image_url}`}
                  />
                </TableCell>
                <TableCell align="left">{item.quantity}</TableCell>
                <TableCell align="left">
                  {item.status == 0 ? (
                    <Alert severity="info">Đang Mở</Alert>
                  ) : item.status == 1 ? (
                    <Alert style={{minWidth:"200px"}} severity="success">Đã Có Người Nhận</Alert>
                  ) : item.status == 2 ? (
                    <Alert severity="warning">Đã Dừng Tặng</Alert>
                  ) : item.status == 4 ? (
                    <Alert severity="error">Đã Bị Khóa</Alert>
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
                    onClick={(e) => handleNotificationClick(e, item)}
                  >
                    <EditNoteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPage > 1 && list?.length > 0 ? (
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
        ) : (
          ""
        )}
      </TableContainer>
      <Menu
        id="basic-menu"
        anchorEl={menuAction}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {menuItems}
        <MenuItem onClick={viewDetailFood}>Xem Chi Tiết</MenuItem>
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
            Bạn có thực sự muốn khóa tặng thực phẩm này?
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDonate}>Đồng Ý</Button>
          <Button onClick={handleCloseDialog} autoFocus>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageFoodDonated;
