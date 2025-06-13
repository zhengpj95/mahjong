{
  "_$ver": 1,
  "_$id": "b5z8rnun",
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
      "_$id": "sg6lklqk",
      "_$type": "Image",
      "name": "img_mahjong_bg1",
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
      "_$id": "rl6vw3n1",
      "_$type": "Image",
      "name": "img_mahjong_bg",
      "y": 210,
      "width": 640,
      "height": 720,
      "centerX": 0,
      "skin": "res://1d9ec96c-0d83-4636-b0a9-87fc07bde991",
      "useSourceSize": true,
      "color": "#ffffff"
    },
    {
      "_$id": "ae4e4wgo",
      "_$type": "Image",
      "name": "btnTips",
      "x": 150,
      "y": 1008,
      "width": 142,
      "height": 48,
      "skin": "res://64dbfcd1-7881-47db-b1d3-af7139fbed16",
      "useSourceSize": true,
      "color": "#ffffff",
      "_$comp": [
        {
          "_$type": "3ea598d3-269f-4c38-b159-72d3e3afa6f9",
          "scriptPath": "../src/script/ClickScale.ts",
          "mdrClickCall": ""
        }
      ],
      "_$child": [
        {
          "_$id": "2j3uftor",
          "_$type": "Label",
          "name": "lab",
          "x": 43,
          "y": 10,
          "width": 56,
          "height": 29,
          "centerX": 0,
          "centerY": 0,
          "text": "提示",
          "fontSize": 28,
          "color": "rgba(255, 152, 0, 1)",
          "fitContent": "yes",
          "valign": "top",
          "padding": "0,0,0,0",
          "stroke": 2
        }
      ]
    },
    {
      "_$id": "myg4h9kw",
      "_$type": "Image",
      "name": "btnRefresh",
      "x": 349,
      "y": 1008,
      "width": 142,
      "height": 48,
      "skin": "res://64dbfcd1-7881-47db-b1d3-af7139fbed16",
      "useSourceSize": true,
      "color": "#ffffff",
      "_$comp": [
        {
          "_$type": "3ea598d3-269f-4c38-b159-72d3e3afa6f9",
          "scriptPath": "../src/script/ClickScale.ts",
          "mdrClickCall": ""
        }
      ],
      "_$child": [
        {
          "_$id": "dhc4nlif",
          "_$type": "Label",
          "name": "lab",
          "x": 43,
          "y": 10,
          "width": 56,
          "height": 29,
          "centerX": 0,
          "centerY": 0,
          "text": "洗牌",
          "fontSize": 28,
          "color": "rgba(255, 152, 0, 1)",
          "fitContent": "yes",
          "valign": "top",
          "padding": "0,0,0,0",
          "stroke": 2
        }
      ]
    },
    {
      "_$id": "sokmf7zd",
      "_$type": "Image",
      "name": "btnRule",
      "x": 580,
      "y": 157,
      "width": 42,
      "height": 43,
      "skin": "res://7b247024-2187-4b21-85b0-22a7e8f0c105",
      "useSourceSize": true,
      "color": "#ffffff",
      "_$comp": [
        {
          "_$type": "3ea598d3-269f-4c38-b159-72d3e3afa6f9",
          "scriptPath": "../src/script/ClickScale.ts",
          "mdrClickCall": ""
        }
      ]
    },
    {
      "_$id": "l7yfjja8",
      "_$type": "Image",
      "name": "btnBack",
      "x": 10,
      "y": 983,
      "width": 98,
      "height": 98,
      "skin": "res://4f7a4ce7-b305-45a6-89b9-e807ad820423",
      "useSourceSize": true,
      "color": "#ffffff",
      "_$comp": [
        {
          "_$type": "3ea598d3-269f-4c38-b159-72d3e3afa6f9",
          "scriptPath": "../src/script/ClickScale.ts",
          "mdrClickCall": ""
        }
      ],
      "_$child": [
        {
          "_$id": "k2fxgzdg",
          "_$type": "Image",
          "name": "img_btn_back1",
          "x": 17,
          "y": 17,
          "width": 64,
          "height": 64,
          "centerX": 0,
          "centerY": 0,
          "skin": "res://f10ea769-c41c-4e6f-8925-0be44e205fec",
          "useSourceSize": true,
          "color": "#ffffff"
        }
      ]
    },
    {
      "_$id": "3sul2o8g",
      "_$prefab": "5b041417-76b6-4e13-8097-5ad27bb7a39f",
      "name": "bar",
      "active": true,
      "x": 70,
      "y": 165,
      "width": 500,
      "visible": true,
      "centerX": 0
    },
    {
      "_$id": "asghca1v",
      "_$type": "Label",
      "name": "labLevel",
      "x": 100,
      "y": 130,
      "width": 100,
      "height": 51,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "text": "0",
      "fontSize": 50,
      "color": "rgba(240, 240, 240, 1)",
      "fitContent": "height",
      "align": "center",
      "valign": "top",
      "padding": "0,0,0,0"
    },
    {
      "_$id": "53vmd9uh",
      "_$type": "HBox",
      "name": "boxScore",
      "x": 470,
      "y": 130,
      "width": 150,
      "height": 30,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "_mouseState": 2,
      "centerX": 150,
      "space": 3,
      "align": "middle",
      "_$child": [
        {
          "_$id": "c31n7t8m",
          "_$type": "Label",
          "name": "Label",
          "width": 120,
          "height": 30,
          "text": "得分：",
          "fontSize": 30,
          "color": "#FFFFFF",
          "valign": "top",
          "padding": "0,0,0,0"
        },
        {
          "_$id": "fb4amvri",
          "_$type": "Label",
          "name": "lab",
          "x": 123,
          "width": 15,
          "height": 30,
          "text": "0",
          "fontSize": 30,
          "color": "#FFFFFF",
          "valign": "top",
          "padding": "0,0,0,0"
        }
      ]
    },
    {
      "_$id": "qensfnul",
      "_$type": "List",
      "name": "listItem",
      "x": 44,
      "y": 267,
      "width": 552,
      "height": 602,
      "_mouseState": 2,
      "centerX": 0,
      "centerY": 0,
      "itemTemplate": {
        "_$ref": "yuvbyb4b",
        "_$tmpl": "itemRender"
      },
      "repeatX": 10,
      "repeatY": 8,
      "_$child": [
        {
          "_$id": "yuvbyb4b",
          "_$type": "Box",
          "name": "render",
          "width": 55,
          "height": 75,
          "_$child": [
            {
              "_$id": "aspmi8ku",
              "_$type": "Box",
              "name": "boxCard",
              "x": 28,
              "y": 38,
              "width": 130,
              "height": 175,
              "anchorX": 0.5,
              "anchorY": 0.5,
              "scaleX": 0.4,
              "scaleY": 0.4,
              "_$child": [
                {
                  "_$id": "olwi7anp",
                  "_$type": "Image",
                  "name": "img",
                  "width": 130,
                  "height": 175,
                  "_mouseState": 2,
                  "skin": "res://06cd2ca5-4b52-44a5-a300-2977b7e34327",
                  "useSourceSize": true,
                  "color": "#ffffff"
                },
                {
                  "_$id": "adrvim4g",
                  "_$type": "Image",
                  "name": "imgSelected",
                  "x": -6,
                  "y": -6,
                  "width": 142,
                  "height": 187,
                  "left": -6,
                  "right": -6,
                  "top": -6,
                  "bottom": -6,
                  "skin": "res://3a621986-982f-4aac-94b2-bfd7a9c2f268",
                  "color": "#ffffff"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}