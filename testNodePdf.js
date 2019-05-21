/**
 * Created by hu on 2017/07/10
 *
 */
'use strict';

const NodePDF = require('nodepdf');

exports.createPdfNetInfo = ()=> {
    let pdf = new NodePDF('http://www.baidu.com', 'baidu.pdf', {
        'viewportSize': {
            'width': 1440,
            'height': 900
        },
        'args': '--debug=true'
    });

    pdf.on('error', (msg)=> {
        console.log("error", msg);
    });

    pdf.on('done', (filePath)=> {
        console.log("done filePath", filePath);
    });

    pdf.on('stout', (stout)=> {
        console.log("stout", stout);
    });

    pdf.on('stderr', (stderr)=> {
        console.log('stderr', stderr);
    });
};

exports.createPdfNetInfo();

