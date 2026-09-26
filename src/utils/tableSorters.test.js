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

import {
  compareOptionalDates,
  compareOptionalNumbers,
  sortByDateCreated,
  sortByInstanceState,
  sortByLastHeartBeatTime,
  sortBySortOrder,
} from "./tableSorters";

describe("compareOptionalNumbers", () => {
  it("compares numeric values and numeric strings", () => {
    expect(compareOptionalNumbers(2, 10)).toBeLessThan(0);
    expect(compareOptionalNumbers("20", 3)).toBeGreaterThan(0);
    expect(compareOptionalNumbers("7", 7)).toBe(0);
  });

  it("sorts missing or invalid values after valid numbers", () => {
    expect(compareOptionalNumbers(null, 1)).toBeGreaterThan(0);
    expect(compareOptionalNumbers(undefined, 1)).toBeGreaterThan(0);
    expect(compareOptionalNumbers("", 1)).toBeGreaterThan(0);
    expect(compareOptionalNumbers("not-a-number", 1)).toBeGreaterThan(0);
    expect(compareOptionalNumbers(null, undefined)).toBe(0);
  });
});

describe("compareOptionalDates", () => {
  it("compares date values chronologically", () => {
    expect(
      compareOptionalDates("2026-09-25T12:00:00Z", "2026-09-26T12:00:00Z"),
    ).toBeLessThan(0);
    expect(
      compareOptionalDates("2026-09-27T12:00:00Z", "2026-09-26T12:00:00Z"),
    ).toBeGreaterThan(0);
  });

  it("sorts missing or invalid values after valid dates", () => {
    expect(compareOptionalDates(null, "2026-09-26T12:00:00Z")).toBeGreaterThan(
      0,
    );
    expect(
      compareOptionalDates("invalid", "2026-09-26T12:00:00Z"),
    ).toBeGreaterThan(0);
    expect(compareOptionalDates(undefined, "")).toBe(0);
  });
});

describe("table field sorters", () => {
  it("sorts instance timestamps by their displayed fields", () => {
    const older = {
      instanceType: "z",
      lastHeartBeatTime: "2026-09-25T12:00:00Z",
      dateCreated: "2026-09-24T12:00:00Z",
    };
    const newer = {
      instanceType: "a",
      lastHeartBeatTime: "2026-09-26T12:00:00Z",
      dateCreated: "2026-09-27T12:00:00Z",
    };

    expect(sortByLastHeartBeatTime(older, newer)).toBeLessThan(0);
    expect(sortByDateCreated(older, newer)).toBeLessThan(0);
  });

  it("sorts instance state by state instead of instance type", () => {
    const offline = { instanceType: "z", instanceState: 0 };
    const online = { instanceType: "a", instanceState: 1 };

    expect(sortByInstanceState(offline, online)).toBeLessThan(0);
  });

  it("sorts plugin order numerically instead of by role", () => {
    const first = { role: "z", sort: "2" };
    const later = { role: "a", sort: "10" };

    expect(sortBySortOrder(first, later)).toBeLessThan(0);
  });

  it("places rows with missing target values after populated rows", () => {
    expect(
      sortByLastHeartBeatTime({}, { lastHeartBeatTime: "2026-09-26" }),
    ).toBeGreaterThan(0);
    expect(sortByInstanceState({}, { instanceState: 0 })).toBeGreaterThan(0);
    expect(sortBySortOrder({}, { sort: 1 })).toBeGreaterThan(0);
  });
});
