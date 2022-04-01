'use strict';
const request = require('request');

function streamToBuffer(stream) { //流stream对象 转化为 buffer内存中
    return new Promise((resolve, reject) => {
        let buffers = [];
        stream.on('error', reject);
        stream.on('data', (data) => buffers.push(data))
        stream.on('end', () => resolve(Buffer.concat(buffers)))
    });
}

let Duplex = require('stream').Duplex;
function bufferToStream(buffer) { //将buffer内存数据 转为 stream对象中
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

exports.getHttpData = (url)=> { // 从网上下载url文件 stream流 并读入 buffer内存中
    return streamToBuffer(request(url));
};

// const base64Img = data.toString('base64');  //buffer 对象转化为 base64

// const dataBuffer = Buffer.from(base64Data, 'base64'); //将base64数据翻转为 buffer

//"data:image/png;base64," + base64Img // base64图片格式文字
//let base64Data = base64Img.replace(/^data:image\/\w+;base64,/, ""); //从base64图片中 取出 原始的图片内存base64对象， 用于进一步将base64数据翻转为 buffer
                
