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

import { getEnvironmentHost, REQUEST_URL_PATTERN } from "./ApiDebug";

jest.mock("dva/fetch", () => jest.fn());
jest.mock("react-html-parser", () => jest.fn(() => null));
jest.mock("react-json-view", () => () => null);
jest.mock("./HeadersEditor", () => () => null);
jest.mock("../../../utils/AuthButton", () => ({ children }) => children);
jest.mock("../../../utils/IntlUtils", () => ({
  getIntlContent: (key) => key,
}));
jest.mock("../../../services/api", () => ({
  createOrUpdateMockRequest: jest.fn(),
  deleteMockRequest: jest.fn(),
  getApiMockRequest: jest.fn(),
  sandboxProxyGateway: jest.fn(() => "/sandbox"),
}));

describe("ApiDebug environment URLs", () => {
  it.each([
    ["http://example.com", "http://example.com"],
    ["https://example.com", "https://example.com"],
    ["http://example.com:8080", "http://example.com:8080"],
    ["https://example.com:8443", "https://example.com:8443"],
    ["https://example.com:443", "https://example.com"],
  ])("builds the host for %s", (addressUrl, expected) => {
    expect(getEnvironmentHost(addressUrl)).toBe(expected);
  });

  it.each([
    "http://example.com/api",
    "https://example.com/api",
    "http://example.com:8080/api",
    "https://example.com:8443/api",
  ])("accepts a request URL with or without an explicit port: %s", (url) => {
    expect(REQUEST_URL_PATTERN.test(url)).toBe(true);
  });
});
