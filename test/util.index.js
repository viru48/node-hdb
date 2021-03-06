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
/* jshint expr: true */

var lib = require('./hdb').lib;
var EventEmitter = require('events').EventEmitter;
var util = lib.util;

describe('Util', function () {

  describe('#index', function () {

    it('should create a read stream', function (done) {
      var ds = new EventEmitter();
      var resumeCount = 0;
      ds.resume = function resume() {
        resumeCount += 1;
      };
      var pauseCount = 0;
      ds.pause = function pause() {
        pauseCount += 1;
      };
      var readable = util.createReadStream(ds, {
        objectMode: true
      });
      var chunks = [];
      readable.on('readable', function () {
        var chunk = this.read();
        var value = chunk[0];
        chunks.unshift(value);
        value -= 1;
        if (value) {
          ds.emit('data', new Buffer([value]));
        } else {
          ds.emit('end');
        }
      });
      readable.on('end', function () {
        resumeCount.should.equal(4);
        chunks.should.eql([1, 2, 3]);
        done();
      });
      ds.emit('data', false);
      ds.emit('data', new Buffer([3]));
    });

    it('should convert from camelCase', function () {
      util.cc2_('fooBar').should.equal('FOO_BAR');
    });

    it('should convert to camelCase', function () {
      util._2cc('FOO_BAR').should.equal('fooBar');
    });

  });

});