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

const comparePrepared = (left, right) => {
  const leftMissing = left === null;
  const rightMissing = right === null;

  if (leftMissing && rightMissing) {
    return 0;
  }
  if (leftMissing) {
    return 1;
  }
  if (rightMissing) {
    return -1;
  }
  if (left === right) {
    return 0;
  }
  return left < right ? -1 : 1;
};

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const toTimestamp = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

export const compareOptionalNumbers = (left, right) =>
  comparePrepared(toNumber(left), toNumber(right));

export const compareOptionalDates = (left, right) =>
  comparePrepared(toTimestamp(left), toTimestamp(right));

export const sortByLastHeartBeatTime = (left, right) =>
  compareOptionalDates(left.lastHeartBeatTime, right.lastHeartBeatTime);

export const sortByDateCreated = (left, right) =>
  compareOptionalDates(left.dateCreated, right.dateCreated);

export const sortByInstanceState = (left, right) =>
  compareOptionalNumbers(left.instanceState, right.instanceState);

export const sortBySortOrder = (left, right) =>
  compareOptionalNumbers(left.sort, right.sort);
