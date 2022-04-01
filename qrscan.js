'use strict';
// npm i --save easyqrcodejs-nodejs
// npm i --save canvas --canvas_binary_host_mirror=https://npm.taobao.org/mirrors/node-canvas-prebuilt/

const fs = require('fs');
const path = require('path');
const QRCode2 = require('easyqrcodejs-nodejs');
const { loadImage, createCanvas} = require('canvas');



//使用 easyqrcodejs-nodejs 生成二维码
let generateQRCode = async (text, iconPath, filePath)=> {
    let image = new QRCode2({
        text,
        width: 256,
        height: 256,
        logo: iconPath, //嵌入logo 及尺寸
        logoWidth:80,
        logoHeight:80
    });
    await image.saveImage({path: filePath});
};



//利用canvas 制作图片排版 三种处理结果 两种存入本地文件 一种返回buffer对象
exports.generateClassImage = async (url, type, filePath)=> {
    let icon = ""; //logo地址
    let back = ""; //背景图地址
  
    let qrPath = path.join(__dirname, `./images/文件名.png`);
    await generateQRCode(url, icon, qrPath);

    let image = await loadImage(back); //加载背景图
    let {width, height} = image;
    let cv = createCanvas(width, height);
    let ctx = cv.getContext('2d');
    ctx.drawImage(image, 0, 0);

    ctx.font = '30px Impact';
    ctx.textAlign = 'center';
    ctx.fillText(className, 160, 120);
    ctx.stroke();
    let iconImage = await loadImage(qrPath); //加载二维码
    ctx.drawImage(iconImage, 38, 732, 236, 236);
    let buf = cv.toDataURL(); //生成图像 base64格式对象
    let base64Data = buf.replace(/^data:image\/\w+;base64,/, ""); //去掉base64图片头部， 为还原不想buffer内存对象做准备
    let dataBuffer = Buffer.from(base64Data, 'base64'); //根据base64对象还原到buffer内存中
    fs.unlinkSync(qrPath);
    return dataBuffer; //返回buffer对象

    // fs.writeFileSync(pngFile, dataBuffer); //写入本地文件  
    // await cv.createPNGStream().pipe(fs.createWriteStream(filePath)); //可以直接从cv写入文件中
};

