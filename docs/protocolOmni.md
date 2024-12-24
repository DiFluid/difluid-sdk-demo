# Transmission Protocol - Omni

# Overview

- *Version: 1.0.0*
- *Last Update: December 24th, 2024*
- *Least Firmware Version: V016*

## UUIDs

Broadcast UUID:0000**00E0**-0000-1000-8000-00805F9B34FB

Service UUID:0000**00E0**-0000-1000-8000-00805F9B34FB

**Characteristic value**: AA01

**Please use the characteristic value AA01 channel for communication.**

## **Update plan**

1. More detailed baking distribution data.
2. More detailed particle size distribution data.
3. Raw particle size data.

# Omni Protocol

## 1. Device Info

|             | Func | Func Desciption | Cmd  | Cmd Description          | Data Length | Data Description                                             | Remark |
| ----------- | ---- | --------------- | ---- | ------------------------ | ----------- | ------------------------------------------------------------ | ------ |
| Control Cmd | 0    | Device Info     | 0    | Get SN                   | 0           | /                                                            |        |
| Respond     | 0    | Device Info     | 0    | Respond SN               | 6           | Data 0: Package Number, Data1 - Data5: SN Data  Total length: 15 Bytes |        |
| Control Cmd | 0    | Device Info     | 1    | Get Device Model         | 0           | /                                                            |        |
| Respond     | 0    | Device Info     | 1    | Respond Device Model     | N           | Device Model, Type: String                                   |        |
| Control Cmd | 0    | Device Info     | 2    | Get Firmware Version     | 0           | /                                                            |        |
| Respond     | 0    | Device Info     | 2    | Respond Firmware Version | N           | Firmware Version, Type: String                               |        |

### *Example:*

- Get SN
  - Cmd: `DF DF 00 00 00 BE`
  - Respond: `DF DF 00 00 10 32 34 35 38 37 43 36 35 38 39 34 38 30 30 30 30 23`
  - Decode to String: `24587C6589480000`
- Get Device Model
  -  Cmd: `DF DF 00 01 00 BF`
  -  Respond: `DF DF 00 01 0A 44 46 54 2D 53 44 31 30 31 00 FD`
  -  Decode to String: DFT-SD101
- Get Firmware Version
  -  Cmd: `DF DF 00 02 00 C0`
  -  Respond: `DF DF 00 02 04 63 31 65 61 1E`
  -  Decode to String: T003

## 2. Device Settings

|             | Func | Func Desciption | Cmd  | Cmd Description              | Data Length | Data Description                                             | Remark |
| ----------- | ---- | --------------- | ---- | ---------------------------- | ----------- | ------------------------------------------------------------ | ------ |
| Control Cmd | 1    | Device Settings | 0    | Get Auto Diffusor Status     | 0           | /                                                            |        |
| Respond     | 1    | Device Settings | 0    | Respond Auto Diffusor Status | 4           | 0: Off, 1: On                                                |        |
| Control Cmd | 1    | Device Settings | 0    | Set Auto Diffusor Status     | 4           | 0: Off, 1: On                                                |        |
| Respond     | 1    | Device Settings | 0    | Respond Auto Diffusor Status | 4           | 0: Off, 1: On                                                |        |
| Control Cmd | 1    | Device Settings | 1    | Get Agtron Standards         | 0           | /                                                            |        |
| Respond     | 1    | Device Settings | 1    | Respond Agtron Standards     | 1           | 0: COMMON<br />1: SCA                                        |        |
| Control Cmd | 1    | Device Settings | 1    | Set Agtron Standards         | 1           | 0: COMMON<br />1: SCA                                        |        |
| Respond     | 1    | Device Settings | 1    | Respond Agtron Standards     | 1           | 0: COMMON<br />1: SCA                                        |        |
| Control Cmd | 1    | Device Settings | 2    | Get Sliver Skin Level        | 0           | /                                                            |        |
| Respond     | 1    | Device Settings | 2    | Respond Sliver Skin Level    | 4           | Range: 0-5                                                   |        |
| Control Cmd | 1    | Device Settings | 2    | Set Sliver Skin Level        | 4           | Range: 0-5                                                   |        |
| Respond     | 1    | Device Settings | 2    | Respond Sliver Skin Level    | 4           | Range: 0-5                                                   |        |
| Control Cmd | 1    | Device Settings | 3    | Get Particle Standards       | 0           | /                                                            |        |
| Respond     | 1    | Device Settings | 3    | Respond Particle Standards   | 1           | 0: IOS<br />1: ASTM<br />2:TYLER                             |        |
| Control Cmd | 1    | Device Settings | 3    | Set Particle Standards       | 1           | 0: IOS<br />1: ASTM<br />2:TYLER                             |        |
| Respond     | 1    | Device Settings | 3    | Respond Particle Standards   | 1           | 0: IOS<br />1: ASTM<br />2:TYLER                             |        |
| Control Cmd | 1    | Device Settings | 4    | Get Max Particle Range       | 0           | /                                                            |        |
| Respond     | 1    | Device Settings | 4    | Respond Max Particle Range   | 4           | 0: 1100 um<br />1: 1400 um<br />2:1700 um<br />3:2500 um     |        |
| Control Cmd | 1    | Device Settings | 4    | Set Max Particle Range       | 4           | 0: 1100 um<br />1: 1400 um<br />2:1700 um<br />3:2500 um     |        |
| Respond     | 1    | Device Settings | 4    | Respond Max Particle Range   | 4           | 0: 1100 um<br />1: 1400 um<br />2:1700 um<br />3:2500 um     |        |
| Control Cmd | 1    | Device Settings | 5    | Get Back Light Level         | 0           | /                                                            |        |
| Respond     | 1    | Device Settings | 5    | Respond Back Light Level     | 1           | Range: 30-100 (Step:10)                                      |        |
| Control Cmd | 1    | Device Settings | 5    | Set Back Light Level         | 1           | Range: 30-100 (Step:10)                                      |        |
| Respond     | 1    | Device Settings | 5    | Respond Back Light Level     | 1           | Range: 30-100 (Step:10)                                      |        |
| Control Cmd | 1    | Device Settings | 6    | Get Language                 | 0           | /                                                            |        |
| Respond     | 1    | Device Settings | 6    | Respond Language             | 4           | 0: English<br />1: Chinese<br />2:Traditional Chinese<br />3:Japanese<br />4:Thai<br />5:Korean |        |
| Control Cmd | 1    | Device Settings | 6    | Set Language                 | 4           | 0: English<br />1: Chinese<br />2:Traditional Chinese<br />3:Japanese<br />4:Thai<br />5:Korean |        |
| Respond     | 1    | Device Settings | 6    | Respond Language             | 4           | 0: English<br />1: Chinese<br />2:Traditional Chinese<br />3:Japanese<br />4:Thai<br />5:Korean |        |

### *Example:*

- Get Auto Diffusor Status
  - Cmd: `DF DF 01 00 00 BF`
  - Respond: `DF DF 01 00 04 01 00 00 00 C4`
  - Decode to Result: 0x01 = Auto Diffusor On
- Set Auto Diffusor Status
  - Cmd: `DF DF 01 00 04 00 00 00 00 C3`
  - Respond: `DF DF 01 00 04 00 00 00 00 C3`
  - Decode to Result: 0x01 = Auto Diffusor Off
- Get Agtron Standards
  - Cmd: `DF DF 01 01 00 C0`
  - Respond: `DF DF 01 01 01 00 C1`
  - Decode to Result: 0x00 = ISO
- Set Agtron Standards
  - Cmd: `DF DF 01 01 01 01 C2`
  - Respond: `DF DF 01 01 01 01 C2`
  - Decode to Result: 0x01 = SCA
- Get Sliver Skin Level
  - Cmd: `DF DF 01 02 00 C1`
  - Respond: `DF DF 01 02 04 05 00 00 00 CA`
  - Decode to Result: 0x05 = 5
- Set Sliver Skin Level
  - Cmd: `DF DF 01 02 04 02 00 00 00 C7`
  - Respond: `DF DF 01 02 04 02 00 00 00 C7`
  - Decode to Result: 0x2 = 2
- Get Particle Standards
  - Cmd: `DF DF 01 03 00 C2`
  - Respond: `DF DF 01 03 01 00 C3`
  - Decode to Result: 0x00 = ISO
- Set Particle Standards
  - Cmd: `DF DF 01 03 01 01 C4`
  - Respond: `DF DF 01 03 01 01 C4`
  - Decode to Result: 0x01 = ASTM
- Get Max Particle Range
  - Cmd: `DF DF 01 04 00 C3`
  - Respond: `DF DF 01 04 04 03 00 00 00 CA`
  - Decode to Result: 0x03 = 2500um
- Set Max Particle Range
  - Cmd: `DF DF 01 04 04 01 00 00 00 C8`
  - Respond: `DF DF 01 04 04 01 00 00 00 C8`
  - Decode to Result: 0x01 = 1400 um
- Get Back Light Level
  - Cmd: `DF DF 01 05 00 C4`
  - Respond: `DF DF 01 05 01 3C 01`
  - Decode to Result: 0x3c = 60%
- Set Back Light Level
  - Cmd: `DF DF 01 05 01 1E E3`
  - Respond: `DF DF 01 05 01 1E E3`
  - Decode to Result: 0x1E = 30
- Get Language
  - Cmd: `DF DF 01 06 00 C5`
  - Respond: `DF DF 01 06 04 00 00 00 00 C9`
  - Decode to Result: 0x00 = English
- Set Language
  - Cmd: `DF DF 01 06 04 01 00 00 00 CA`
  - Respond: `DF DF 01 06 04 01 00 00 00 CA`
  - Decode to Result: 0x01 = Chinese

## 3. Device Action

|             | Func | Func Desciption | Cmd  | Cmd Description        | Data Length | Data Description               | Remark |
| ----------- | ---- | --------------- | ---- | ---------------------- | ----------- | ------------------------------ | ------ |
| Control Cmd | 3    | Device Action   | 0    | Auto test              | 0           | /                              |        |
| Respond     | 3    | Device Action   | 0    | Respond Startup Status | 1           | 1:Startup successful 0:Failure |        |
| Control Cmd | 3    | Device Action   | 1    | Agtron test            | 0           | /                              |        |
| Respond     | 3    | Device Action   | 1    | Respond Startup Status | 1           | 1:Startup successful 0:Failure |        |
| Control Cmd | 3    | Device Action   | 2    | Particle test          | 0           | /                              |        |
| Respond     | 3    | Device Action   | 2    | Respond Startup Status | 1           | 1:Startup successful 0:Failure |        |
| Respond     | 3    | Device Action   | 3    | Agtron Result          | N           |                                |        |
| Respond     | 3    | Device Action   | 4    | Particle Result        | N           |                                |        |
|             |      |                 |      |                        |             |                                |        |

### - Agtron Result Respond

Respond: DF DF 03 03 44 **00 00 00 00 D7 77 1E 42 00 00 00 00 09 F6 70 3C 1D E0 A8 3E 46 6F BD 3E FB B1 37 3E 46 D1 9D 3D 14 BA ED 3C 58 DF 19 41 AC EF 9C 41 AC EF EC 41 D6 77 1E 42 D6 77 46 42 D6 77 6E 42 EA 3B 8B 42 38 CC 26 41** AA

Data Parsing with Reference to C Structs:

```
struct coffee_agtron_sdk_result_t 
{
    int type;            			// 0-Bean  1-Powder
    float agtron_avg;              	// Agtron average value
    float histogram_X[7];   		// Histogram subscripts
    float histogram_X_ratio[7];     // Histogram subscripts percentage
    float var_value;            	// Variance
};
```



### - Particle Result Respond

- Respond: `DF DF 03 02 01 01 C5 DF DF 03 04 5C 8E 62 83 43 F6 46 1D 3F F4 5F 78 3E 38 84 12 3E 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 C8 42 00 00 96 43 00 80 D4 43 00 00 16 44 00 80 54 44 00 80 93 44 00 00 AF 44 00 80 D4 44 00 80 13 45 00 40 1C 45 53 A7 E6 42 C0 03 00 00 00 00 00 00 B0`

Data Parsing with Reference to C Structs:

```
struct coffee_particle_sdk_result_t 
{
    float D50;              	// Median Particle Size
    float histogram_X_ratio[9];	// Particle Size Distribution Interval Percentage 
    float histogram_X[9 + 1]; 	// Particle Size Distribution Range (subscripts)
    float var_value;        	// Variance
    uint32_t count;         	// Total Number of Particles
    float score_value;      	// Whether the Vibration Mechanism is Executed
};
```


### *Example:*

- Auto test

  - Cmd: `DF DF 03 00 00 C1`

  - Respond: `DF DF 03 00 01 01 C3`

    0x01 = Startup successful

    At the end of the test, the results are returned from cmd 3 and 4.

- Agtron test

  - Cmd: `DF DF 03 01 00 C2`

  - Respond: `DF DF 03 01 01 01 C4`

    At the end of the test, the results are returned from cmd 3.

- Particle test

  - Cmd: `DF DF 03 02 00 C3`

  - Respond: `DF DF 03 02 01 01 C5`

    At the end of the test, the results are returned from cmd 4.