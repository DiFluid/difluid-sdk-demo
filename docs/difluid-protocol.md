# Transmission Protocol - General Concept
#### - *Version: 1.0.0*
#### - *Last Update: Mar 18th 2023*

## Format
**_Note:_** All data are in <mark>HEX</mark> format

### **- Control CMD Format**
Max data length: 20 Bytes

| Header 1 (1Byte) | Header 2 (1Byte) | Func (1Byte) | Cmd (1Byte) | Data Length (1Byte) | Data0 (1Byte) | ...... | DataN (1Byte) | Check Sum (1Byte)           |
| ---------------- | ---------------- | ------------ | ----------- | ------------------- | ------------- | ------ | ------------- | --------------------------- |
| 0xDF             | 0xDF             |              |             |                     |               |        |               | See [Check Sum](#check-sum) |

### **- Respond Format**
MAX data length: 20 Bytes

| Header 1 (1Byte) | Header 2 (1Byte) | Func (1Byte) | Cmd (1Byte) | Data Length (1Byte) | Data0 (1Byte) | ...... | DataN (1Byte) | Check Sum (1Byte)           |
| ---------------- | ---------------- | ------------ | ----------- | ------------------- | ------------- | ------ | ------------- | --------------------------- |
| 0xDF             | 0xDF             |              |             |                     |               |        |               | See [Check Sum](#check-sum) |

### **- Check Sum**

The sum of from frame header to DataN (All the part in data pack excepte the check sum)

```
    Check sum = Header 1 + Header 2 + Func + Cmd + Data Len + Data0 + ... + DataN
```

## All DiFluid Devices Protocol

| Model                       | Version | Remark |
| --------------------------- | ------- | ------ |
| [R2 Extract](protocolR2.md) | 1.0.0   |        |