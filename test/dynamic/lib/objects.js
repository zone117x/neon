var addon = require("../native");
var assert = require("chai").assert;

describe("JsObject", function () {
  it("return the v8::Global object", function () {
    assert(global === addon.return_js_global_object());
  });

  it("return a JsObject built in Rust", function () {
    assert.deepEqual({}, addon.return_js_object());
  });

  it("return a JsObject with a number key value pair", function () {
    assert.deepEqual({ number: 9000 }, addon.return_js_object_with_number());
  });

  it("return a JsObject with an string key value pair", function () {
    assert.deepEqual(
      { string: "hello node" },
      addon.return_js_object_with_string()
    );
  });

  it("return a JsObject with mixed content key value pairs", function () {
    assert.deepEqual(
      { number: 9000, string: "hello node" },
      addon.return_js_object_with_mixed_content()
    );
  });

  it("gets a 16-byte, zeroed ArrayBuffer", function () {
    var b = addon.return_array_buffer();
    assert.equal(b.byteLength, 16);
    assert.equal(new Uint32Array(b)[0], 0);
    assert.equal(new Uint32Array(b)[1], 0);
    assert.equal(new Uint32Array(b)[2], 0);
    assert.equal(new Uint32Array(b)[3], 0);
  });

  it("correctly reads an ArrayBuffer using the lock API", function () {
    var b = new ArrayBuffer(16);
    var a = new Uint32Array(b);
    a[0] = 47;
    a[1] = 133;
    a[2] = 9;
    a[3] = 88888888;
    assert.equal(addon.read_array_buffer_with_lock(b, 0), 47);
    assert.equal(addon.read_array_buffer_with_lock(b, 1), 133);
    assert.equal(addon.read_array_buffer_with_lock(b, 2), 9);
    assert.equal(addon.read_array_buffer_with_lock(b, 3), 88888888);
  });

  it("correctly reads an ArrayBuffer using the borrow API", function () {
    var b = new ArrayBuffer(16);
    var a = new Uint32Array(b);
    a[0] = 49;
    a[1] = 135;
    a[2] = 11;
    a[3] = 89898989;
    assert.equal(addon.read_array_buffer_with_borrow(b, 0), 49);
    assert.equal(addon.read_array_buffer_with_borrow(b, 1), 135);
    assert.equal(addon.read_array_buffer_with_borrow(b, 2), 11);
    assert.equal(addon.read_array_buffer_with_borrow(b, 3), 89898989);
  });

  it("correctly reads an empty ArrayBuffer using the borrow API", function () {
    let nonempty = Uint8Array.from([1, 2, 3]);
    assert.equal(addon.sum_array_buffer_with_borrow(nonempty.buffer), 6);

    let empty = Uint8Array.from([]);
    assert.equal(addon.sum_array_buffer_with_borrow(empty.buffer), 0);
  });

  it("correctly writes to an ArrayBuffer using the lock API", function () {
    var b = new ArrayBuffer(16);
    addon.write_array_buffer_with_lock(b, 0, 999);
    assert.equal(new Uint32Array(b)[0], 999);
    addon.write_array_buffer_with_lock(b, 1, 111);
    assert.equal(new Uint32Array(b)[1], 111);
    addon.write_array_buffer_with_lock(b, 2, 121212);
    assert.equal(new Uint32Array(b)[2], 121212);
    addon.write_array_buffer_with_lock(b, 3, 99991111);
    assert.equal(new Uint32Array(b)[3], 99991111);
  });

  it("correctly writes to an ArrayBuffer using the borrow_mut API", function () {
    var b = new ArrayBuffer(16);
    addon.write_array_buffer_with_borrow_mut(b, 0, 434);
    assert.equal(new Uint32Array(b)[0], 434);
    addon.write_array_buffer_with_borrow_mut(b, 1, 100);
    assert.equal(new Uint32Array(b)[1], 100);
    addon.write_array_buffer_with_borrow_mut(b, 2, 22);
    assert.equal(new Uint32Array(b)[2], 22);
    addon.write_array_buffer_with_borrow_mut(b, 3, 400100);
    assert.equal(new Uint32Array(b)[3], 400100);
  });

  it("correctly writes to an empty ArrayBuffer using the borrow API", function () {
    let nonempty = Uint8Array.from([1, 2, 3]);
    addon.increment_array_buffer_with_borrow_mut(nonempty.buffer);
    assert.deepEqual(Array.from(nonempty), [2, 3, 4]);

    let empty = Uint8Array.from([]);
    addon.increment_array_buffer_with_borrow_mut(empty.buffer);
    assert.deepEqual(Array.from(empty), []);
  });

  it("gets a 16-byte, zeroed Buffer", function () {
    var b = addon.return_buffer();
    assert.ok(b.equals(Buffer.alloc(16)));
  });

  it("correctly reads a Buffer using the lock API", function () {
    var b = Buffer.allocUnsafe(16);
    b.writeUInt32LE(147, 0);
    b.writeUInt32LE(1133, 4);
    b.writeUInt32LE(109, 8);
    b.writeUInt32LE(189189, 12);
    assert.equal(addon.read_buffer_with_lock(b, 0), 147);
    assert.equal(addon.read_buffer_with_lock(b, 1), 1133);
    assert.equal(addon.read_buffer_with_lock(b, 2), 109);
    assert.equal(addon.read_buffer_with_lock(b, 3), 189189);
  });

  it("correctly reads a Buffer using the borrow API", function () {
    var b = Buffer.allocUnsafe(16);
    b.writeUInt32LE(149, 0);
    b.writeUInt32LE(2244, 4);
    b.writeUInt32LE(707, 8);
    b.writeUInt32LE(22914478, 12);
    assert.equal(addon.read_buffer_with_borrow(b, 0), 149);
    assert.equal(addon.read_buffer_with_borrow(b, 1), 2244);
    assert.equal(addon.read_buffer_with_borrow(b, 2), 707);
    assert.equal(addon.read_buffer_with_borrow(b, 3), 22914478);
  });

  it("correctly reads an empty Buffer using the borrow API", function () {
    let nonempty = Buffer.from([1, 2, 3]);
    assert.equal(addon.sum_buffer_with_borrow(nonempty), 6);

    let empty = Buffer.from([]);
    assert.equal(addon.sum_buffer_with_borrow(empty), 0);
  });

  it("correctly writes to a Buffer using the lock API", function () {
    var b = Buffer.allocUnsafe(16);
    b.fill(0);
    addon.write_buffer_with_lock(b, 0, 6);
    assert.equal(b.readUInt32LE(0), 6);
    addon.write_buffer_with_lock(b, 1, 6000001);
    assert.equal(b.readUInt32LE(4), 6000001);
    addon.write_buffer_with_lock(b, 2, 4500);
    assert.equal(b.readUInt32LE(8), 4500);
    addon.write_buffer_with_lock(b, 3, 421600);
    assert.equal(b.readUInt32LE(12), 421600);
  });

  it("correctly writes to a Buffer using the borrow_mut API", function () {
    var b = Buffer.allocUnsafe(16);
    b.fill(0);
    addon.write_buffer_with_borrow_mut(b, 0, 16);
    assert.equal(b.readUInt32LE(0), 16);
    addon.write_buffer_with_borrow_mut(b, 1, 16000001);
    assert.equal(b.readUInt32LE(4), 16000001);
    addon.write_buffer_with_borrow_mut(b, 2, 232);
    assert.equal(b.readUInt32LE(8), 232);
    addon.write_buffer_with_borrow_mut(b, 3, 66012);
    assert.equal(b.readUInt32LE(12), 66012);
  });

  it("correctly writes to an empty Buffer using the borrow API", function () {
    let nonempty = Buffer.from([1, 2, 3]);
    addon.increment_buffer_with_borrow_mut(nonempty);
    assert.deepEqual(Array.from(nonempty), [2, 3, 4]);

    let empty = Buffer.from([]);
    addon.increment_buffer_with_borrow_mut(empty);
    assert.deepEqual(Array.from(empty), []);
  });
});
