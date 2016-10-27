'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Serial = exports.DEFAULT_PORT = exports.PARITY_SPACE = exports.PARITY_MARK = exports.PARITY_ODD = exports.PARITY_EVEN = exports.PARITY_NONE = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _raspiPeripheral = require('raspi-peripheral');

var _serialport = require('serialport');

var _serialport2 = _interopRequireDefault(_serialport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               The MIT License (MIT)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Copyright (c) 2016 Bryan Hughes <bryan@nebri.us>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
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

var PARITY_NONE = exports.PARITY_NONE = 'none';
var PARITY_EVEN = exports.PARITY_EVEN = 'even';
var PARITY_ODD = exports.PARITY_ODD = 'odd';
var PARITY_MARK = exports.PARITY_MARK = 'mark';
var PARITY_SPACE = exports.PARITY_SPACE = 'space';

var DEFAULT_PORT = exports.DEFAULT_PORT = '/dev/ttyAMA0';

var port = Symbol('port');
var options = Symbol('options');
var portInstance = Symbol('portInstance');
var isOpen = Symbol('isOpen');

var Serial = exports.Serial = function (_Peripheral) {
  _inherits(Serial, _Peripheral);

  function Serial() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$portId = _ref.portId;
    var portId = _ref$portId === undefined ? DEFAULT_PORT : _ref$portId;
    var _ref$baudRate = _ref.baudRate;
    var baudRate = _ref$baudRate === undefined ? 9600 : _ref$baudRate;
    var _ref$dataBits = _ref.dataBits;
    var dataBits = _ref$dataBits === undefined ? 8 : _ref$dataBits;
    var _ref$stopBits = _ref.stopBits;
    var stopBits = _ref$stopBits === undefined ? 1 : _ref$stopBits;
    var _ref$parity = _ref.parity;
    var parity = _ref$parity === undefined ? PARITY_NONE : _ref$parity;

    _classCallCheck(this, Serial);

    var pins = [];
    if (port === DEFAULT_PORT) {
      pins.push('TXD0', 'RXD0');
    }

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Serial).call(this, pins));

    _this[port] = portId;
    _this[options] = {
      baudRate: baudRate,
      dataBits: dataBits,
      stopBits: stopBits,
      parity: parity
    };
    Object.defineProperties(_this, {
      port: {
        get: function get() {
          return portId;
        },

        enumerable: true
      },
      baudRate: {
        get: function get() {
          return baudRate;
        },

        enumerable: true
      },
      dataBits: {
        get: function get() {
          return dataBits;
        },

        enumerable: true
      },
      stopBits: {
        get: function get() {
          return stopBits;
        },

        enumerable: true
      },
      parity: {
        get: function get() {
          return parity;
        },

        enumerable: true
      }
    });
    return _this;
  }

  _createClass(Serial, [{
    key: 'destroy',
    value: function destroy() {
      this.close();
    }
  }, {
    key: 'open',
    value: function open(cb) {
      var _this2 = this;

      this.validateAlive();
      if (this[isOpen]) {
        setImmediate(cb);
        return;
      }
      this[portInstance] = new _serialport2.default(this[port], this[options]);
      this[portInstance].on('open', function () {
        _this2[portInstance].on('data', function (data) {
          _this2.emit('data', data);
        });
        _this2[isOpen] = true;
        cb();
      });
    }
  }, {
    key: 'close',
    value: function close(cb) {
      this.validateAlive();
      if (!this[isOpen]) {
        setImmediate(cb);
        return;
      }
      this[isOpen] = false;
      this[portInstance].close(cb);
    }
  }, {
    key: 'write',
    value: function write(data, cb) {
      this.validateAlive();
      if (!this[isOpen]) {
        throw new Error('Attempted to write to a closed serial port');
      }
      this[portInstance].write(data, cb);
    }
  }, {
    key: 'flush',
    value: function flush(cb) {
      this.validateAlive();
      if (!this[isOpen]) {
        throw new Error('Attempted to flush a closed serial port');
      }
      this[portInstance].flush(cb);
    }
  }]);

  return Serial;
}(_raspiPeripheral.Peripheral);

//# sourceMappingURL=data:application/json;base64,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UixXQUFLLFlBQUwsRUFBbUIsS0FBbkIsQ0FBeUIsRUFBekIsRUFQUTs7OzswQkFVSixNQUFNLElBQUk7QUFDZCxXQUFLLGFBQUwsR0FEYztBQUVkLFVBQUksQ0FBQyxLQUFLLE1BQUwsQ0FBRCxFQUFlO0FBQ2pCLGNBQU0sSUFBSSxLQUFKLENBQVUsNENBQVYsQ0FBTixDQURpQjtPQUFuQjtBQUdBLFdBQUssWUFBTCxFQUFtQixLQUFuQixDQUF5QixJQUF6QixFQUErQixFQUEvQixFQUxjOzs7OzBCQVFWLElBQUk7QUFDUixXQUFLLGFBQUwsR0FEUTtBQUVSLFVBQUksQ0FBQyxLQUFLLE1BQUwsQ0FBRCxFQUFlO0FBQ2pCLGNBQU0sSUFBSSxLQUFKLENBQVUseUNBQVYsQ0FBTixDQURpQjtPQUFuQjtBQUdBLFdBQUssWUFBTCxFQUFtQixLQUFuQixDQUF5QixFQUF6QixFQUxROzs7O1NBdkZDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG5Db3B5cmlnaHQgKGMpIDIwMTYgQnJ5YW4gSHVnaGVzIDxicnlhbkBuZWJyaS51cz5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuKi9cblxuaW1wb3J0IHsgUGVyaXBoZXJhbCB9IGZyb20gJ3Jhc3BpLXBlcmlwaGVyYWwnO1xuaW1wb3J0IFNlcmlhbFBvcnQgZnJvbSAnc2VyaWFscG9ydCc7XG5cbmV4cG9ydCBjb25zdCBQQVJJVFlfTk9ORSA9ICdub25lJztcbmV4cG9ydCBjb25zdCBQQVJJVFlfRVZFTiA9ICdldmVuJztcbmV4cG9ydCBjb25zdCBQQVJJVFlfT0REID0gJ29kZCc7XG5leHBvcnQgY29uc3QgUEFSSVRZX01BUksgPSAnbWFyayc7XG5leHBvcnQgY29uc3QgUEFSSVRZX1NQQUNFID0gJ3NwYWNlJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfUE9SVCA9ICcvZGV2L3R0eUFNQTAnO1xuXG5jb25zdCBwb3J0ID0gU3ltYm9sKCdwb3J0Jyk7XG5jb25zdCBvcHRpb25zID0gU3ltYm9sKCdvcHRpb25zJyk7XG5jb25zdCBwb3J0SW5zdGFuY2UgPSBTeW1ib2woJ3BvcnRJbnN0YW5jZScpO1xuY29uc3QgaXNPcGVuID0gU3ltYm9sKCdpc09wZW4nKTtcblxuZXhwb3J0IGNsYXNzIFNlcmlhbCBleHRlbmRzIFBlcmlwaGVyYWwge1xuXG4gIGNvbnN0cnVjdG9yKHsgcG9ydElkID0gREVGQVVMVF9QT1JULCBiYXVkUmF0ZSA9IDk2MDAsIGRhdGFCaXRzID0gOCwgc3RvcEJpdHMgPSAxLCBwYXJpdHkgPSBQQVJJVFlfTk9ORSB9ID0ge30pIHtcbiAgICBjb25zdCBwaW5zID0gW107XG4gICAgaWYgKHBvcnQgPT09IERFRkFVTFRfUE9SVCkge1xuICAgICAgcGlucy5wdXNoKCdUWEQwJywgJ1JYRDAnKTtcbiAgICB9XG4gICAgc3VwZXIocGlucyk7XG4gICAgdGhpc1twb3J0XSA9IHBvcnRJZDtcbiAgICB0aGlzW29wdGlvbnNdID0ge1xuICAgICAgYmF1ZFJhdGUsXG4gICAgICBkYXRhQml0cyxcbiAgICAgIHN0b3BCaXRzLFxuICAgICAgcGFyaXR5XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgIHBvcnQ6IHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBwb3J0SWRcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGJhdWRSYXRlOiB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gYmF1ZFJhdGVcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGRhdGFCaXRzOiB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YUJpdHNcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHN0b3BCaXRzOiB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gc3RvcEJpdHNcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHBhcml0eToge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcml0eVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIG9wZW4oY2IpIHtcbiAgICB0aGlzLnZhbGlkYXRlQWxpdmUoKTtcbiAgICBpZiAodGhpc1tpc09wZW5dKSB7XG4gICAgICBzZXRJbW1lZGlhdGUoY2IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzW3BvcnRJbnN0YW5jZV0gPSBuZXcgU2VyaWFsUG9ydCh0aGlzW3BvcnRdLCB0aGlzW29wdGlvbnNdKTtcbiAgICB0aGlzW3BvcnRJbnN0YW5jZV0ub24oJ29wZW4nLCAoKSA9PiB7XG4gICAgICB0aGlzW3BvcnRJbnN0YW5jZV0ub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ2RhdGEnLCBkYXRhKTtcbiAgICAgIH0pO1xuICAgICAgdGhpc1tpc09wZW5dID0gdHJ1ZTtcbiAgICAgIGNiKCk7XG4gICAgfSk7XG4gIH1cblxuICBjbG9zZShjYikge1xuICAgIHRoaXMudmFsaWRhdGVBbGl2ZSgpO1xuICAgIGlmICghdGhpc1tpc09wZW5dKSB7XG4gICAgICBzZXRJbW1lZGlhdGUoY2IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzW2lzT3Blbl0gPSBmYWxzZTtcbiAgICB0aGlzW3BvcnRJbnN0YW5jZV0uY2xvc2UoY2IpO1xuICB9XG5cbiAgd3JpdGUoZGF0YSwgY2IpIHtcbiAgICB0aGlzLnZhbGlkYXRlQWxpdmUoKTtcbiAgICBpZiAoIXRoaXNbaXNPcGVuXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0ZWQgdG8gd3JpdGUgdG8gYSBjbG9zZWQgc2VyaWFsIHBvcnQnKTtcbiAgICB9XG4gICAgdGhpc1twb3J0SW5zdGFuY2VdLndyaXRlKGRhdGEsIGNiKTtcbiAgfVxuXG4gIGZsdXNoKGNiKSB7XG4gICAgdGhpcy52YWxpZGF0ZUFsaXZlKCk7XG4gICAgaWYgKCF0aGlzW2lzT3Blbl0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXR0ZW1wdGVkIHRvIGZsdXNoIGEgY2xvc2VkIHNlcmlhbCBwb3J0Jyk7XG4gICAgfVxuICAgIHRoaXNbcG9ydEluc3RhbmNlXS5mbHVzaChjYik7XG4gIH1cblxufVxuIl19