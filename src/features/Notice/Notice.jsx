import React from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import userApi from "../../Api/userApi";
import { baseURL } from "../../constants/env";
import dayjs from "dayjs";
import { styled } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import transactionsApi from "../../Api/transaction";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { viewedNotice } from "./NoticeSlide";
import { unwrapResult } from "@reduxjs/toolkit";
Notice.propTypes = {};
const HoverPaper = styled(Paper)({
  "&:hover": {
    backgroundColor: "#CBCBCB",
    cursor: "pointer",
  },
});
function Notice(props) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loadData, setLoadData] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const dispath = useDispatch();

  const handleNotificationClick = async (notification) => {
    try {
      setSelectedNotification(notification);
      const action = viewedNotice(notification.id);
      const resultAction = await dispath(action);
      const result = unwrapResult(resultAction);
      console.log(result);
      handleClickOpen();
      setLoadData(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const dataRes = await userApi.getCountNotication();
        const data = dataRes.notifications;
        setNotifications(data);
        setLoadData(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [loadData]);

  const handleConfirm = async () => {
    try {
      const transaction_id = selectedNotification.transaction_id;
      const result = await transactionsApi.notifiConfirm(transaction_id);
      console.log(result);
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
      console.log(result);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: "success" });
        setLoadData(true);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <Box
    marginTop={9}
    paddingTop={3}
    paddingBottom={3}
    style={{ display: "flex", justifyContent: "center", minHeight: "700px", backgroundColor: '#F7F7F7', }}
    >
      <Paper className="col-lg-6 col-md-8 col-12" elevation={0}>
        <Typography className="p-3 fs-2" style={{ color: "#ED6C02" }}>
          Thông Báo
        </Typography>
        {notifications.map((notification, index) => (
          <HoverPaper
            className="row pt-2"
            style={{
              marginLeft: "8px",
              marginRight: "8px",
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
            <div className="col-lg-11 col-md-10 col-10">
              <Typography
                className="fst-normal"
                style={{
                  color: notification.is_read === 0 ? "#ED6C02" : "inherit",
                }}
              >
                {notification.message}
              </Typography>
              <Typography className="text-muted">
                {dayjs(notification.created_at).format("DD/MM/YYYY HH:mm")}
              </Typography>
            </div>
          </HoverPaper>
        ))}
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Thông báo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography className="fst-normal">
              {selectedNotification?.type === 0 ? (
                <Alert className="mb-2" severity="info">
                  Chưa hoàn tất
                </Alert>
              ) : selectedNotification?.type === 1 ? (
                <Alert className="mb-2" severity="success">
                  Đã đồng ý
                </Alert>
              ) : selectedNotification?.type === 2 ? (
                <Alert className="mb-2" severity="warning">
                  Đã từ chối
                </Alert>
              ) : null}
              <div className="row">
                <div className="col-lg-1 col-md-2 col-2 mt-1">
                  <Avatar
                    alt="user"
                    src={`${baseURL}${selectedNotification?.user_image}`}
                  />
                </div>
                <div className="col-lg-11 col-md-10 col-10">{selectedNotification?.message}</div>
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
    </Box>
  );
}

export default Notice;
