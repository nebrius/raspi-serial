Raspi Serial
============

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nebrius/raspi-io?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Raspi Serial is part of the [Raspi.js suite](https://github.com/nebrius/raspi) that provides access to UART ports, either the built-in port or a USB add-on port.

If you have a bug report, feature request, or wish to contribute code, please be sure to check out the [Raspi IO Contributing Guide](https://github.com/nebrius/raspi-io/blob/master/CONTRIBUTING.md).

## Installation

First, be sure that you have installed [raspi](https://github.com/nebrius/raspi).

Install with NPM:

```Shell
npm install raspi-serial
```

**Warning**: this module indirectly requires GCC 4.8 or newer. This means that you should be running Raspbian Jessie or newer, released in September of 2015.

**Note:** You _must_ reboot your Raspberry Pi after installing Raspi Serial. Serial support is not enabled by default, and this module runs a script to enable it automatically and adjust a few serial settings. Notably, serial login is _disabled_ by this module. Be aware that having serial login enabled will cause conflicts when trying to read and write to it from Node. These settings will not take effect until you reboot your Pi.

**Note:** this project is written in [TypeScript](http://www.typescriptlang.org/) and includes type definitions in the package.json file. This means that if you want to use it from TypeScript, you don't need to install a separate @types module.

## Example Usage

```JavaScript
const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;

raspi.init(() => {
  var serial = new Serial();
  serial.open(() => {
    serial.write('Hello from raspi-serial');
    serial.on('data', (data) => {
      process.stdout.write(data);
    });
  });
});
```

## API

### Module Constants

<table>
  <thead>
    <tr>
      <th>Constant</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>DEFAULT_PORT</td>
    <td>The port ID of the default serial port, equals `"/dev/ttyAMA0"`</td>
  </tr>
  <tr>
    <td>PARITY_NONE</td>
    <td>Use no parity, one of five possible values for the <code>parity</code> property in the constructor options</td>
  </tr>
  <tr>
    <td>PARITY_EVEN</td>
    <td>Use even parity, one of five possible values for the <code>parity</code> property in the constructor options</td>
  </tr>
  <tr>
    <td>PARITY_ODD</td>
    <td>Use odd parity, one of five possible values for the <code>parity</code> property in the constructor options</td>
  </tr>
  <tr>
    <td>PARITY_MARK</td>
    <td>Use mark parity, one of five possible values for the <code>parity</code> property in the constructor options</td>
  </tr>
  <tr>
    <td>PARITY_SPACE</td>
    <td>Use space parity, one of five possible values for the <code>parity</code> property in the constructor options</td>
  </tr>
</table>

### new Serial(options)

Instantiates a new Serial instance with the given options, defaulting to the built-in UART port. Check the [wiring information wiki](https://github.com/nebrius/raspi-io/wiki) for more information.

**Note:** the port is _not_ automatically opened.

_Arguments_:

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>options (optional)</td>
    <td>Object</td>
    <td>The configuration options.</td>
  </tr>
  <tr>
    <td></td>
    <td colspan="2">
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tr>
          <td>portId (optional)</td>
          <td>String</td>
          <td>The port to open, defaults to <code>'/dev/ttyAMA0'</code></td>
        </tr>
        <tr>
          <td>baudRate (optional)</td>
          <td>Number</td>
          <td>The baud rate, defaults to 9600</td>
        </tr>
        <tr>
          <td>dataBits (optional)</td>
          <td>Number</td>
          <td>The number of data bits in a character, defaults to 8</td>
        </tr>
        <tr>
          <td>stopBits (optional)</td>
          <td>Number</td>
          <td>The number of stop bits in a character, defaults to 1</td>
        </tr>
        <tr>
          <td>parity (optional)</td>
          <td>
            <code>PARITY_NONE</code> | <code>PARITY_EVEN</code> | <code>PARITY_ODD</code> | <code>PARITY_MARK</code> | <code>PARITY_SPACE</code>
          </td>
          <td>The parity of a character, defaults to <code>PARITY_NONE</code></td>
        </tr>
      </table>
    </td>
  </tr>
</table>

### Instance Properties

#### port

The serial port tied to this instance

_Type_: String

#### baudRate

The baud rate tied to this instance

_Type_: Number

#### dataBits

The number of data bits tied to this instance

_Type_: Number

#### stopBits

The number of stop bits tied to this instance

_Type_: Number

#### parity

The parity tied to this instance

_Type_: One of `PARITY_NONE`, `PARITY_EVEN`, `PARITY_ODD`, `PARITY_MARK`, or `PARITY_SPACE`

### Instance Methods

#### open(cb)

Open the port.

_Arguments_:

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>cb (optional)</td>
    <td>Function</td>
    <td>The callback to call once opening is complete</td>
  </tr>
  <tr>
    <td></td>
    <td colspan="2">
      <em>No arguments</em>
    </td>
  </tr>
</table>

_Returns_: None

#### close(cb)

Close the port.

_Arguments_:

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>cb (optional)</td>
    <td>Function</td>
    <td>The callback to call once closing is complete</td>
  </tr>
  <tr>
    <td></td>
    <td colspan="2">
      <table>
        <thead>
          <tr>
            <th>Argument</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tr>
          <td>err</td>
          <td>String | null</td>
          <td>The error, if one occurred, else null</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

_Returns_: None

#### write(data, cb)

Write the given data to the serial port.

_Arguments_:

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>data</td>
    <td>Buffer | String</td>
    <td>The data to write to the port</td>
  </tr>
  <tr>
    <td>cb (optional)</td>
    <td>Function</td>
    <td>The callback to call once writing is complete</td>
  </tr>
  <tr>
    <td></td>
    <td colspan="2">
      <em>No arguments</em>
    </td>
  </tr>
</table>

_Returns_: None

#### flush(cb)

Flushes the serial port.

_Arguments_:

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>cb (optional)</td>
    <td>Function</td>
    <td>The callback to call once writing is complete</td>
  </tr>
  <tr>
    <td></td>
    <td colspan="2">
      <table>
        <thead>
          <tr>
            <th>Argument</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tr>
          <td>err</td>
          <td>String | null</td>
          <td>The error, if one occurred, else null</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

_Returns_: None

### Events

#### on('data', function(data))

Fired whenever data is received on the serial port.

_Callback Arguments_:

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>data</td>
    <td>Buffer</td>
    <td>The data read from the serial port.</td>
  </tr>
</table>

License
=======

The MIT License (MIT)

Copyright (c) 2016 Bryan Hughes (bryan@nebri.us)

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
