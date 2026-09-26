/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { message } from "antd";
import {
  addMcpServer,
  deleteMcpServer,
  fetchMcpServer,
  updateMcpServer,
} from "../services/api";
import model from "./mcpServer";

jest.mock("antd", () => ({
  message: {
    success: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock("../services/api", () => ({
  addMcpServer: jest.fn(),
  deleteMcpServer: jest.fn(),
  fetchMcpServer: jest.fn(),
  mcpSwaggerImport: jest.fn(),
  updateMcpServer: jest.fn(),
}));

jest.mock("../utils/IntlUtils", () => ({
  getIntlContent: (key) => key,
}));

const call = (fn, payload) => ({ type: "call", fn, payload });
const put = (action) => ({ type: "put", action });
const effects = { call, put };

beforeEach(() => {
  jest.clearAllMocks();
});

describe("mcpServer fetch", () => {
  it("stores data only for a successful response", () => {
    const payload = { currentPage: 2, pageSize: 24 };
    const response = {
      code: 200,
      data: [{ id: "server-1" }],
      total: 1,
    };
    const generator = model.effects.fetch({ payload }, effects);

    expect(generator.next().value).toEqual(call(fetchMcpServer, payload));
    expect(generator.next(response).value).toEqual(
      put({
        type: "saveList",
        payload: {
          list: response.data,
          total: response.total,
          currentPage: payload.currentPage,
          pageSize: payload.pageSize,
        },
      }),
    );
    expect(generator.next().done).toBe(true);
    expect(message.warn).not.toHaveBeenCalled();
  });

  it("warns and does not store data for a failed response", () => {
    const payload = { currentPage: 1, pageSize: 12 };
    const response = { code: 500, message: "Unable to load MCP servers" };
    const generator = model.effects.fetch({ payload }, effects);

    generator.next();
    expect(generator.next(response).done).toBe(true);
    expect(message.warn).toHaveBeenCalledWith(response.message);
  });
});

describe.each([
  ["add", addMcpServer, "SHENYU.COMMON.RESPONSE.ADD.SUCCESS"],
  ["update", updateMcpServer, "SHENYU.COMMON.RESPONSE.UPDATE.SUCCESS"],
  ["delete", deleteMcpServer, "SHENYU.COMMON.RESPONSE.DELETE.SUCCESS"],
])("mcpServer %s", (effectName, api, successMessage) => {
  it("reloads and calls back after a successful response", () => {
    const payload = { id: "server-1" };
    const callback = jest.fn();
    const generator = model.effects[effectName](
      { payload, callback },
      effects,
    );

    expect(generator.next().value).toEqual(call(api, payload));
    expect(generator.next({ code: 200 }).value).toEqual(
      put({ type: "reload" }),
    );
    expect(message.success).toHaveBeenCalledWith(successMessage);
    expect(callback).not.toHaveBeenCalled();

    expect(generator.next().done).toBe(true);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(message.warn).not.toHaveBeenCalled();
  });

  it("warns without reloading or calling back after a failed response", () => {
    const payload = { id: "server-1" };
    const callback = jest.fn();
    const response = { code: 500, message: "Request failed" };
    const generator = model.effects[effectName](
      { payload, callback },
      effects,
    );

    generator.next();
    expect(generator.next(response).done).toBe(true);
    expect(message.warn).toHaveBeenCalledWith(response.message);
    expect(message.success).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });
});
