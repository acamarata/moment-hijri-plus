[**moment-hijri-plus v1.0.1**](../README.md)

***

[moment-hijri-plus](../README.md) / default

# Function: default()

> **default**(`momentInstance`): `void`

Defined in: [src/index.ts:150](https://github.com/acamarata/moment-hijri-plus/blob/b96b21a86195492a30c50860eaa4dcadad9946ab/src/index.ts#L150)

Install the Hijri plugin into the provided Moment.js instance.

Mutates `momentInstance.fn` to add instance methods (`toHijri`, `hijriYear`,
`hijriMonth`, `hijriDay`, `isValidHijri`, `formatHijri`) and attaches
`momentInstance.fromHijri` as a static factory. Call once at application startup.

The call is idempotent: calling it a second time overwrites the methods with
identical implementations.

## Parameters

### momentInstance

`__module`

The Moment.js constructor to augment. Pass your imported
  `moment` directly. Works with any moment instance, including locale-scoped ones.

## Returns

`void`

## Example

```ts
import moment from 'moment';
import installHijri from 'moment-hijri-plus';

installHijri(moment);

moment(new Date(2023, 2, 23)).toHijri();
// => { hy: 1444, hm: 9, hd: 1 }
```
