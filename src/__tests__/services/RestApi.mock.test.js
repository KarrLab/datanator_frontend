import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";
import axios from "axios";
import {
  errorDialog,
  errorDialogRef
} from "~/components/ErrorDialog/ErrorDialog";
import { render } from "@testing-library/react";

jest.mock("axios");

/* global jest, describe, it, expect */

describe("With mocked API calls", () => {
  it("Request successful", async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: { message: "Api server is up." }
    });

    await getDataFromApi(["status"]).then(response => {
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Api server is up.");
    });
  });

  it("Request failed", async () => {
    axios.get.mockRejectedValue({
      response: { status: 404, data: { status: 404, detail: "Server error." } }
    });

    render(errorDialog);
    console.error = jest.fn();
    const customErrMsg = "Custom error message";
    await getDataFromApi(["not-implemented"], {}).catch(
      genApiErrorHandler(["not-implemented"], customErrMsg)
    );
    expect(console.error.mock.calls[0][0]).toMatch(/^Server error 404:/);

    // close error dialog
    errorDialogRef.current.close();
  });

  it("Request canceled", async () => {
    axios.get.mockRejectedValue({});
    axios.isCancel.mockResolvedValue(true);

    console.info = jest.fn();
    let cancelTokenSource = { token: 0, cancel: () => {} };
    const request = getDataFromApi(["status"], {
      cancelToken: cancelTokenSource.token
    }).catch(genApiErrorHandler(["status"]));
    cancelTokenSource.cancel();
    await request;
    expect(console.info.mock.calls[0][0]).toMatch(
      /^Request 'status' cancelled/
    );
  });
});
