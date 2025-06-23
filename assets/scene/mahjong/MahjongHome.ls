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
      "x": -25,
      "width": 690,
      "height": 1136,
      "top": 0,
      "bottom": 0,
      "centerX": 0,
      "skin": "res://35f8f6aa-6052-4195-8bc9-ab0ad95e363f",
      "color": "#ffffff"
    },
    {
      "_$id": "5gs5bzpl",
      "_$type": "Label",
      "name": "Label",
      "x": 116,
      "y": 150,
      "width": 408,
      "height": 101,
      "centerX": 0,
      "text": "雀神连连",
      "fontSize": 100,
      "color": "rgba(252, 236, 185, 1)",
      "fitContent": "yes",
      "bold": true,
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
      "y": 800,
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
      "x": 554,
      "y": 600,
      "width": 84,
      "height": 84,
      "right": 2,
      "skin": "res://c256f931-47d9-4e7c-9b90-22bcf6702838",
      "color": "#ffffff",
      "_$comp": [
        {
          "_$type": "3ea598d3-269f-4c38-b159-72d3e3afa6f9",
          "scriptPath": "../src/script/ClickScale.ts",
          "mdrClickCall": "onClickBtnHoodle"
        }
      ]
    },
    {
      "_$id": "yir6nxvc",
      "_$type": "Box",
      "name": "Box",
      "x": 120,
      "y": 380,
      "width": 400,
      "height": 160,
      "alpha": 0.4,
      "centerX": 0,
      "bgColor": "rgba(0, 0, 0, 1)"
    },
    {
      "_$id": "iunk770b",
      "_$type": "Label",
      "name": "Label",
      "x": 260,
      "y": 400,
      "width": 120,
      "height": 31,
      "centerX": 0,
      "text": "当前进度",
      "fontSize": 30,
      "color": "rgba(254, 254, 254, 1)",
      "fitContent": "yes",
      "valign": "top",
      "padding": "0,0,0,0",
      "strokeColor": "rgba(255, 255, 255, 1)"
    },
    {
      "_$id": "gfkv3p7k",
      "_$type": "Label",
      "name": "$labCurLevel",
      "x": 307,
      "y": 464,
      "width": 26,
      "height": 51,
      "centerX": 0,
      "text": "3",
      "fontSize": 50,
      "color": "rgba(66, 228, 34, 1)",
      "fitContent": "yes",
      "bold": true,
      "valign": "top",
      "padding": "0,0,0,0",
      "stroke": 2,
      "strokeColor": "rgba(0, 0, 0, 1)"
    },
    {
      "_$id": "hlyo5dfq",
      "_$type": "Image",
      "name": "$btnSound",
      "x": 14,
      "y": 89,
      "width": 46,
      "height": 46,
      "skin": "res://bafdf4ea-921c-4e9d-9d28-439f03a9cc11",
      "useSourceSize": true,
      "color": "#ffffff",
      "_$comp": [
        {
          "_$type": "3ea598d3-269f-4c38-b159-72d3e3afa6f9",
          "scriptPath": "../src/script/ClickScale.ts",
          "mdrClickCall": "onClickSound"
        }
      ]
    }
  ]
}