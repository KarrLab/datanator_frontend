import { getDataFromApi } from "~/services/RestApi";
import axios from "axios";
import { ErrorDialog } from "~/components/ErrorDialog/ErrorDialog";
import React from "react";
import { render } from "@testing-library/react";

jest.mock("axios");

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

  const errorDialogRef = React.createRef();
  render(<ErrorDialog ref={errorDialogRef} />);
  console.log = jest.fn();
  await getDataFromApi(["not-implemented"], {}, null, errorDialogRef);
  expect(console.log.mock.calls[0][0]).toMatch(/^Server error 404:/);
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
