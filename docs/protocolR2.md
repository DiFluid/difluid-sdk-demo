# Transmission Protocol - R2 Extract
#### - *Version: 1.0.0*
#### - *Last Update: Mar 18th 2023*
#### - *Least Firmware Version: 2.1.2*

## R2 Protocol

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
  - Complete data pack: `36 38 42 36 42 33 32 34 31 3742 30 30 30 30`
  - Decode to String: `68B6B32417B0000`
-  Get Device Model
   -  Cmd: `DF DF 00 01 00 BF`
   -  Respond: `DF DF 00 01 08 44 46 54 2D 52 31 30 32 B7`
   -  Decode to String: DFT-R102
-  Get Firmware Version
   -  Cmd: `DF DF 00 02 00 C0`
   -  Respond: `DF DF 00 02 04 54 30 30 33 AB`
   -  Decode to String: T003

### 2. Device Settings
|             | Func | Func Desciption | Cmd | Cmd Description           | Data Length | Data Description    | Remark                                         |
| ----------- | ---- | --------------- | --- | ------------------------- | ----------- | ------------------- | ---------------------------------------------- |
| Control Cmd | 1    | Device Settings | 0   | Get Temperature Unit      | 0           | /                   |                                                |
| Respond     | 1    | Device Settings | 0   | Respond Temperature Unit  | 1           | 0: ℃, 1: ℉          |                                                |
| Control Cmd | 1    | Device Settings | 0   | Set Temperature Unit      | 1           | 0: ℃, 1: ℉          |                                                |
| Respond     | 1    | Device Settings | 0   | Respond Temperature Unit  | 1           | 0: ℃, 1: ℉          |                                                |
| Control Cmd | 1    | Device Settings | 1   | Get Auto Test Status      | 0           | /                   |                                                |
| Respond     | 1    | Device Settings | 1   | Respond Auto Test Status  | 1           | 0: Off, 1: On       |                                                |
| Control Cmd | 1    | Device Settings | 1   | Set Auto Test Status      | 1           | 0: Off, 1: On       |                                                |
| Respond     | 1    | Device Settings | 1   | Respond Auto Test Status  | 1           | 0: Off, 1: On       |                                                |
| Control Cmd | 1    | Device Settings | 2   | Get Screen Brightness     | 0           | /                   |                                                |
| Respond     | 1    | Device Settings | 2   | Respond Screen Brightness | 1           | Range: 30 - 100 (%) |                                                |
| Control Cmd | 1    | Device Settings | 2   | Set Screen Brightness     | 1           | Range: 30 - 100 (%) |                                                |
| Respond     | 1    | Device Settings | 2   | Respond Screen Brightness | 1           | Range: 30 - 100 (%) |                                                |
| Control Cmd | 1    | Device Settings | 3   | Get Number of Tests       | 0           | /                   |                                                |
| Respond     | 1    | Device Settings | 3   | Respond Number of Tests   | 1           | Range: 1 - 10       | this setting only takes effect on offline test |
| Control Cmd | 1    | Device Settings | 3   | Set Number of Tests       | 1           | Range: 1 - 10       | this setting only takes effect on offline test |
| Respond     | 1    | Device Settings | 3   | Respond Number of Tests   | 1           | Range: 1 - 10       | this setting only takes effect on offline test |

#### *Example:*
- Get Temperature Unit
  - Cmd: `DF DF 01 00 00 BF`
  - Respond: `DF DF 01 00 01 01 C1`
  - Decode to Result: 0x01 = ℉
- Set Temperature Unit
  - Cmd: `DF DF 01 00 01 00 C0`
  - Respond: `DF DF 01 00 01 00 C0`
  - Decode to Result: 0x00 = ℃
- Get Auto Test Status
  - Cmd: `DF DF 01 01 00 C0`
  - Respond: `DF DF 01 01 01 01 C2`
  - Decode to Result: 0x01 = On
- Set Auto Test Status
  - Cmd: `DF DF 01 01 01 00 C1`
  - Respond: `DF DF 01 01 01 00 C1`
  - Decode to Result: 0x00 = Off
- Get Screen Brightness
  - Cmd: `DF DF 01 02 00 C1`
  - Respond: `DF DF 01 02 01 1E E0`
  - Decode to Result: 0x1E = 30, current brighness is 30%
- Set Screen Brightness
  - Cmd: `DF DF 01 02 01 64 26`
  - Respond: `DF DF 01 02 01 64 26`
  - Decode to Result: 0x64 = 100, current brightness is 100%
- Get Number of Tests
  - Cmd: `DF DF 01 03 00 C2`
  - Respond: `DF DF 01 03 01 03 C6`
  - Decode to Result: 0x03 = 3, number of tests is 3
- Set Number of Tests
  - Cmd: `DF DF 01 03 01 01 C4`
  - Respond: `DF DF 01 03 01 01 C4`
  - Decode to Result: 0x01 = 1, number of tests is 1

### 3. Device Action
|             | Func | Func Desciption | Cmd | Cmd Description             | Data Length | Data Description                                | Remark                                                                                |
| ----------- | ---- | --------------- | --- | --------------------------- | ----------- | ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| Control Cmd | 3    | Device Action   | 0   | Single test                 | 0           | /                                               |                                                                                       |
| Respond     | 3    | Device Action   | 0   | Respond single test result  | N           | Data0: package number, Data1-DataN: Result data | see [single test respond](#single-test-respond)                                       |
| Control Cmd | 3    | Device Action   | 1   | Average test                | 1           | 1 Byte, Type: uint8_t ()                        | Average test requires passing in number of tests, this would affect the setting above |
| Respond     | 3    | Device Action   | 1   | Respond average test result | N           |                                                 | see [average test respond](#average-test-respond)                                     |
| Control Cmd | 3    | Device Action   | 2   | Calibrate                   | 0           | /                                               |                                                                                       |
| Respond     | 3    | Device Action   | 2   | Respond calibration result  | N           | Range: 30 - 100 (%)                             | see [calibration respond](#calibration-respond)                                       |
| Respond     | 3    | Device Action   | 2   | Temperature                 | N           | Data0: package number, Data1-DataN: Result data |                                                                                       |
| Respond     | 3    | Device Action   | 254 | Error Code                  | 0           | /                                               | see [error code](#error-code)                                                         |
| Respond     | 3    | Device Action   | 255 | Unknown Error               | 4           | 0xFF 0xFF 0xFF 0xFF                             |                                                                                       |

#### - Single Test Respond
| package no. | description      | Data1-N                                    |                                       |                                   |
| ----------- | ---------------- | ------------------------------------------ | ------------------------------------- | --------------------------------- |
| 0           | Test status      | Data1: See [Device Status](#device-status) |                                       |                                   |
| 1           | Temperature Info | Data1-2: Prism Temperature * 10            | Data3-4: Sample Tank Temperature * 10 | Data5: Temperature Unit (0:℃,1:℉) |
| 2           | Test result      | Data1-2: Concentration * 100               | Data3-4: Refractive Index * 100000    |                                   |

#### - Device Status
| Code | Status                | Remark                                                                                                                    |
| ---- | --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 0    | Test finished         |                                                                                                                           |
| 1    | Calibration finished  |                                                                                                                           |
| 2    | *reserved fields*     |                                                                                                                           |
| 3    | *reserved fields*     |                                                                                                                           |
| 4    | Average Test Start    |                                                                                                                           |
| 5    | Average Test Ongoing  |                                                                                                                           |
| 6    | Average Test Finished |                                                                                                                           |
| 7    | Loop Test Start       |                                                                                                                           |
| 8    | Loop Test Ongoing     |                                                                                                                           |
| 9    | Loop Test Finished    |                                                                                                                           |
| 10   | Average Test Ongoing  | Used for regular newsletter, this package doesn't contain valid result, only appears when a certain test time is too long |
| 11   | Test Start            |                                                                                                                           |
| 12   | Calibration Start     |                                                                                                                           |

#### - Average Test Respond
| package no. | description                                         | Data1-N                              |                                            |                           |                         |
| ----------- | --------------------------------------------------- | ------------------------------------ | ------------------------------------------ | ------------------------- | ----------------------- |
| 0-2         | Same as [Single Test Respond](#single-test-respond) |                                      |                                            |                           |                         |
| 3           | Average test result                                 | Data1-2: Average Concentration * 100 | Data3-4: Average Refractive Index * 100000 |                           |                         |
| 4           | Average temperature & status info                   | Data1-2: Average Prism Temp * 10     | Data3-4: Average Sample Tank * 10          | Data5: Current test count | Data6: Total test count |

#### - Loop Test Respond
The respond of loop test when temperature is not stable, will be replaced by average test when 'number of tests' > 1

Same as [Single Test Respond](#single-test-respond) 

#### - Calibration Respond
Same as [Single Test Respond](#single-test-respond) (ps: calibration success will respond with concentration result as 0)

#### - Error Code
| package no. | description | Data0             | Data1                                                            |
| ----------- | ----------- | ----------------- | ---------------------------------------------------------------- |
| 0           | Error Code  | 2: General Error  | 1: Test Error 2: Calibration Failed 3: No Liquid 4: Beyond Range |
|             |             | 3: Hardware Error | The number displaying on the device screen. Example: 1 - 0x01    |


#### *Example:*
- Single Test
  - Cmd: `DF DF 03 00 00 C1`
  - Respond(Status - pack0): `DF DF 03 00 03 00 0B 00 CF`
    - Data0: 0x00 - package no.0
    - Data1: 0x0B - test started
    - *Data2: 0x00 - reserved fields*
  - Respond(Res - pack 0): `DF DF 03 00 03 00 00 00 C4`
    - Data0: 0x00 - package no.0
    - Data1: 0x00 - test finished
    - *Data2: 0x00 - reserved fields*
  - Respond(Res - pack 1): `DF DF 03 00 06 01 03 17 03 14 01 FA`
    - Data0: 0x01 - package no.1
    - Data1-2: 0x0317 - 791 (79.1 * 10) prism temperature
    - Data3-4: 0x0314 - 788 (78.8 * 10) sample tank temperature
    - Data5: 0x01 - ℉
  - Respond(Res - pack 2): `DF DF 03 00 07 02 00 4F 00 02 09 3D 61`
    - Data0: 0x02 - package no.2
    - Data1-2: 0x004F - 79 (0.79 * 100) concentration / TDS
    - Data3-6: 0x0002093D - 133437 (1.33437 * 100000) refractive index
 
- Average Test
  - Cmd: `DF DF 03 01 01 03 C6`
  - Respond(Status0 - pack0): `DF DF 03 01 03 00 04 00 C9`
    - Data0: 0x00 - package no.0
    - Data1: 0x04 - average test started
    - *Data2: 0x00 - reserved fields*
  - Respond(Res0): 
    ```
    DF DF 03 01 03 00 05 00 CA
    DF DF 03 01 06 01 03 20 03 1C 01 0C
    DF DF 03 01 07 02 FF F9 00 02 08 A6 73
    DF DF 03 01 07 03 FF F9 FF FF E4 44 EA
    DF DF 03 01 07 04 03 21 03 1B 01 03 13
    ```
  - Respond(Res1): 
    ```
    DF DF 03 01 03 00 05 00 CA
    DF DF 03 01 06 01 03 1F 03 1B 01 0A
    DF DF 03 01 07 02 FF F9 00 02 08 A6 73
    DF DF 03 01 07 03 FF F9 FF FF E4 44 EA
    DF DF 03 01 07 04 03 1F 03 1B 02 03 12
    ```
  - Respond(Res2):
    ```
    DF DF 03 01 03 00 05 00 CA
    DF DF 03 01 06 01 03 1F 03 1B 01 0A
    DF DF 03 01 07 02 FF FA 00 02 08 A9 77
    DF DF 03 01 07 03 FF F9 FF FF E4 44 EA
    DF DF 03 01 07 04 03 1F 03 1B 03 03 13
    ```
  - Respond(Res3 - pack0): `DF DF 03 01 03 00 06 00 CB`
    - Data0: 0x00 - package no.0
    - Data1: 0x04 - average test finished
    - *Data2: 0x00 - reserved fields*