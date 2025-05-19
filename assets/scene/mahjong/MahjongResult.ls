{
  "_$ver": 1,
  "_$id": "0xh3yy5y",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "Scene2D",
  "width": 640,
  "height": 1136,
  "_$child": [
    {
      "_$id": "y2rzoli8",
      "_$type": "Image",
      "name": "img_bg1",
      "x": 60,
      "y": 318,
      "width": 520,
      "height": 500,
      "centerX": 0,
      "centerY": 0,
      "skin": "res://7e60d2bf-52bf-45ee-a680-95c6bbbdc938",
      "color": "#ffffff"
    },
    {
      "_$id": "evcoq60c",
      "_$type": "Box",
      "name": "boxHtml",
      "x": 70,
      "y": 518,
      "width": 500,
      "height": 22,
      "centerX": 0,
      "_$child": [
        {
          "_$id": "l6ihkptu",
          "_$type": "Label",
          "name": "lab",
          "x": 198,
          "width": 105,
          "height": 31,
          "centerX": 0,
          "text": "得分：0",
          "fontSize": 30,
          "color": "#FFFFFF",
          "fitContent": "yes",
          "valign": "top",
          "padding": "0,0,0,0"
        }
      ]
    },
    {
      "_$id": "336sn3y9",
      "_$type": "Image",
      "name": "btnNext",
      "x": 349,
      "y": 720,
      "width": 142,
      "height": 48,
      "skin": "res://64dbfcd1-7881-47db-b1d3-af7139fbed16",
      "useSourceSize": true,
      "color": "#ffffff",
      "_$comp": [
        {
          "_$type": "3ea598d3-269f-4c38-b159-72d3e3afa6f9",
          "scriptPath": "../src/script/ClickScale.ts"
        }
      ],
      "_$child": [
        {
          "_$id": "skc75uy9",
          "_$type": "Label",
          "name": "lab",
          "x": 32,
          "y": 11,
          "width": 78,
          "height": 27,
          "centerX": 0,
          "centerY": 0,
          "text": "下一关",
          "fontSize": 26,
          "color": "rgba(255, 152, 0, 1)",
          "fitContent": "yes",
          "align": "center",
          "valign": "middle",
          "padding": "0,0,0,0",
          "stroke": 2
        }
      ]
    },
    {
      "_$id": "plcmjply",
      "_$type": "Image",
      "name": "btnHome",
      "x": 148,
      "y": 720,
      "width": 142,
      "height": 48,
      "skin": "res://64dbfcd1-7881-47db-b1d3-af7139fbed16",
      "useSourceSize": true,
      "color": "#ffffff",
      "_$comp": [
        {
          "_$type": "3ea598d3-269f-4c38-b159-72d3e3afa6f9",
          "scriptPath": "../src/script/ClickScale.ts"
        }
      ],
      "_$child": [
        {
          "_$id": "umraglva",
          "_$type": "Label",
          "name": "lab",
          "x": 32,
          "y": 11,
          "width": 78,
          "height": 27,
          "centerX": 0,
          "centerY": 0,
          "text": "主界面",
          "fontSize": 26,
          "color": "rgba(255, 152, 0, 1)",
          "fitContent": "yes",
          "align": "center",
          "valign": "middle",
          "padding": "0,0,0,0",
          "stroke": 2
        }
      ]
    }
  ]
}