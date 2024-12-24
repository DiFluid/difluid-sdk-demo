# Transmission Protocol - Microbalance(Ti)
# Overview

- *Version: 1.0.0*
- *Last Update: December 24th, 2024*
- *Minimum firmware version for Microbalance: V300*
- *Minimum firmware version for Microbalance Ti: V010*

## Microbalance UUIDs

Broadcast UUID:0000**00EE**-0000-1000-8000-00805F9B34FB

Service UUID:0000**00EE**-0000-1000-8000-00805F9B34FB

**Characteristic value**: AA01

**Please use the characteristic value FF01 channel for communication.**

## Microbalance Ti UUIDs

Broadcast UUID:0000**00DD**-0000-1000-8000-00805F9B34FB

Service UUID:0000**00DD**-0000-1000-8000-00805F9B34FB

**Characteristic value**: AA01

**Please use the characteristic value AA01 channel for communication.**

## Microbalance Protocol

### 1. Device Info
|             | Func | Func Desciption | Cmd | Cmd Description          | Data Length | Data Description                                                       | Remark |
| ----------- | ---- | --------------- | --- | ------------------------ | ----------- | ---------------------------------------------------------------------- | ------ |
| Control Cmd | 0    | Device Info     | 0   | Get SN                   | 0           | /                                                                      |        |
| Respond     | 0    | Device Info     | 0   | Respond SN               | 6           | Data 0: Package Number, Data1 - Data5: SN Data  Total length: 15 Bytes |        |
| Control Cmd | 0    | Device Info     | 1   | Get Device Model         | 0           | /                                                                      |        |
| Respond     | 0    | Device Info     | 1   | Respond Device Model     | N           | Device Model, Type: String                                             |        |
| Control Cmd | 0    | Device Info     | 2   | Get Firmware Version     | 0           | /                                                                      |        |
| Respond     | 0    | Device Info     | 2   | Respond Firmware Version | N           | Firmware Version, Type: String                                         |        |

#### *Example:*
- Get SN
  - Cmd: `DF DF 00 00 00 BE`
  - Respond: 
    ```
    DF DF 00 00 06 00 36 38 42 36 42 EC
    DF DF 00 00 06 01 33 32 34 31 37 C6
    DF DF 00 00 06 02 42 30 30 30 30 C8
    ```
  - Complete data pack: `36 38 42 36 42 33 32 34 31 37 42 30 30 30 30`
  - Decode to String: `68B6B32417B0000`
-  Get Device Model
   -  Cmd: `DF DF 00 01 00 BF`
   -  Respond: `DF DF 01 08 44 46 54 2D 53 31 30 31 B7`
   -  Decode to String: DFT-S101
-  Get Firmware Version
   -  Cmd: `DF DF 00 02 00 C0`
   -  Respond: `DF DF 00 02 17 56 30 30 31 BE`
   -  Decode to String: V001

### 2. Device Settings
|             | Func | Func Desciption | Cmd | Cmd Description                    | Data Length | Data Description                      | Remark                                                                                                                                                                                                     |
| ----------- | ---- | --------------- | --- | ---------------------------------- | ----------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Control Cmd | 1    | Device Settings | 0   | Get Sensor Data Auto Send Flag     | 0           | /                                     | Sensor Data Format : [3. Device Data & Control](#3-device-data--control)                                                                                                                                   |
| Respond     | 1    | Device Settings | 0   | Respond Sensor Data Auto Send Flag | 1           | 0: Off, 1: On                         |                                                                                                                                                                                                            |
| Control Cmd | 1    | Device Settings | 0   | Set Sensor Data Auto Send Flag     | 1           | 0: Off, 1: On                         |                                                                                                                                                                                                            |
| Respond     | 1    | Device Settings | 0   | Respond Sensor Data Auto Send Flag | 1           | 0: Off, 1: On                         |                                                                                                                                                                                                            |
| Control Cmd | 1    | Device Settings | 1   | Get Auto Detect Timing Status      | 0           | /                                     |                                                                                                                                                                                                            |
| Respond     | 1    | Device Settings | 1   | Respond Auto Detect Timing Status  | 1           | 0: Off, 1: On                         |                                                                                                                                                                                                            |
| Control Cmd | 1    | Device Settings | 1   | Set Auto Detect Timing Status      | 1           | 0: Off, 1: On                         |                                                                                                                                                                                                            |
| Respond     | 1    | Device Settings | 1   | Respond Auto Detect Timing Status  | 1           | 0: Off, 1: On                         |                                                                                                                                                                                                            |
| Control Cmd | 1    | Device Settings | 2   | Get Auto Stop Timing Status        | 0           | /                                     |                                                                                                                                                                                                            |
| Respond     | 1    | Device Settings | 2   | Respond Auto Stop Timing Status    | 1           | 0: Off, 1: On                         |                                                                                                                                                                                                            |
| Control Cmd | 1    | Device Settings | 2   | Set Auto Stop Timing Status        | 1           | 0: Off, 1: On                         |                                                                                                                                                                                                            |
| Respond     | 1    | Device Settings | 2   | Respond Auto Stop Timing Status    | 1           | 0: Off, 1: On                         |                                                                                                                                                                                                            |
| Control Cmd | 1    | Device Settings | 3   | Get Weight Unit Switch Lock        | 0           | /                                     | When `Weight Unit Switch Lock` is on, Microbalance will be disabled double-clicking on the `Power button` to toggle the weight unit. You can still switch weight units using protocol(Func = 1, CMD = 4 ). |
| Respond     | 1    | Device Settings | 3   | Respond Weight Unit Switch Lock    | 1           | 0: Off, 1: On                         |                                                                                                                                                                                                            |
| Control Cmd | 1    | Device Settings | 3   | Set Weight Unit Switch Lock        | 1           | 0: Off, 1: On                         |                                                                                                                                                                                                            |
| Respond     | 1    | Device Settings | 3   | Respond Weight Unit Switch Lock    | 1           | 0: Off, 1: On                         |                                                                                                                                                                                                            |
| Control Cmd | 1    | Device Settings | 4   | Get Weight Unit                    | 0           | /                                     |                                                                                                                                                                                                            |
| Respond     | 1    | Device Settings | 4   | Respond Weight Unit                | 1           | Weight Unit, 0:gram 1:ounce  2:gering |                                                                                                                                                                                                            |
| Control Cmd | 1    | Device Settings | 4   | Set Weight Unit                    | 1           |                                       |                                                                                                                                                                                                            |
| Respond     | 1    | Device Settings | 4   | Respond Weight Unit                | 1           |                                       |                                                                                                                                                                                                            |

#### *Example:*

- Get Sensor Data Auto Send Flag
  - Cmd: `DF DF 01 00 00  BF`
  - Respond: `DF DF 01 00 01 00 C0`
  - Decode to Result: 0x00 = Off
- Set Sensor Data Auto Send Flag
  - Cmd: `DF DF 01 00 01 01 C1`
  - Respond: `DF DF 01 00 01 01 C1`
  - Decode to Result: 0x00 = On
- Get Auto Detect Timing Status
  - Cmd: `DF DF 01 01 01 C0`
  - Respond: `DF DF 01 01 01 00 C1`
  - Decode to Result: 0x00 = Off
- Set Auto Detect Timing Status
  - Cmd: `DF DF 01 01 01 00 C1`
  - Respond: `DF DF 01 01 01 00 C1`
  - Decode to Result: 0x00 = Off
- Get Weight Unit Switch Lock
  - Cmd: `DF DF 01 03 00 C2`
  - Respond: `DF DF 01 03 01 00 C3`
  - Decode to Result: 0x00 = Off
- Set Weight Unit Switch Lock
  - Cmd: `DF DF 01 03 01 00 C3`
  - Respond: `DF DF 01 03 01 00 C3`
  - Decode to Result: 0x00 = Off
- Get Weight Unit
  - Cmd: `DF DF 01 04 00 C3`
  - Respond: `DF DF 01 04 01 00 C4`
  - Decode to Result: 0x00 = gram
- Set Weight Unit
  - Cmd: `DF DF 01 04 01 01 C5`
  - Respond: `DF DF 01 04 01 01 C5`
  - Decode to Result: 0x01 = ounce

### 3. Device Data & Control

#### How to Tare

Use `Power Button Single Click`(Func = 3, Cmd = 2)

#### How to use the timing function

Start timer ,Use `DLink Button Single Click`(Func = 3, Cmd = 2)

Stop timer ,Use `DLink Button Press` (Func = 3, Cmd = 1)

Exit Stop state , Use `DLink Button Single Click`(Func = 3, Cmd = 2)

#### Difference: DLink Button Single Click and Press

The difference between **single click** and **press** is that **press** is only used when timing needs to be paused, and **single click** is used in other cases.(In future updates, we will fix this difference.)

|             | Func | Func Desciption | Cmd | Cmd Description                    | Data Length | Data Description                                                                                                                                                              | Remark                                                                                                                            |
| ----------- | ---- | --------------- | --- | ---------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Control Cmd | 3    | Device Data     | 0   | Get Sensor Data                    | 0           | /                                                                                                                                                                             |                                                                                                                                   |
| Respond     | 3    | Device Data     | 0   | Respond Sensor Data                | 12          | See [Sensor Data Details](#sensor-data-details)                                                                                                                               | If set [Auto send](#2-device-settings) On（Func:1 Cmd:0）, the data will be sent automatically.                                   |
| Control Cmd | 3    | Device Control  | 1   | Control DLink Button Press         | 1           | 0                                                                                                                                                                             | [Difference: DLink Button Single Click and Press](#difference-dlink-button-single-click-and-press)                                |
| Respond     | 3    | Device Control  | 1   | Respond DLink Press Status         | 1           | 0:Respond DLink Button Press<br />1:Device Trigger DLink Button Press                                                                                                         |                                                                                                                                   |
| Control Cmd | 3    | Device Control  | 2   | Control Button Single Click        | 1           | 0:Control DLink Button Single Click<br />1:Control Power Button Single Click                                                                                                  | Control Timer : Use `DLink Button Single Click`.<br />Tare : Use `Power Button Single Click`                                      |
| Respond     | 3    | Device Control  | 2   | Respond Button Single Click Status | 1           | 0:Respond DLink Button Single Click<br />1:Respond Power Button Single Click<br />2:Device Trigger DLink Button Single Click <br />3:Device Trigger Power Button Single Click |                                                                                                                                   |
| Control Cmd | 3    | Device Control  | 3   | Control Button Double Click        | 1           | 0:Control DLink Button Double Click<br />1:Control Power Button Double Click                                                                                                  | Enter the device information page : Use `DLink Button Double Click` .<br />Switch weight units : Use `Power Button Double Click`. |
| Respond     | 3    | Device Control  | 3   | Respond Button Double Click Status | 1           | 0:Respond DLink Button Double Click<br />1:Respond Power Button Double Click<br />2:Device Trigger DLink Button Double Click<br />3:Device Trigger Power Button Double Click  |                                                                                                                                   |
| Control Cmd | 3    | Device Control  | 4   | Control Button Long Press          | 1           | 0:Control DLink Button Long Press<br />1:Control Power Button Long Press                                                                                                      | Reserved : `DLink Button Long Press`.<br />Shutdown : Use `Power Button Long Press`                                               |
| Respond     | 3    | Device Control  | 4   | Respond Button Long Press Status   | 1           | 0:Respond DLink Button Long Press<br />1:Respond Power Button Long Press<br />2:Device Trigger DLink Button Long Press<br />3:Device Trigger Power Button Long Press          |                                                                                                                                   |
| Control Cmd | 3    | Device Control  | 5   | Get Device Status                  | 0           | /                                                                                                                                                                             |                                                                                                                                   |
| Respond     | 3    | Device Control  | 5   | Respond Device Status              | 8           | Data0: [Device Status](#- Device Status)<br />Data1: battery power (Range: 0-100)<br />Data2: charge status (1: charging  0:Idle)<br />Data3-7: Reserved                      |                                                                                                                                   |

#### - Sensor Data Details [(Example)](#example-2)

| Data        | Data0-3(weight)                       | Data4-5(flow rate) | Data6-7(time) | Data8-11(device timestamp) | Dtat12(weight unit)                |
| ----------- | ------------------------------------- | ------------------ | ------------- | -------------------------- | :--------------------------------- |
| Description | weight (gram:x10 oz:x1000 gering:x10) | flow rate (x10)    | time          | device                     | weight unit (0:gram 1:oz 2:gering) |

#### - Device Status

| Value(Decimal) | Description             | Value(Decimal) | Description              |
| -------------- | ----------------------- | -------------- | ------------------------ |
| 0              | Power Down              | 8              | OTA in progress          |
| 1              | Charging                | 9              | OTA Failed               |
| 2              | Low Power Mode 1        | 10             | Timing in progress       |
| 3              | Low-Battery Shutdown    | 11             | Timer Pause              |
| 4              | Startup                 | 12             | Reserved                 |
| 5              | Idle                    | 13             | Low Power Mode 2         |
| 6              | Show Device Information | 14             | Auto Stop Timing Trigger |
| 7              | Tare in progress        |                |                          |

#### *Example:*

- Get Sensor Data
  - Cmd: `DF DF 03 00 00 C1`
  - Respond: `DF DF 03 00 0D 00 00 02 F8 00 00 00 00 00 0A 27 B0 00 A9`
  - Decode to Result: 
    - Data0-3: `00 00 02 F8 -> 0x000002F8 = 760` , weight: 760 / 10 = 76g
    - Data4-5: `00 00 -> 0x0000 = 0` , flow rate: 0
    - Data6-7: `00 00 -> 0x0000 = 0` , count time: 0
    - Data8-11: `00 0A 27 B0 -> 0x000A27B0 = 665520` , system tick: 665520 
    - Data12: `00 -> 0x00 = 0` , weight unit: gram
- Control DLink Button Press
  - Cmd: `DF DF 03 01 01 00 C3`
  - Respond: `DF DF 03 01 01 00 C3`
- Control Button Single Click single double
  - Cmd: `DF DF 03 02 01 01 C5`
  - Respond: `DF DF 03 02 01 01 C5`

- Control Button Double Click
  - Cmd: `DF DF 03 03 01 00 C5`
  - Respond: `DF DF 03 03 01 00 C5`
- Control Button Long Press
  - Cmd: `DF DF 03 04 01 01 C7`
  - Respond: `DF DF 03 04 01 01 C7`
- Get Device Status
  - Cmd: `DF DF 03 05 00 C6`
  - Respond: `DF DF 03 05 08 05 64 01 00 00 00 00 00 38`
  - Decode to Result: 
    - Data0: 0x05 = 5 , Device Status: Idle
    - Data1: 0x64 = 100 , Battery Power: 100%
    - Data2: 0x01 = 1 , Charge Status: Charging
