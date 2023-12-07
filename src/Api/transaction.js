import axios from "axios";
import axiosClient from "./axiosClient";

const transactionsApi = {
  history_transactions() {
    const url = `/api/history-transactions`;
    return axiosClient.get(url);
  },
  confirmReceived(transaction_id) {
    const url = `/api/confirm-received`;
    return axiosClient.post(url, transaction_id);
  },
  notifiConfirm(transaction_id) {
    const url = `/api/notifi-confirm`;
    return axiosClient.post(url, transaction_id);
  },
  notifiRefuse(transaction_id) {
    const url = `/api/notifi-refuse`;
    return axiosClient.post(url, transaction_id);
  },
  notifiViewed(notifi_id) {
    const url = `/api/notifi-viewed`;
    return axiosClient.post(url, notifi_id);
  },
  detailTransaction(transaction_id) {
    const url = `/api/detail-transaction/${transaction_id}`;
    return axiosClient.get(url);
  }
};
export default transactionsApi;