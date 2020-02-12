import { getDataFromApi } from "~/services/RestApi";
import axios from "axios";
import {
  errorDialog,
  errorDialogRef
} from "~/components/ErrorDialog/ErrorDialog";
import { render } from "@testing-library/react";

jest.mock("axios");

/* global jest, test, expect */

test("Request successful", async () => {
  axios.get.mockResolvedValue({
    status: 200,
    data: { message: "Api server is up." }
  });

  await getDataFromApi(["status"]).then(response => {
    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Api server is up.");
  });
});

test("Request failed", async () => {
  axios.get.mockRejectedValue({
    response: { status: 404, data: { status: 404, detail: "Server error." } }
  });

  render(errorDialog);
  console.log = jest.fn();
  const customErrMsg = "Custom error message";
  await getDataFromApi(["not-implemented"], {}, customErrMsg, errorDialogRef);
  expect(console.log.mock.calls[0][0]).toMatch(/^Server error 404:/);

  // close error dialog
  errorDialogRef.current.close();
});

test("Request canceled", async () => {
  axios.get.mockRejectedValue({});
  axios.isCancel.mockResolvedValue(true);

  console.log = jest.fn();
  // const cancelTokenSource = axios.CancelToken.source();
  const request = getDataFromApi(["status"], {});
  // cancelTokenSource.cancel();
  await request;
  expect(console.log.mock.calls[0][0]).toMatch(/^Request 'status' cancelled/);
});
