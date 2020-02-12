import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";
import axios from "axios";

/* global jest, describe, it, expect */

describe("With real API calls", () => {
  it("Request canceled", async () => {
    console.info = jest.fn();
    let cancelTokenSource = axios.CancelToken.source();
    const request = getDataFromApi(["status"], {
      cancelToken: cancelTokenSource.token
    })
      .catch(genApiErrorHandler(["status"]))
      .finally(() => {
        cancelTokenSource = null;
      });
    cancelTokenSource.cancel();
    await request;
    expect(console.info.mock.calls[0][0]).toMatch(
      /^Request 'status' cancelled/
    );
  });
});
