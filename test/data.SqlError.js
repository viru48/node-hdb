// Copyright 2013 SAP AG.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http: //www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific
// language governing permissions and limitations under the License.
'use strict';

var lib = require('./hdb').lib;
var PartKind = lib.common.PartKind;
var SqlError = lib.data[PartKind.ERROR];

describe('Data', function () {

  describe('#SqlError', function () {

    it('should deserialize sqlError from buffer', function () {
      var error = {
        message: 'hello',
        code: 1,
        position: 2,
        level: 3,
        sqlState: 'HY001'
      };
      var length = Buffer.byteLength(error.message);
      var buffer = new Buffer(18 + length);
      buffer.writeInt32LE(error.code, 0);
      buffer.writeInt32LE(error.position, 4);
      buffer.writeInt32LE(length, 8);
      buffer.writeInt8(error.level, 12);
      buffer.write(error.sqlState, 13, 5);
      buffer.write(error.message, 18, length);
      SqlError.read({
        buffer: buffer,
        argumentCount: 1
      }).toPlainObject().should.eql(error);
    });

  });

});