"use strict";
/*
The MIT License (MIT)

Copyright (c) 2014-2017 Bryan Hughes <bryan@nebri.us>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var raspi_peripheral_1 = require("raspi-peripheral");
var SerialPort = require("serialport");
exports.PARITY_NONE = 'none';
exports.PARITY_EVEN = 'even';
exports.PARITY_ODD = 'odd';
exports.PARITY_MARK = 'mark';
exports.PARITY_SPACE = 'space';
exports.DEFAULT_PORT = '/dev/ttyAMA0';
function createEmptyCallback(cb) {
    return function () {
        if (cb) {
            cb();
        }
    };
}
function createErrorCallback(cb) {
    return function (err) {
        if (cb) {
            cb(err);
        }
    };
}
var Serial = /** @class */ (function (_super) {
    __extends(Serial, _super);
    function Serial(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.portId, portId = _c === void 0 ? exports.DEFAULT_PORT : _c, _d = _b.baudRate, baudRate = _d === void 0 ? 9600 : _d, _e = _b.dataBits, dataBits = _e === void 0 ? 8 : _e, _f = _b.stopBits, stopBits = _f === void 0 ? 1 : _f, _g = _b.parity, parity = _g === void 0 ? exports.PARITY_NONE : _g;
        var _this = this;
        var pins = [];
        if (portId === exports.DEFAULT_PORT) {
            pins.push('TXD0', 'RXD0');
        }
        _this = _super.call(this, pins) || this;
        _this._portId = portId;
        _this._options = {
            portId: portId,
            baudRate: baudRate,
            dataBits: dataBits,
            stopBits: stopBits,
            parity: parity
        };
        process.on('beforeExit', function () {
            _this.destroy();
        });
        return _this;
    }
    Object.defineProperty(Serial.prototype, "port", {
        get: function () {
            return this._portId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Serial.prototype, "baudRate", {
        get: function () {
            return this._options.baudRate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Serial.prototype, "dataBits", {
        get: function () {
            return this._options.dataBits;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Serial.prototype, "stopBits", {
        get: function () {
            return this._options.stopBits;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Serial.prototype, "parity", {
        get: function () {
            return this._options.parity;
        },
        enumerable: true,
        configurable: true
    });
    Serial.prototype.destroy = function () {
        this.close();
    };
    Serial.prototype.open = function (cb) {
        var _this = this;
        this.validateAlive();
        if (this._isOpen) {
            if (cb) {
                setImmediate(cb);
            }
            return;
        }
        this._portInstance = new SerialPort(this._portId, {
            lock: false,
            baudRate: this._options.baudRate,
            dataBits: this._options.dataBits,
            stopBits: this._options.stopBits,
            parity: this._options.parity
        });
        this._portInstance.on('open', function () {
            _this._portInstance.on('data', function (data) {
                _this.emit('data', data);
            });
            _this._isOpen = true;
            if (cb) {
                cb();
            }
        });
    };
    Serial.prototype.close = function (cb) {
        this.validateAlive();
        if (!this._isOpen) {
            if (cb) {
                setImmediate(cb);
            }
            return;
        }
        this._isOpen = false;
        this._portInstance.close(createErrorCallback(cb));
    };
    Serial.prototype.write = function (data, cb) {
        this.validateAlive();
        if (!this._isOpen) {
            throw new Error('Attempted to write to a closed serial port');
        }
        this._portInstance.write(data, createEmptyCallback(cb));
    };
    Serial.prototype.flush = function (cb) {
        this.validateAlive();
        if (!this._isOpen) {
            throw new Error('Attempted to flush a closed serial port');
        }
        this._portInstance.flush(createErrorCallback(cb));
    };
    return Serial;
}(raspi_peripheral_1.Peripheral));
exports.Serial = Serial;
//# sourceMappingURL=index.js.map