# Transmission Protocol - OmniFlux

> **Language:** English (current) | [简体中文](protocolOmniFlux_zh.md)

# Overview

- *Version: 1.0.1*
- *Last Update: June 17, 2026*
- *Least Firmware Version: V029*
- *Device Model: DFT-CRM101 (CRM101)*

## UUIDs

Broadcast UUID: 0000**00E8**-0000-1000-8000-00805F9B34FB

Service UUID: 0000**00E8**-0000-1000-8000-00805F9B34FB

**Characteristic value**: AA01

**Please use the characteristic value AA01 channel for communication.**

## Frame Format

All SDK frames use the same binary layout as the DFT SD101 / AirWave family:

| Byte offset | Field        | Description                                      |
| ----------- | ------------ | ------------------------------------------------ |
| 0–1         | Header       | Fixed `0xDF 0xDF`                                |
| 2           | Func         | Function code (see sections below)               |
| 3           | Cmd          | Command index within the function                |
| 4           | Len          | Payload length (bytes)                           |
| 5…(4+Len)   | Data         | Payload (may be empty when Len = 0)              |
| 5+Len       | Checksum     | Low 8 bits of sum of all preceding frame bytes   |

- Multi-byte numeric fields in structured payloads use **little-endian** byte order unless noted otherwise.
- `float` fields are IEEE-754 single precision (4 bytes, little-endian).
- Inter-byte receive timeout on the device: **100 ms** (a new frame must start with `0xDF 0xDF` after a gap).

### Version 1.0.1 (June 17, 2026)

> **Note**: OmniFlux (CRM101) acts as the **Bluetooth host** for peripherals such as AirWave. Third-party clients may use the same frame format on the AA01 characteristic to read roast data, control the roaster UI, or trigger color detection.

**Protocol capabilities:**

1. **Device Info (Func 0)** — serial number, device model, firmware version.
2. **Device Settings (Func 1)** — language, Bluetooth name, and auto shutoff, brightness, time format, buzzer, USB light, online-roast switches, color/temperature units, etc. (Cmd 2–16); same read/write semantics as Cmd 0: `Len=0` reads, `Len=1` sets and returns current value (invalid values are ignored).
3. **Device Action (Func 3)**
   - AirWave linkage stage query (Cmd 4) and auto-mode command (Cmd 5, sent proactively by the device).
   - Online roast: realtime packet, ambient data, key points, run status (Cmd 6–9); roast curve control and key-point marks (Cmd 10–13); periodic push subscription (Cmd 14).
   - Color detection: `NEW` (Cmd 15), `ADD` (Cmd 16), async response `sdk_det_color_test_result_t`.
   - IR sensor temperature: sampling on/off (Cmd 17), temperature query (Cmd 18).

---

# OmniFlux Protocol

Registered handlers in firmware: `SDK_FUNC_DEV_INFO` (0), `SDK_FUNC_SETTING` (1), `SDk_FUNC_DET` (3).

## 1. Device Info (Func 0)

|             | Func | Func Description | Cmd | Cmd Description          | Data Length | Data Description                         | Remark |
| ----------- | ---- | ---------------- | --- | ------------------------ | ----------- | ---------------------------------------- | ------ |
| Control Cmd | 0    | Device Info      | 0   | Get SN                   | 0           | /                                        |        |
| Respond     | 0    | Device Info      | 0   | Respond SN               | 16          | Serial number, raw 16 bytes (ASCII)      |        |
| Control Cmd | 0    | Device Info      | 1   | Get Device Model         | 0           | /                                        |        |
| Respond     | 0    | Device Info      | 1   | Respond Device Model     | 11          | Device model string: `DFT-CRM101`        |        |
| Control Cmd | 0    | Device Info      | 2   | Get Firmware Version     | 0           | /                                        |        |
| Respond     | 0    | Device Info      | 2   | Respond Firmware Version | 4           | App version string (from OTA metadata)   |        |

### *Example:*

- Get SN
  - Cmd: `DF DF 00 00 00 BE`
  - Respond: `DF DF 00 00 10 … 16 bytes SN … CS`
- Get Device Model
  - Cmd: `DF DF 00 01 00 BF`
  - Respond: `DF DF 00 01 0B 44 46 54 2D 43 52 4D 31 30 31 00 … CS`
  - Decode to String: `DFT-CRM101`
- Get Firmware Version
  - Cmd: `DF DF 00 02 00 C0`
  - Respond: `DF DF 00 02 04 … 4-byte version … CS`

---

## 2. Device Settings (Func 1)

|             | Func | Func Description | Cmd | Cmd Description        | Data Length | Data Description                                                                 | Remark |
| ----------- | ---- | ---------------- | --- | ---------------------- | ----------- | -------------------------------------------------------------------------------- | ------ |
| Control Cmd | 1    | Device Settings  | 0   | Get Language           | 0           | /                                                                                |        |
| Respond     | 1    | Device Settings  | 0   | Respond Language       | 1           | `0`: English<br />`1`: Japanese<br />`2`: Chinese                               |        |
| Control Cmd | 1    | Device Settings  | 0   | Set Language           | 1           | Same values as Get                                                               |        |
| Respond     | 1    | Device Settings  | 0   | Respond Language       | 1           | Current language after set (unchanged if invalid value)                          |        |
| Control Cmd | 1    | Device Settings  | 1   | Get Bluetooth Name     | 0           | /                                                                                | AirWave “Ask Host Name” compatible; read-only |
| Respond     | 1    | Device Settings  | 1   | Respond Bluetooth Name | 30          | CRM101 advertised BLE name, Type: String (max 29 chars + `NUL` pad)              |        |
| Control Cmd | 1    | Device Settings  | 2   | Auto shutoff switch    | 0 or 1      | `Len=0`: read; `Len=1`: set                                                      |        |
| Respond     | 1    | Device Settings  | 2   | Respond shutoff switch | 1           | `0`: off<br />`1`: on                                                            | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 3   | Auto shutoff time      | 0 or 1      | `Len=0`: read; `Len=1`: set (minutes)                                            |        |
| Respond     | 1    | Device Settings  | 3   | Respond shutoff time   | 1           | `1`–`30` (minutes)                                                               | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 4   | Screen brightness      | 0 or 1      | `Len=0`: read; `Len=1`: set (%)                                                  | Backlight applied immediately |
| Respond     | 1    | Device Settings  | 4   | Respond brightness     | 1           | `30`–`100` (%)                                                                   | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 5   | Time format            | 0 or 1      | `Len=0`: read; `Len=1`: set                                                      |        |
| Respond     | 1    | Device Settings  | 5   | Respond time format    | 1           | `0`: 12-hour<br />`1`: 24-hour DD/MM/YYYY HH:mm<br />`2`: 24-hour YYYY/MM/DD HH:mm | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 6   | Screen rotation        | 0 or 1      | `Len=0`: read; `Len=1`: set                                                      | Display flipped immediately |
| Respond     | 1    | Device Settings  | 6   | Respond rotation       | 1           | `0`: normal<br />`1`: 180° flip                                                  | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 7   | Buzzer switch          | 0 or 1      | `Len=0`: read; `Len=1`: set                                                      |        |
| Respond     | 1    | Device Settings  | 7   | Respond buzzer switch  | 1           | `0`: off<br />`1`: on                                                            | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 8   | Buzzer volume          | 0 or 1      | `Len=0`: read; `Len=1`: set (%)                                                  |        |
| Respond     | 1    | Device Settings  | 8   | Respond buzzer volume  | 1           | `0`–`100` (%)                                                                    | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 9   | USB light mode         | 0 or 1      | `Len=0`: read; `Len=1`: set                                                      | `0`/`1` apply USB light immediately |
| Respond     | 1    | Device Settings  | 9   | Respond USB light mode | 1           | `0`: off<br />`1`: on<br />`2`: auto                                             | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 10  | Online roast auto start/stop | 0 or 1 | `Len=0`: read; `Len=1`: set                                               | Maps to Settings “Roast Auto Start” |
| Respond     | 1    | Device Settings  | 10  | Respond auto start/stop | 1          | `0`: off<br />`1`: on                                                            | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 11  | Target color text alert | 0 or 1     | `Len=0`: read; `Len=1`: set                                                      |        |
| Respond     | 1    | Device Settings  | 11  | Respond text alert     | 1           | `0`: off<br />`1`: on                                                            | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 12  | Target color sound alert | 0 or 1    | `Len=0`: read; `Len=1`: set                                                      |        |
| Respond     | 1    | Device Settings  | 12  | Respond sound alert    | 1           | `0`: off<br />`1`: on                                                            | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 13  | Temperature probe T1   | 0 or 1      | `Len=0`: read; `Len=1`: set                                                      |        |
| Respond     | 1    | Device Settings  | 13  | Respond T1 switch      | 1           | `0`: off<br />`1`: on                                                            | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 14  | Temperature probe T2   | 0 or 1      | `Len=0`: read; `Len=1`: set                                                      |        |
| Respond     | 1    | Device Settings  | 14  | Respond T2 switch      | 1           | `0`: off<br />`1`: on                                                            | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 15  | Color standard         | 0 or 1      | `Len=0`: read; `Len=1`: set                                                      |        |
| Respond     | 1    | Device Settings  | 15  | Respond color standard | 1           | `0`: SCA<br />`1`: Common                                                        | Invalid value unchanged |
| Control Cmd | 1    | Device Settings  | 16  | Temperature unit       | 0 or 1      | `Len=0`: read; `Len=1`: set                                                      |        |
| Respond     | 1    | Device Settings  | 16  | Respond temperature unit | 1         | `0`: Celsius (℃)<br />`1`: Fahrenheit (℉)                                       | Invalid value unchanged |

> **Read/write convention (Cmd 0, 2–16):** `Len=0` reads the current value; `Len=1` writes the first payload byte, persists if valid, and responds with 1 byte current value; invalid set values leave storage unchanged. Cmd 1 (Bluetooth name) is read-only; response is always a 30-byte string.

**AirWave note (Cmd 1):** After responding with the Bluetooth name, CRM101 starts a **2 s** one-shot timer and then sends to AirWave:

`DF DF 03 05 01 01 C8` — Device Action Cmd 5, set control mode **Auto** (`0x01`).

### *Example:*

- Get Language
  - Cmd: `DF DF 01 00 00 BF`
  - Respond: `DF DF 01 00 01 00 C0`
  - Decode: `0x00` = English
- Set Language (Japanese)
  - Cmd: `DF DF 01 00 01 01 C1`
  - Respond: `DF DF 01 00 01 01 C1`
- Get Bluetooth Name
  - Cmd: `DF DF 01 01 00 C0`
  - Respond: `DF DF 01 01 1E 4F 6D 6E 69 46 6C 75 78 … padded to 30 bytes … CS`
  - Decode to String: e.g. `OmniFlux218472` (advertising prefix from `PRODUCT_NAME`)
- Get auto shutoff switch
  - Cmd: `DF DF 01 02 00 C1`
  - Respond: `DF DF 01 02 01 01 C3` → `0x01` = on
- Set screen brightness to 80%
  - Cmd: `DF DF 01 04 01 50 14`
  - Respond: `DF DF 01 04 01 50 14`
- Set temperature unit to Fahrenheit
  - Cmd: `DF DF 01 10 01 01 D1`
  - Respond: `DF DF 01 10 01 01 D1`

---

## 3. Device Action / Roast Detection (Func 3)

Func `3` carries online roast telemetry, UI remote control, and AirWave linkage. Each data Cmd maps to one complete struct; individual float queries are no longer provided.

**Direction legend:** `Q` = query (zero-length payload, device responds), `W` = write/control, `P` = device push (after subscription).

**Cmd overview:**

| Cmd | Description | Direction |
| --- | ----------- | --------- |
| 4 | AirWave linkage stage query | `Q` |
| 5 | AirWave auto mode (**sent proactively by device**, client does not send) | — |
| 6 | Full realtime data packet | `Q` / `P` |
| 7 | Ambient sensor data | `Q` |
| 8 | All key points (dry / first crack / second crack) | `Q` |
| 9 | Roast run status | `Q` |
| 10 | Start / stop roast curve | `W` |
| 11 | Mark dry point | `W` |
| 12 | Mark first crack | `W` |
| 13 | Mark second crack | `W` |
| 14 | Realtime push subscription control | `W` |
| 15 | Start NEW color detection | `W` |
| 16 | Start ADD color detection | `W` |
| 17 | Start / stop IR temperature sampling | `W` |
| 18 | Get IR sensor temperature | `Q` |

---

### 3.1 AirWave Linkage (Cmd 4 / 5)

|             | Func | Func Description | Cmd | Cmd Description              | Data Length | Data Description           | Remark |
| ----------- | ---- | ---------------- | --- | ---------------------------- | ----------- | -------------------------- | ------ |
| Control Cmd | 3    | Device Action    | 4   | Get linkage / baking stage | 0           | /                          | AirWave “Ask Baking Stage” |
| Respond     | 3    | Device Action    | 4   | Respond linkage stage        | 1           | `is_start` — see table below |      |
| Device send | 3    | Device Action    | 5   | Set auto mode                | 1           | `0x01`                     | CRM101 → AirWave; see Device Settings Cmd 1 |

**`is_start` → AirWave baking stage mapping (CRM101 implementation):**

| `is_start` | CRM101 meaning        | AirWave stage |
| ---------- | --------------------- | ------------- |
| 0          | Idle / wait           | Wait (0)      |
| 1          | Roast track running   | In Bean (1)   |
| 2          | Dry / yellow marked   | Turn Yellow (2) |
| 3          | First crack marked    | First Blast (3) |
| 4          | Second crack marked   | Second Blast (4) |

> Cool (5) is not currently driven by `is_start`; use UI state for the cooling phase.  
> Cmd 9 (roast run status) returns the same `is_start` semantics as Cmd 4.

### *Example (AirWave stage poll):*

- AirWave Cmd: `DF DF 03 04 00 C5`
- CRM101 Respond: `DF DF 03 04 01 02 C8` → `0x02` = Turn Yellow

---

### 3.2 Data Queries (Cmd 6–9)

|             | Func | Func Description | Cmd | Cmd Description       | Data Length | Data Description                   | Remark |
| ----------- | ---- | ---------------- | --- | --------------------- | ----------- | ---------------------------------- | ------ |
| Control Cmd | 3    | Device Action    | 6   | Get roast realtime    | 0           | /                                  | `Q`    |
| Respond     | 3    | Device Action    | 6   | Respond roast realtime | 38         | `sdk_det_roast_realtime_t`         | `P` when push enabled |
| Control Cmd | 3    | Device Action    | 7   | Get ambient sensor    | 0           | /                                  | `Q`    |
| Respond     | 3    | Device Action    | 7   | Respond ambient data  | 16          | `sdk_det_roast_ambient_t`          |        |
| Control Cmd | 3    | Device Action    | 8   | Get all key points    | 0           | /                                  | `Q`    |
| Respond     | 3    | Device Action    | 8   | Respond key points    | 22          | `sdk_det_roast_keypoint_t`         | dry, 1st/2nd crack |
| Control Cmd | 3    | Device Action    | 9   | Get roast status      | 0           | /                                  | `Q`    |
| Respond     | 3    | Device Action    | 9   | Respond roast status  | 1           | `is_start` (same as Cmd 4)         |        |

**`sdk_det_roast_realtime_t` (38 bytes, packed):**

```c
typedef struct {
    uint32_t time_sec;    // online roast time (s)
    uint32_t distance;    // TOF distance (mm)
    float    agtron;      // current Agtron
    float    roc;         // Agtron rate of change (Agtron/min)
    float    t1;          // probe TC1 (℃)
    float    ror1;        // TC1 ROR (℃/min)
    float    t2;          // probe TC2 (℃)
    float    ror2;        // TC2 ROR (℃/min)
    uint8_t  t1_valid;    // TC1 valid flag
    uint8_t  t2_valid;    // TC2 valid flag
    uint16_t boom1_count; // first-crack count
    uint16_t boom2_count; // second-crack count
} sdk_det_roast_realtime_t;
```

**`sdk_det_roast_ambient_t` (16 bytes, packed):**

```c
typedef struct {
    float temperature;  // ambient temperature (℃)
    float humidity;     // relative humidity (%)
    float pressure;     // atmospheric pressure (hPa)
    float altitude;     // altitude (m)
} sdk_det_roast_ambient_t;
```

**`sdk_det_roast_keypoint_t` (22 bytes, packed):**

```c
typedef struct {
    uint16_t dry_time;     // dry-point time (s)
    float    dry_agtron;   // dry-point Agtron
    uint16_t boom1_time;   // first-crack time (s)
    float    boom1_agtron; // first-crack Agtron
    uint16_t boom1_count;  // first-crack count
    uint16_t boom2_time;   // second-crack time (s)
    float    boom2_agtron; // second-crack Agtron
    uint16_t boom2_count;  // second-crack count
} sdk_det_roast_keypoint_t;
```

### *Example:*

- Get roast realtime
  - Cmd: `DF DF 03 06 00 C7`
  - Respond: `DF DF 03 06 26 … 38-byte struct … CS`
- Get ambient sensor
  - Cmd: `DF DF 03 07 00 C8`
  - Respond: `DF DF 03 07 10 … 16-byte struct … CS`
- Get all key points
  - Cmd: `DF DF 03 08 00 C9`
  - Respond: `DF DF 03 08 16 … 22-byte struct … CS`

---

### 3.3 Roast Control (Cmd 10–13)

|             | Func | Func Description | Cmd | Cmd Description   | Data Length | Data Description                              | Remark |
| ----------- | ---- | ---------------- | --- | ----------------- | ----------- | --------------------------------------------- | ------ |
| Control Cmd | 3    | Device Action    | 10  | Roast curve control | 0 or 1    | When `Len=1`, `buf[0]`: `0`=stop `1`=start/toggle | `W` — triggers roast UI |
| Respond     | 3    | Device Action    | 10  | Respond status    | 1           | Current `is_start`                            |        |
| Control Cmd | 3    | Device Action    | 11  | Mark dry point    | 0           | /                                             | `W`    |
| Respond     | 3    | Device Action    | 11  | Respond result    | 1           | `1` = accepted                                |        |
| Control Cmd | 3    | Device Action    | 12  | Mark first crack  | 0           | /                                             | `W`    |
| Respond     | 3    | Device Action    | 12  | Respond result    | 1           | `1` = accepted                                |        |
| Control Cmd | 3    | Device Action    | 13  | Mark second crack | 0           | /                                             | `W`    |
| Respond     | 3    | Device Action    | 13  | Respond result    | 1           | `1` = accepted                                |        |

### *Example:*

- Start / toggle roast curve
  - Cmd: `DF DF 03 0A 01 01 CD` (Cmd 10 = `0x0A`, data `0x01`)
  - Respond: `DF DF 03 0A 01 … current is_start … CS`
- Mark dry point (no payload)
  - Cmd: `DF DF 03 0B 00 CC`
  - Respond: `DF DF 03 0B 01 01 CE`

---

### 3.4 Periodic Push Subscription (Cmd 14)

|             | Func | Func Description | Cmd | Cmd Description      | Data Length | Data Description                                      | Remark |
| ----------- | ---- | ---------------- | --- | -------------------- | ----------- | ----------------------------------------------------- | ------ |
| Control Cmd | 3    | Device Action    | 14  | Push subscription control | 3        | `sdk_det_push_ctrl_t`                                 | `W`    |
| Respond     | 3    | Device Action    | 14  | Respond enable state | 1           | `0`=stopped `1`=pushing                               |        |
| Push        | 3    | Device Action    | 6   | Roast realtime push  | 38          | Same as Cmd 6 response (`sdk_det_roast_realtime_t`)   | `P`    |

**`sdk_det_push_ctrl_t` (3 bytes, packed):**

```c
typedef struct {
    uint8_t  enable;       // 0=stop  1=start
    uint16_t interval_ms;  // push interval (ms), minimum 100
} sdk_det_push_ctrl_t;
```

### *Example:*

- Enable push every 500 ms
  - Cmd: `DF DF 03 0E 03 01 F4 01 C8` (Cmd 14 = `0x0E`, enable=`1`, interval=`500` LE)
  - Respond: `DF DF 03 0E 01 01 D1`
  - Device then periodically sends Cmd **6** frames with 38-byte realtime payload.

- Disable push
  - Cmd: `DF DF 03 0E 03 00 00 00 D2`
  - Respond: `DF DF 03 0E 01 00 D0`

---

### 3.5 Color Detection (Cmd 15–16)

> **Response mode:** Both commands are `W` write/control, but **do not reply synchronously**. After accepting the command, the device triggers the corresponding UI action and asynchronously replies with the **same Cmd** and `sdk_det_color_test_result_t` (15 bytes) when detection completes (or immediately on precondition failure). Only one pending color-detection request is handled at a time. Scan mode (`Color_Scan`) is not supported by these commands.

**UI preconditions:**

| Cmd | Mode | Allowed current screen | On failure |
| --- | ---- | ---------------------- | ---------- |
| 15 | NEW TEST | `Color_Test` (single) only | Immediate reply with `effectiveness=0` |
| 16 | ADD TEST | `Color_Test` (single) only | Immediate reply with `effectiveness=0` |

|             | Func | Func Description | Cmd  | Cmd Description           | Data Length | Data Description          | Remark                                                       |
| ----------- | ---- | ---------------- | ---- | ------------------------- | ----------- | ------------------------- | ------------------------------------------------------------ |
| Control Cmd | 3    | Device Action    | 15   | Start NEW color detection | 0           | /                         | `W` — triggers “New TEST” button, creates a new record       |
| Respond     | 3    | Device Action    | 15   | Respond color result      | 15          | `sdk_det_color_test_result_t` | async                                                    |
| Control Cmd | 3    | Device Action    | 16   | Start ADD color detection | 0           | /                         | `W` — triggers “Add TEST” button, appends to existing record |
| Respond     | 3    | Device Action    | 16   | Respond color result      | 15          | `sdk_det_color_test_result_t` | async                                                    |

**`sdk_det_color_test_result_t` (15 bytes, packed):**

```c
typedef struct {
    uint8_t  effectiveness; // 0=invalid  1=valid
    uint8_t  type;          // 0=bean  1=ground
    uint8_t  standard;      // 0=SCA  1=COMMON
    float    agtron;        // color value; -1 when out of range
    uint64_t timestape;     // timestamp (RTC, seconds)
} __attribute__((packed)) sdk_det_color_test_result_t;
```

### *Example:*

- Start NEW color detection
  - Cmd: `DF DF 03 0F 00 D0` (Cmd 15 = `0x0F`)
  - Respond: `DF DF 03 0F 0F 01 01 01 38 1F D7 42 95 09 70 38 00 00 00 00 98`
    - `effectiveness=1`, `type=1` (ground), `standard=1` (COMMON), `agtron≈107.6`, `timestape=946866581`
- Start ADD color detection
  - Cmd: `DF DF 03 10 00 D1` (Cmd 16 = `0x10`)
  - Respond: `DF DF 03 10 0F … 15-byte struct … CS`

---

### 3.6 IR Sensor Temperature (Cmd 17–18)

|             | Func | Func Description | Cmd | Cmd Description              | Data Length | Data Description          | Remark |
| ----------- | ---- | ---------------- | --- | ---------------------------- | ----------- | ------------------------- | ------ |
| Control Cmd | 3    | Device Action    | 17  | Start / stop IR temp sampling | 1          | `sdk_det_ir_temp_start_t` | `W`    |
| Respond     | 3    | Device Action    | 17  | Respond enable state         | 1           | `0`=stopped `1`=sampling  | sync   |
| Control Cmd | 3    | Device Action    | 18  | Get IR sensor temperature    | 0           | /                         | `Q`    |
| Respond     | 3    | Device Action    | 18  | Respond IR temperature       | 4           | `sdk_det_ir_temp_t`       | reads latest cache; channel 1 only |

> **Note:** Cmd 17 with `enable=1` starts periodic IR sampling and updates the cache; `enable=0` stops sampling while keeping the last cached value. Cmd 18 reads `temperature_1` (℃) from that cache; returns `0` when no valid data is available.

**`sdk_det_ir_temp_start_t` (1 byte, packed):**

```c
typedef struct {
    uint8_t enable; // 0=stop sampling  1=start sampling
} sdk_det_ir_temp_start_t;
```

**`sdk_det_ir_temp_t` (4 bytes, packed):**

```c
typedef struct {
    float temperature; // IR temperature (℃)
} sdk_det_ir_temp_t;
```

### *Example:*

- Start IR temperature sampling
  - Cmd: `DF DF 03 11 01 01 D4` (Cmd 17 = `0x11`, enable=`1`)
  - Respond: `DF DF 03 11 01 01 D4`
- Stop IR temperature sampling
  - Cmd: `DF DF 03 11 01 00 D3` (enable=`0`)
  - Respond: `DF DF 03 11 01 00 D3`
- Get IR temperature
  - Cmd: `DF DF 03 12 00 D3` (Cmd 18 = `0x12`)
  - Respond: `DF DF 03 12 04 … 4-byte float … CS