// Copyright 2008-2015 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// This is adapted from mjsunit/for-in.js.

// Flags: --harmony-reflect


function props(x) {
  var array = [];
  for (var p of Reflect.enumerate(x)) array.push(p);
  return array.sort();
}

assertEquals(0, props({}).length, "olen0");
assertEquals(1, props({x:1}).length, "olen1");
assertEquals(2, props({x:1, y:2}).length, "olen2");

assertArrayEquals(["x"], props({x:1}), "x");
assertArrayEquals(["x", "y"], props({x:1, y:2}), "xy");
assertArrayEquals(["x", "y", "zoom"], props({x:1, y:2, zoom:3}), "xyzoom");

assertEquals(0, props([]).length, "alen0");
assertEquals(1, props([1]).length, "alen1");
assertEquals(2, props([1,2]).length, "alen2");

assertArrayEquals(["0"], props([1]), "0");
assertArrayEquals(["0", "1"], props([1,2]), "01");
assertArrayEquals(["0", "1", "2"], props([1,2,3]), "012");

var o = {};
var a = [];
for (var i = 0x0020; i < 0x01ff; i+=2) {
  var s = 'char:' + String.fromCharCode(i);
  a.push(s);
  o[s] = i;
}
assertArrayEquals(a, props(o), "charcodes");

var a = [];
assertEquals(0, props(a).length, "proplen0");
a[Math.pow(2,30)-1] = 0;
assertEquals(1, props(a).length, "proplen1");
a[Math.pow(2,31)-1] = 0;
assertEquals(2, props(a).length, "proplen2");
a[1] = 0;
assertEquals(3, props(a).length, "proplen3");

var result = '';
for (var p of Reflect.enumerate({a : [0], b : 1})) { result += p; }
assertEquals('ab', result, "ab");

var result = '';
for (var p of Reflect.enumerate({a : {v:1}, b : 1})) { result += p; }
assertEquals('ab', result, "ab-nodeep");

var result = '';
for (var p of Reflect.enumerate({ get a() {}, b : 1})) { result += p; }
assertEquals('ab', result, "abget");

var result = '';
for (var p of Reflect.enumerate({ get a() {}, set a(x) {}, b : 1})) {
  result += p;
}
assertEquals('ab', result, "abgetset");

(function() {
  var large_key = 2147483650;
  var o = {__proto__: {}};
  o[large_key] = 1;
  o.__proto__[large_key] = 1;
  var keys = [];
  for (var k of Reflect.enumerate(o)) {
    keys.push(k);
  }
  assertEquals(["2147483650"], keys);
})();
