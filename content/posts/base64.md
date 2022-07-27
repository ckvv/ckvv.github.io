---
title: "Base64原理及实现"
tags: ['Base64']
date: "2019-02-19"
---
## base64

**Base64是用64个字符来表示数据的方法**。Base64要求把每三个8Bit的字节转换为四个6Bit的字节，然后把6Bit再添两位高位0，组成四个8Bit的字节，也就是说，转换后的字符串理论上将要比原来的长1/3。如果要转码数据字节不是3的倍数，最后一组填充1到2个0字节，并在最后编码完成后在结尾添加1到2个=号。
转换后，我们每个字节范围为[00000000-00111111],所以我们可以用一个64码表来得到我们想要的字符串（也就是最终的Base64编码）标准的Base64用`[A-Z,a-z,0-9,+,/]`64个字符编码。

## 编码

深入了解base64前，我们需要先了解编码。编码是信息从一种形式或格式转换为另一种形式的过程。计算机中，所有的数据在存储和运算时都使用二进制示，n位二进制组合成2的n次方个不同的信息，给每个信息规定一个具体码组，这种过程叫编码。而具体用哪些二进制数字表示哪个符号，每个人都可以约定自己的一套编码。

如常用的ASCII是由美国国家标准学会制定的一种单字节字符编码，标准ASCII码使用7位二进制数（剩下的1位二进制为0）来表示所有的大写和小写字母，数字0到9、标点符号。在有的语言中128个符号是不够的，有些编码方案利用字节中闲置的最高位编入新的符号，有的利用两个（GBK等）或更多字节（utf-32等）表示一个符号（汉字）

## Base64编码

base64编码过程：

+ ascii码`s133`对应的编码`115 49 51 51`
+ 在内存2进制表示： `01110011 00110001 00110011 00110011`
+ 每三组分为6Bit四组`011100 110011 000100 110011 001100 110000 000000 000000`
+ 高位补0得到 `00011100 00110011 00000100 00110011 00001100 00110000 00000000 00000000`
+ 对应十进制 `28 51 4 51 12 48 0 0`
+ 查对照表 生成base64码`czEzMw==`

base64解码过程：

base64编码过程逆向即为解码

## javascript代码实现

```javascript
Base64 = {
    _table: [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
    ],
    _getReg: function () {
        return RegExp(`^[${this._table.join('')}]+={0,2}$`);
    },
    encode: function (bin) {
       let codes = [];
        let binLength = bin.length;
        un = binLength % 3;

        for (let i = 2; i < binLength; i += 3) {
            let c = bin[i - 2] << 16;
            c |= bin[i - 1] << 8;
            c |= bin[i];

            //0x3f代表16进制数3F即0011 1111
            codes.push(this._table[c >> 18 & 0x3f]);
            codes.push(this._table[c >> 12 & 0x3f]);
            codes.push(this._table[c >> 6 & 0x3f]);
            codes.push(this._table[c & 0x3f]);
        }

        if (un == 1) {
            let c = bin[binLength - 1] << 16;
            codes.push(this._table[c >> 18 & 0x3f]);
            codes.push(this._table[c >> 12 & 0x3f]);
            codes.push('=');
            codes.push('=');
        }
        if (un == 2) {
            let c = bin[binLength - 2] << 16;
            c |= bin[binLength - 1] << 8;
            codes.push(this._table[c >> 18 & 0x3f]);
            codes.push(this._table[c >> 12 & 0x3f]);
            codes.push(this._table[c >> 6 & 0x3f]);
            codes.push('=');
        }

        return codes.join("");
    },
    decode: function (base64Str) {
        let bin = [];
        let base64StrLen = base64Str.length;

        if (!this._getReg().test(base64Str)) {
            throw "Base64编码格式错误";
        }
        if (base64StrLen % 4 !== 0) {
            throw "Base64编码长度错误";
        }

        let eqCount = base64StrLen - base64Str.indexOf('=');

        for (let i = 3; i < base64StrLen; i += 4) {
            let code = 0;

            let [c1, c2, c3, c4] = [base64Str.charAt(i - 3), base64Str.charAt(i - 2), base64Str.charAt(i - 1), base64Str.charAt(i)];

            code = code << 6 | this._table.indexOf(c1);
            code = code << 6 | this._table.indexOf(c2);

            if (c3 !== '=' && c4 !== '=') {
                code = code << 6 | this._table.indexOf(c3);
                code = code << 6 | this._table.indexOf(c4);
            }
            if (c3 !== '=' && c4 === '=') {
                code = code << 6 | this._table.indexOf(c3);
                code = code << 6 | 0;
            }
            if (c3 === '=') {
                code = code << 6 | 0;
                code = code << 6 | 0;
            }

            //0xff即11111111
            bin.push(code >> 16);
            //取得低八位
            bin.push(code >> 8 & 0xff);
            bin.push(code & 0xff)
        }

        switch (eqCount) {
            case 1:
                bin.pop();
                break;
            case 2:
                bin.pop();
                bin.pop();
                break;
            default:
                break;
        }

        return bin;
    }
};


let str = `1!@#$%^ghghna三个卡就能`;
let ba = Base64.encode(Buffer.from(str));

console.log(`编码前:${str}`); //1!@#$%^ghghna三个卡就能
console.log(`编码后:${ba}`); //MSFAIyQlXmdoZ2huYeS4ieS4quWNoeWwseiDvQ==
console.log(`解码:${Buffer.from(Base64.decode(ba)).toString()}`); //1!@#$%^ghghna三个卡就能
```
