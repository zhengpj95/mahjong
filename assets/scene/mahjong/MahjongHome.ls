{
  "_$ver": 1,
  "_$id": "7j8vyegl",
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
      "_$id": "3q1y69uq",
      "_$type": "Image",
      "name": "img_mahjong_login_bg",
      "x": -192,
      "width": 1024,
      "height": 1136,
      "top": 0,
      "bottom": 0,
      "centerX": 0,
      "skin": "res://eff5c91f-1863-4fcc-a107-5327925b90b2",
      "color": "#ffffff"
    },
    {
      "_$id": "5gs5bzpl",
      "_$type": "Label",
      "name": "Label",
      "x": 200,
      "y": 320,
      "width": 240,
      "height": 61,
      "centerX": 0,
      "text": "雀神连连",
      "fontSize": 60,
      "color": "rgba(252, 236, 185, 1)",
      "fitContent": "yes",
      "valign": "top",
      "padding": "0,0,0,0",
      "stroke": 5,
      "strokeColor": "rgba(44, 27, 9, 1)"
    },
    {
      "_$id": "xr1wjs5x",
      "_$type": "Image",
      "name": "btnStart",
      "x": 137,
      "y": 735,
      "width": 366,
      "height": 120,
      "skin": "res://d52873cd-9e52-4b53-a81c-4e013506b80f",
      "useSourceSize": true,
      "color": "#ffffff",
      "_$comp": [
        {
          "_$type": "3ea598d3-269f-4c38-b159-72d3e3afa6f9",
          "scriptPath": "../src/script/ClickScale.ts",
          "mdrClickCall": "onClickBtnStart"
        }
      ]
    },
    {
      "_$id": "k6arf7gs",
      "_$type": "Image",
      "name": "$btnHoodle",
      "x": 551,
      "y": 480,
      "width": 84,
      "height": 84,
      "right": 5,
      "skin": "res://c256f931-47d9-4e7c-9b90-22bcf6702838",
      "color": "#ffffff",
      "_$comp": [
        {
          "_$type": "3ea598d3-269f-4c38-b159-72d3e3afa6f9",
          "scriptPath": "../src/script/ClickScale.ts",
          "mdrClickCall": "onClickBtnHoodle"
        }
      ]
    }
  ]
}