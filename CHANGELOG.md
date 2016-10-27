## 2.0.0 (2016-10-27)

- Upgraded serialport to version 4
    - POTENTIALLY BREAKING CHANGE: the callback to raspi-serial's `write` method is directly passed to serialport's `write` method, which changed behavior in version 4. See [serialport's upgrade guide](https://github.com/EmergingTechnologyAdvisors/node-serialport/blob/master/UPGRADE_GUIDE.md) for more info

## 1.5.0 (2016-7-7)

- Switched dependency ranges to ^
- Bumped dependencies to bring in support for a new Raspberry Pi Zero revision

## 1.4.0 (2016-3-20)

- Added alive checks

## 1.3.1 (2016-3-20)

- Dependency update to fix bug
- New build system

## 1.3.0 (2016-3-13)

- Added `flush` method

## 1.2.0 (2016-3-13)

- Added `DEFAULT_PORT` constant

## 1.1.0 (2016-3-13)

- Added accessors for `port`, `baudRate`, `dataBits`, `stopBits`, and `parity`

## 1.0.0 (2016-3-8)

- Initial implementation
