{
  "_$ver": 1,
  "_$id": "d4ukeley",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "2dUI",
  "width": 640,
  "height": 1136,
  "_$child": [
    {
      "_$id": "bpnyws0x",
      "_$var": true,
      "_$type": "Sprite",
      "name": "groundSprite",
      "y": 1165,
      "width": 640,
      "height": 30,
      "_gcmds": [
        {
          "_$type": "DrawRectCmd",
          "x": 0,
          "y": 0,
          "width": 1,
          "height": 1,
          "percent": true,
          "lineWidth": 1,
          "lineColor": "#000000",
          "fillColor": "rgba(0, 0, 0, 1)"
        }
      ],
      "_$comp": [
        {
          "_$type": "RigidBody",
          "type": "static"
        },
        {
          "_$id": "6dcr",
          "_$type": "BoxCollider",
          "label": "ground",
          "width": 640,
          "height": 30
        }
      ]
    },
    {
      "_$id": "zrbo3tqo",
      "_$type": "Sprite",
      "width": 5,
      "height": 1136,
      "_gcmds": [
        {
          "_$type": "DrawRectCmd",
          "x": 0,
          "y": 0,
          "width": 1,
          "height": 1,
          "percent": true,
          "lineWidth": 1,
          "lineColor": "#000000",
          "fillColor": "rgba(0, 0, 0, 1)"
        }
      ],
      "_$comp": [
        {
          "_$type": "RigidBody",
          "type": "static"
        },
        {
          "_$id": "6dcr",
          "_$type": "BoxCollider",
          "label": "groundLeft",
          "width": 5,
          "height": 1136
        }
      ]
    },
    {
      "_$id": "xxcy3y6d",
      "_$type": "Sprite",
      "x": 635,
      "width": 5,
      "height": 1136,
      "_gcmds": [
        {
          "_$type": "DrawRectCmd",
          "x": 0,
          "y": 0,
          "width": 1,
          "height": 1,
          "percent": true,
          "lineWidth": 1,
          "lineColor": "#000000",
          "fillColor": "rgba(0, 0, 0, 1)"
        }
      ],
      "_$comp": [
        {
          "_$type": "RigidBody",
          "type": "static"
        },
        {
          "_$id": "6dcr",
          "_$type": "BoxCollider",
          "label": "groundRight",
          "width": 5,
          "height": 1136
        }
      ]
    },
    {
      "_$id": "yd502mrr",
      "_$var": true,
      "_$type": "Sprite",
      "name": "ballSprite",
      "x": 291,
      "y": 342,
      "width": 100,
      "height": 100,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "_gcmds": [
        {
          "_$type": "DrawCircleCmd",
          "x": 0.5,
          "y": 0.5,
          "radius": 0.5,
          "percent": true,
          "lineWidth": 1,
          "lineColor": "#000000",
          "fillColor": "rgba(157, 27, 27, 1)"
        }
      ],
      "_$comp": [
        {
          "_$type": "RigidBody",
          "gravityScale": 0.5,
          "angularVelocity": 0.5
        },
        {
          "_$id": "03bb",
          "_$type": "CircleCollider",
          "restitution": 1,
          "label": "ball"
        }
      ],
      "_$child": [
        {
          "_$id": "n35dria1",
          "_$type": "Label",
          "name": "lab",
          "x": 40,
          "y": 40,
          "width": 20,
          "height": 21,
          "centerX": 0,
          "centerY": 0,
          "text": "10",
          "fontSize": 20,
          "color": "#FFFFFF",
          "fitContent": "yes",
          "valign": "top",
          "padding": "0,0,0,0"
        }
      ]
    },
    {
      "_$id": "1vx2afl0",
      "_$type": "Sprite",
      "x": 447,
      "y": 433,
      "width": 50,
      "height": 50,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "_gcmds": [
        {
          "_$type": "DrawRectCmd",
          "x": 0,
          "y": 0,
          "width": 1,
          "height": 1,
          "percent": true,
          "lineWidth": 1,
          "lineColor": "#000000",
          "fillColor": "rgba(59, 26, 26, 1)"
        }
      ],
      "_$comp": [
        {
          "_$type": "RigidBody",
          "gravityScale": 0.8,
          "angularVelocity": 0.5
        },
        {
          "_$id": "xhjg",
          "_$type": "BoxCollider",
          "restitution": 1,
          "label": "ball",
          "width": 50,
          "height": 50
        }
      ],
      "_$child": [
        {
          "_$id": "53vmd0nr",
          "_$type": "Label",
          "name": "lab",
          "x": 15,
          "y": 15,
          "width": 20,
          "height": 21,
          "centerX": 0,
          "centerY": 0,
          "text": "10",
          "fontSize": 20,
          "color": "#FFFFFF",
          "fitContent": "yes",
          "valign": "top",
          "padding": "0,0,0,0"
        }
      ]
    },
    {
      "_$id": "vdk1ev3s",
      "_$var": true,
      "_$type": "Image",
      "name": "imgBg",
      "x": 239,
      "y": 545,
      "width": 130,
      "height": 175,
      "skin": "res://4e953fc8-c319-49ab-bd2f-994dd3b36881",
      "useSourceSize": true,
      "color": "#ffffff",
      "_$child": [
        {
          "_$id": "yghjoqs9",
          "_$var": true,
          "_$type": "Label",
          "name": "lab",
          "y": 47,
          "width": 120,
          "height": 28,
          "text": "13",
          "font": "STSong",
          "fontSize": 30,
          "color": "rgba(148, 10, 10, 1)",
          "valign": "top",
          "padding": "0,0,0,0"
        },
        {
          "_$id": "m0863rta",
          "_$var": true,
          "_$type": "Label",
          "name": "lab1",
          "width": 120,
          "height": 28,
          "text": "13",
          "font": "STSong",
          "fontSize": 30,
          "color": "rgba(148, 10, 10, 1)",
          "valign": "top",
          "padding": "0,0,0,0"
        }
      ]
    },
    {
      "_$id": "3krgjccb",
      "_$var": true,
      "_$type": "Image",
      "name": "imgBg1",
      "x": 144,
      "y": 567,
      "width": 130,
      "height": 175,
      "skin": "res://4e953fc8-c319-49ab-bd2f-994dd3b36881",
      "useSourceSize": true,
      "color": "#ffffff",
      "_$child": [
        {
          "_$id": "v6y8lgjf",
          "_$var": true,
          "_$type": "Label",
          "name": "lab",
          "y": 47,
          "width": 120,
          "height": 28,
          "text": "13",
          "font": "STSong",
          "fontSize": 30,
          "color": "rgba(148, 10, 10, 1)",
          "valign": "top",
          "padding": "0,0,0,0"
        }
      ]
    },
    {
      "_$id": "ef91tg01",
      "_$prefab": "5b041417-76b6-4e13-8097-5ad27bb7a39f",
      "_$var": true,
      "name": "bar",
      "active": true,
      "x": 55,
      "y": 750,
      "visible": true
    }
  ]
}