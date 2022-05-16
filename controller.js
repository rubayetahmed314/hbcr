const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node-gpu");
const cv = require("opencv");
const sharp = require("sharp");
const Jimp = require("jimp");
const PNG = require("png-js");
// var File = require("file-class");
const fs = require("fs");
let myModel = null;

const letterMap = {
    0: "ঁ",
    1: "ং",
    2: "ঃ",
    3: "অ",
    4: "আ",
    5: "ই",
    6: "ঈ",
    7: "উ",
    8: "ঊ",
    9: "ঋ",
    10: "এ",
    11: "ঐ",
    12: "ও",
    13: "ঔ",
    14: "ক",
    15: "ক্ক",
    16: "ক্ট",
    17: "ক্ত",
    18: "ক্র",
    19: "ক্ল",
    20: "ক্ষ",
    21: "ক্স",
    22: "খ",
    23: "গ",
    24: "ঘ",
    25: "ঘ্ন",
    26: "ঙ",
    27: "ঙ্খ",
    28: "ঙ্গ",
    29: "চ",
    30: "চ্চ",
    31: "চ্ছ",
    32: "ছ",
    33: "জ",
    34: "জ্জ",
    35: "জ্ঞ",
    36: "জ্ব",
    37: "ঝ",
    38: "ঞ",
    39: "ঞ্চ",
    40: "ঞ্জ",
    41: "ট",
    42: "ট্ট",
    43: "ঠ",
    44: "ড",
    45: "ড্ড",
    46: "ঢ",
    47: "ণ",
    48: "ণ্ঠ",
    49: "ণ্ড",
    50: "ত",
    51: "ত্ত",
    52: "ত্থ",
    53: "ত্ন",
    54: "থ",
    55: "দ",
    56: "দ্দ",
    57: "দ্ধ",
    58: "দ্ব",
    59: "দ্ভ",
    60: "ধ",
    61: "ন",
    62: "ন্ড",
    63: "ন্ত",
    64: "ন্দ",
    65: "ন্ধ",
    66: "ন্ন",
    67: "ন্ম",
    68: "প",
    69: "প্ত",
    70: "ফ",
    71: "ব",
    72: "ব্দ",
    73: "ভ",
    74: "ম",
    75: "ম্প",
    76: "ম্ব",
    77: "ম্ম",
    78: "য",
    79: "র",
    80: "ল",
    81: "ল্প",
    82: "শ",
    83: "শ্চ",
    84: "ষ",
    85: "ষ্ট",
    86: "ষ্ঠ",
    87: "ষ্ণ",
    88: "ষ্প",
    89: "স",
    90: "স্ক",
    91: "স্ত",
    92: "স্থ",
    93: "স্ন",
    94: "স্প",
    95: "স্ফ",
    96: "স্ম",
    97: "হ",
    98: "হ্ন",
    99: "হ্ম",
    100: "া",
    101: "ি",
    102: "ী",
    103: "ু",
    104: "ূ",
    105: "ৃ",
    106: "ে",
    107: "ৈ",
    108: "ো",
    109: "ৌ",
    110: "ৎ",
    111: "ড়",
    112: "ঢ়",
    113: "য়",
    114: "০",
    115: "১",
    116: "২",
    117: "৩",
    118: "৪",
    119: "৫",
    120: "৬",
    121: "৭",
    122: "৮",
    123: "৯",
};

global.Buffer = global.Buffer || require("buffer").Buffer;

if (typeof btoa === "undefined") {
    global.btoa = function (str) {
        return new Buffer.from(str, "binary").toString("base64");
    };
}

if (typeof atob === "undefined") {
    global.atob = function (b64Encoded) {
        return new Buffer.from(b64Encoded, "base64").toString("binary");
    };
}

exports.test = (req, res) => {
    // console.log("Body: ", req.body);
    // res.set("Access-Control-Allow-Origin", "*");

    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // Setting up tfjs with the model we downloaded

    tf.loadLayersModel("file://./model/model.json")
        .then(function (model) {
            myModel = model;
            // console.log("My Model: ", myModel);
        })
        .catch(err => {
            console.log(err.message);
        });

    function dataURLtoFile(dataurl, filename) {
        let arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        // console.log("Length", n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        // let file = new File(filename, {
        //     encoding:  "utf8",
        // });
        // return new File([u8arr], filename, { type: mime });
        fs.writeFile(filename, u8arr, err => {});

        /* let myimage = new PNG(u8arr);

        let width = myimage.width;
        let height = myimage.height;

        myimage.decode(function (pixels) {
            //Pixels is a 1D array containing pixel data
            console.log("Pixel", width, height, pixels.length);
        }); */

        sharp(u8arr)
            .resize(32, 32)
            .grayscale()
            .raw()
            .toBuffer(function (err, data) {
                // data is a Buffer containing uint8 values (0-255)
                // with each byte representing one pixel
                // console.log("Data", data.length, data);
                predict(data);
            });

        // predict(u8arr);
        sharp(u8arr)
            .resize(32, 32)
            .grayscale()
            .toFile("output.png", (err, info) => {
                if (err) {
                    console.log(err.message);
                }
            });
    }

    /* let callback = err => {
        if (err) throw err;
        console.log("It's saved!");
        // let file = fs.readFileSync("a.png");
        // console.log(file);

        cv.readImage("a.png", function (err, img) {
            if (err) {
                console.log("err", err.message);
            }
            // img.convertGrayscale();
            console.log("image", img.toBuffer());
        });

        sharp("a.png")
            .resize(32, 32)
            .toFile("output.png", function (err) {
                // output.jpg is a 200 pixels wide and 200 pixels high image
                // containing a scaled and cropped version of input.jpg
                let output = fs.readFileSync("output.png");
                console.log(output);

                cv.readImage("output.png", function (err, img) {
                    if (err) {
                        console.log("err", err.message);
                    }
                    // img.convertGrayscale();
                    console.log("image", img.toBuffer().length);
                    console.log(new cv.Matrix.Eye(32, 32).toBuffer().length);
                    predict(new cv.Matrix(1024, 1));
                });
            });
    }; */

    // Predict function
    let predict = function (input) {
        if (myModel) {
            // console.log("Reached");
            input = [...input].map(val => val / 255.0);
            myModel
                .predict([tf.tensor(input).reshape([1, 32, 32, 1])])
                .array()
                .then(function (scores) {
                    index = scores[0].indexOf(Math.max(...scores[0]));
                    console.log("Letter:", letterMap[index]);
                    res.json({
                        letter: letterMap[index],
                    });
                    // scores = scores[0];
                    // predicted = scores
                    //     .indexOf(Math.max(...scores));
                    // $('#number').html(predicted);
                })
                .catch(err => {
                    console.log(err.message);
                });
        } else {
            // The model takes a bit to load,
            // if we are too fast, wait
            setTimeout(function () {
                predict(input);
            }, 50);
        }
    };

    dataURLtoFile(req.body.img, "a.png");

    // setTimeout(function () {
    //     res.json({
    //         letter: "অ",
    //     });
    // }, 2000);
};
