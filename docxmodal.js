'use strict';
// npm i --save pizzip docxtemplater docxtemplater-image-module-free image-size

const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const ImageModule = require('docxtemplater-image-module-free');


//根据加载本地文件或网路文件 分为同步版本与异步
//同步读取还可以分为 直接读取文件 或 base64 

//同步版本
const imageOpts = {
    centered: false,
    getImage: function (tagValue, tagName) { //tagValue base64 data
        return Buffer.from(tagValue, 'base64'); // 根据base64字符串 转换为buffer内存对象   tagValue 为base64字符串
        //return tagValue; //fs.readFileSync(tagValue); //直接读取本地文件读入 buffer内存队形 tagValue 为文件地址
    },
    getSize: function (img, tagValue, tagName) { //返回图片显示尺寸 img为buffer内存对象 
        const sizeOf = require("image-size");
        const sizeObj = sizeOf(img);
        const forceWidth = 100;
        const ratio = forceWidth / sizeObj.width;
        return [
            forceWidth,
            Math.round(sizeObj.height * ratio),
        ];
    },
};
exports.generateDoc = (modalPath, output, options, images)=> { // 同步生成docx文件 
    let content = fs.readFileSync(modalPath, "binary");
    let zip = new PizZip(content);
    let doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [new ImageModule(imageOpts)],
    });
    images.forEach((x, i)=> { // 自定义配置图片地址及匹配关键字
        options[`image${i+1}`] = x;
    });
    doc.render(options);
    let buf = doc.getZip().generate({type: "nodebuffer", compression: "DEFLATE"});
    fs.writeFileSync(output, buf);
};

// 异步版本 
const request = require('request');
function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        let buffers = [];
        stream.on('error', reject);
        stream.on('data', (data) => buffers.push(data))
        stream.on('end', () => resolve(Buffer.concat(buffers)))
    });
}
let getHttpData = (url)=> {
    if (url.indexOf("https") == 0) url = url.replace("https", "http");
    return streamToBuffer(request(url)); //需要升级 现在https证书认证有问题
};
//{#images}{%.} {/images} 图片数组模板 横排
let imageOptsData = {
    centered: false,
    getImage: function (tagValue, tagName) {
        console.log("getImage", tagValue, tagName);
        return getHttpData(tagValue); //fs.readFileSync(tagValue);
    },
    getSize: function (img, tagValue, tagName) {
        const sizeOf = require("image-size");
        const sizeObj = sizeOf(img);
        console.log(sizeObj);
        const forceWidth = 100;
        const ratio = forceWidth / sizeObj.width;
        return [
            forceWidth,
            // calculate height taking into account aspect ratio
            Math.round(sizeObj.height * ratio),
        ];
    },
};

exports.generateDocAsync = async (modalPath, output, options, images)=> {
    let imageModule = new ImageModule(imageOptsData);
    options.images = images;
    let content = fs.readFileSync(modalPath, "binary");
    let zip = new PizZip(content);
    let doc = new Docxtemplater().loadZip(zip).attachModule(imageModule).compile();
    await doc.resolveData(options);
    doc.render();
    let buf = doc.getZip().generate({type: "nodebuffer", compression: "DEFLATE"});
    fs.writeFileSync(output, buf);
};


