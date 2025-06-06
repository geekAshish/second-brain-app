import { toast } from "react-toastify";

export const onSuccessNotify = (msg: string) => toast(msg, { type: "success" });
export const onErrorNotify = (msg: string) => toast(msg, { type: "error" });
export const onInfoNotify = (msg: string) => toast(msg, { type: "info" });
export const onWarningNotify = (msg: string) => toast(msg, { type: "warning" });
