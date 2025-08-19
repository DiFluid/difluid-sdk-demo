# Transmission Protocol - AirWave

# Overview

- *Version: 1.0.0*
- *Last Update: August 19h, 2025*
- *Least Firmware Version: V003*

## UUIDs

Broadcast UUID:0000**00E3**-0000-1000-8000-00805F9B34FB

Service UUID:0000**00E3**-0000-1000-8000-00805F9B34FB

**Characteristic value**: AA01

**Please use the characteristic value AA01 channel for communication.**

## **Update plan**



# AirWave Protocol

## 1. Device Info

|             | Func | Func Desciption | Cmd  | Cmd Description          | Data Length | Data Description               | Remark |
| ----------- | ---- | --------------- | ---- | ------------------------ | ----------- | ------------------------------ | ------ |
| Control Cmd | 0    | Device Info     | 0    | Get SN                   | 0           | /                              |        |
| Respond     | 0    | Device Info     | 0    | Respond SN               | 16          | Data  Total length: 16 Bytes   |        |
| Control Cmd | 0    | Device Info     | 1    | Get Device Model         | 0           | /                              |        |
| Respond     | 0    | Device Info     | 1    | Respond Device Model     | 10          | Device Model, Type: String     |        |
| Control Cmd | 0    | Device Info     | 2    | Get Firmware Version     | 0           | /                              |        |
| Respond     | 0    | Device Info     | 2    | Respond Firmware Version | 5           | Firmware Version, Type: String |        |

### *Example:*

- Get SN
  - Cmd: `DF DF 00 00 00 BE`
  - Respond: `DF DF 00 00 10 46 32 31 30 31 35 38 31 39 41 30 31 30 30 31 00 E2`  
  - Decode to String: `F21015819A01001`
- Get Device Model
  -  Cmd: `DF DF 00 01 00 BF`
  -  Respond: `DF DF 00 01 0A 44 46 54 2D 53 46 31 30 31 00 FF`
  -  Decode to String: DFT-SF101
- Get Firmware Version
  -  Cmd: `DF DF 00 02 00 C0`
  -  Respond: `DF DF 00 02 05 54 30 31 32 00 AC`
  -  Decode to String: T012

## 2. Device Settings

|             | Func | Func Desciption | Cmd  | Cmd Description  | Data Length | Data Description                                             | Remark |
| ----------- | ---- | --------------- | ---- | ---------------- | ----------- | ------------------------------------------------------------ | ------ |
| Control Cmd | 1 | Device Settings | 6 | Get Language | ~~0~~       | /                                                            |        |
| Respond | 1 | Device Settings | 6 | Respond Language | ~~4~~       | 0: Chinese<br />1: Chinese<br />2: English<br />3: Japanese<br />4: Korean ||
| Control Cmd | 1    | Device Settings | 6    | Set Language     | 4           | 0: Chinese<br />1: Chinese<br />2: English<br />3: Japanese<br />4: Korean ||
| Respond     | 1    | Device Settings | 6    | Respond Language | 4           | 0: Chinese<br />1: Chinese<br />2: English<br />3: Japanese<br />4: Korean ||

### *Example:*

- Get Language
  - Cmd: `DF DF 01 00 00 BF`
  - Respond: `DF DF 01 00 04 00 00 00 00 C3`
  - Decode to Result: 0x00 = Chinese
- Set Language
  - Cmd: `DF DF 01 00 04 01 00 00 00 C4`
  - Respond: `DF DF 01 00 04 01 00 00 00 C4`
  - Decode to Result: 0x01 = English

## 3. Device Action

|             | Func | Func Desciption | Cmd  | Cmd Description        | Data Length | Data Description                                             | Remark |
| ----------- | ---- | --------------- | ---- | ---------------------- | ----------- | ------------------------------------------------------------ | ------ |
| Control Cmd | 3    | Device Action   | 0    | Get position          | 0           | / ||
| Respond     | 3    | Device Action   | 0    | Respond get position | 1           | 0: Standard Filtration<br />1: Extreme Filtration<br />2: Fan Only |        |
| Control Cmd | 3    | Device Action   | 0    | Set position | 1          | 0: Standard Filtration<br />1: Extreme Filtration<br />2: Fan Only |        |
| Respond     | 3    | Device Action   | 0    | Respond set position | 1           | 0: Standard Filtration<br />1: Extreme Filtration<br />2: Fan Only |  |
| Control Cmd | 3    | Device Action   | 1    | Get wind percentage | 0           | /                                                            |        |
| Respond     | 3    | Device Action   | 1    | Respond get wind percentage | 1           | Wind percentage:30-100        |        |
| Control Cmd | 3    | Device Action   | 1    | Set wind percentage | 1           | Wind percentage:30-100 |        |
| Respond     | 3    | Device Action   | 1    | Respond set wind percentage | 1           | Wind percentage:30-100 |        |
| Control Cmd | 3 | Device Action | 2 | Get running status | 0 | / |  |
| Respond | 3 | Device Action | 2 | Respond get running status | 1 | 0: Stopped<br />1: Running |  |
| Control Cmd | 3 | Device Action | 2 | Set running status | 1 | 0: Stopped<br />1: Running |        |
| Respond | 3 | Device Action | 2 | Respond set running status | 1 | 0: Stopped<br />1: Running |  |
| Control Cmd | 3 | Device Action | 3 | Get temperature | 0 | struct  Temperature_s{<br/>    float inlet_air_temp;<br/>    float catalyst_temp;<br/>} ; | |
| Respond | 3 | Device Action | 3 | Respond get temperature | 8 | struct  Temperature_s{<br/>    float inlet_air_temp;<br/>    float catalyst_temp;<br/>} ; | |


### *Example:*

- Get position

  - Cmd: `DF DF 03 00 00 C1`

  - Respond: `DF DF 03 00 01 01 C3`

    0x01 = Extreme Filtration

- Set position (After setting the position, it also returns the wind power percentagefor that position.)

  - Cmd: `DF DF 03 00 01 00 C2`

  - Respond: `DF DF 03 00 01 00 C2`

    0x00 = Standard Filtration

- Get wind percentage

  - Cmd: `DF DF 03 01 00 C2`

  - Respond: `DF DF 03 01 01 4B 0E `

    0x4B = 75%

- Set wind percentage

  - Cmd: `DF DF 03 01 01 55 18`

  - Respond: `DF DF 03 01 01 55 18`

    0x55 = 85%

- Get running status

  - Cmd: `DF DF 03 02 00 C3`

  - Respond: `DF DF 03 02 01 00 C4 `

    0x00 = Stopped

- Set running status (Unavailable in self-clean mode)

  - Cmd: `DF DF 03 02 01 01 C5`

  - Respond: `DF DF 03 02 01 01 C5`

    0x00 = Running 

- Get temperature

  - Cmd: `DF DF 03 03 00 C4`

  - Respond: `DF DF 03 03 08 1E 04 D1 41 03 8F E0 41 B3  `

    1E 04 D1 41 03 8F E0 41: parse as little-endian float

    - inlet_air_temp: ≈ 26.127℃

    - catalyst_temp: ≈ 28.070℃