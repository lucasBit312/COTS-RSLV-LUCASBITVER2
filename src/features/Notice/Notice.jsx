import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Avatar,
  Box,
  Button,
  FormControl,
  InputBase,
  InputLabel,
  LinearProgress,
  Link,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Typography,
  alpha,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import userApi from "../../Api/userApi";
import { baseURL } from "../../Constants/env";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import transactionsApi from "../../Api/transaction";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { viewedNotice } from "./NoticeSlide";
import { unwrapResult } from "@reduxjs/toolkit";
import queryString from "query-string";
import SearchIcon from "@mui/icons-material/Search";

import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { ClearIcon } from "@mui/x-date-pickers";
Notice.propTypes = {};

const HoverPaper = styled(Paper)({
  "&:hover": {
    backgroundColor: "#CBCBCB",
    cursor: "pointer",
  },
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha("#ED6C02", 0.15),
  "&:hover": {
    backgroundColor: alpha("#ED6C02", 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "38ch",
      "&:focus": {
        width: "38ch",
      },
    },
  },
}));

Notice.propTypes = {
  reloadTotalTrans: PropTypes.func,
};
function Notice(props) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loadData, setLoadData] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const history = useHistory();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const reloadTotalTrans = props.reloadTotalTrans;
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const dispath = useDispatch();
  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      ...params,
      _page: Number.parseInt(params._page) || 1,
      _sort_date: params._sort_date || "ASC",
    };
  }, [location.search]);
  const handleNotificationClick = async (notification) => {
    try {
      setSelectedNotification(notification);
      const action = viewedNotice(notification.id);
      const resultAction = await dispath(action);
      const result = unwrapResult(resultAction);
      handleClickOpen();
      reloadTotalTrans();
      setLoadData(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const dataRes = await userApi.getCountNotication(queryParams);
        const data = dataRes.notifications.data;
        setLoading(false);
        setNotifications(data);
        setTotalPage(dataRes?.notifications?.last_page);
        setLoadData(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [queryParams, loadData]);

  const handleConfirm = async () => {
    try {
      const transaction_id = selectedNotification.transaction_id;
      const result = await transactionsApi.notifiConfirm(transaction_id);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setLoadData(true);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleRefuse = async () => {
    try {
      const transaction_id = selectedNotification.transaction_id;
      const result = await transactionsApi.notifiRefuse(transaction_id);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setLoadData(true);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };
  const handleSearchClick = () => {
    const inputElement = document.getElementById("search-input");
    const content = inputElement.value;
    if (content !== "") {
      const filters = {
        ...queryParams,
        searchContent: content,
      };
      history.push({
        pathname: history.location.pathname,
        search: queryString.stringify(filters),
      });
    }
  };
  const handleClearClick = () => {
    setSearchValue("");
    const { searchContent, ...restFilters } = queryParams;
    const filters = {
      ...restFilters,
    };
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };
  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
    const filters = {
      ...queryParams,
      type: type,
    };
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
  };

  return (
    <div style={{ minHeight: "600px" }}>
      <div
        className="w-100 row"
        style={{
          paddingTop: "5px",
          paddingBottom: "10px",
          marginLeft: "2px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="col-lg-7 col-md-7 col-7" style={{ paddingLeft: 0 }}>
          <Search>
            <Button onClick={handleSearchClick}>
              <SearchIcon />
            </Button>
            <StyledInputBase
              id="search-input"
              placeholder="Tìm kiếm..."
              inputProps={{ "aria-label": "search" }}
              value={searchValue}
              onKeyDown={handleKeyPress}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <Button
                onClick={handleClearClick}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <ClearIcon />
              </Button>
            )}
          </Search>
        </div>
        <div className="col-lg-4 col-md-4 col-4" style={{ marginLeft: "1px" }}>
          <FormControl className="w-100" size="small">
            <InputLabel style={{ color: "#ED6C02" }} id="category-select-label">
              Trạng thái
            </InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              size="small"
              value={selectedType}
              label="Trạng thái"
              onChange={handleTypeChange}
            >
              <MenuItem style={{ color: "#ED6C02" }} value="">
                Tất Cả
              </MenuItem>
              <MenuItem value={0}>Chưa đọc</MenuItem>
              <MenuItem value={1}>Đã đọc</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      {loading ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
          <div style={{ minHeight: "700px" }}></div>
        </Box>
      ) : (
        ""
      )}
      {notifications.map((notification, index) => (
        <HoverPaper
          className="row w-100 pt-2"
          style={{
            marginLeft: "8px",
            marginRight: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          elevation={0}
          onClick={() => handleNotificationClick(notification)}
        >
          <div className="col-lg-1 col-md-2 col-2">
            <Avatar
              alt="user"
              className="mt-1"
              src={`${baseURL}${notification?.user_image}`}
            />
          </div>
          {notification?.type === 4044 ? (
            <div className="col-lg-11 col-md-10 col-10">
              <Typography
                className="fst-normal"
                style={{
                  color:
                    notification.is_read === 0
                      ? notification.type === 4044
                        ? "#FF0000"
                        : "#ED6C02"
                      : "inherit",
                }}
              >
                {notification.message}
                {notification.type === 404
                  ? " (Thông báo thực phẩm hỏng từ người nhận)"
                  : ""}
              </Typography>
              <Typography className="text-muted">
                {dayjs(notification.created_at).format("DD/MM/YYYY HH:mm")}
              </Typography>
            </div>
          ) : (
            <div className="col-lg-11 col-md-10 col-10">
              <Typography
                className="fst-normal"
                style={{
                  color:
                    notification.is_read === 0
                      ? notification.type === 404
                        ? "#FF0000"
                        : "#ED6C02"
                      : "inherit",
                }}
              >
                {notification.message}
                {notification.type === 404 ? " (Thực phẩm hỏng)" : ""}
              </Typography>
              <Typography className="text-muted">
                {dayjs(notification.created_at).format("DD/MM/YYYY HH:mm")}
              </Typography>
            </div>
          )}
        </HoverPaper>
      ))}
      {totalPage > 1 && notifications?.length > 0 ? (
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Thông báo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography className="fst-normal">
              {selectedNotification?.type == 2 ? (
                <Alert className="mb-2" severity="warning">
                  Đã từ chối
                </Alert>
              ) : selectedNotification?.type === 1 ? (
                <Alert className="mb-2" severity="success">
                  Đã đồng ý
                </Alert>
              ) : selectedNotification?.type === 0 ? (
                <Alert className="mb-2" severity="info">
                  Chưa hoàn tất
                </Alert>
              ) : selectedNotification?.type === 4044 ? (
                <Alert className="mb-2" severity="warning">
                  Hãy kiểm tra lại thực phẩm và tiến hành khóa nếu cần thiết bạn
                  nhé!
                </Alert>
              ) : (
                ""
              )}
              <div className="row">
                <div className="col-lg-1 col-md-2 col-2 mt-1">
                  <Avatar
                    alt="user"
                    src={`${baseURL}${selectedNotification?.user_image}`}
                  />
                </div>
                <div className="col-lg-11 col-md-10 col-10">
                  {selectedNotification?.message}
                </div>
                <div className="col-lg-11 col-md-10 col-10">
                  {selectedNotification?.type === 404 ? (
                    <Link
                      href={`/food-received/${selectedNotification?.transaction_id}`}
                      underline="none"
                      style={{ marginLeft: "47px" }}
                    >
                      {"Chi tiết thực phẩm"}
                    </Link>
                  ) : (
                    ""
                  )}
                  {selectedNotification?.type === 4044 ? (
                    <Link
                      href={`/manager-food-donated/view/${selectedNotification?.foodId}`}
                      underline="none"
                      style={{ marginLeft: "47px" }}
                    >
                      {"Chi tiết thực phẩm"}
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </Typography>
            <Typography className="fst-italic pt-3">
              {dayjs(selectedNotification?.created_at).format(
                "DD/MM/YYYY HH:mm"
              )}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {selectedNotification?.type === 0 &&
            selectedNotification?.transaction?.status === 0 && (
              <>
                <Button onClick={handleConfirm}>Đồng ý</Button>
                <Button onClick={handleRefuse}>Từ chối</Button>
              </>
            )}
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Notice;
