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
      "_$id": "rsho6au9",
      "_$type": "Image",
      "name": "Image",
      "width": 640,
      "height": 1136,
      "left": 0,
      "right": 0,
      "top": 0,
      "bottom": 0,
      "skin": "res://35f8f6aa-6052-4195-8bc9-ab0ad95e363f",
      "color": "#ffffff"
    },
    {
      "_$id": "bpnyws0x",
      "_$type": "Sprite",
      "name": "groundSprite",
      "y": 1200,
      "width": 640,
      "height": 5,
      "_gcmds": [
        {
          "_$type": "DrawRectCmd",
          "x": 0,
          "y": 0,
          "width": 1,
          "height": 1,
          "percent": true,
          "lineWidth": 1,
          "lineColor": "rgba(0, 0, 0, 1)",
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
          "height": 5
        }
      ]
    },
    {
      "_$id": "2975nq2j",
      "_$type": "Sprite",
      "name": "groundSprite",
      "y": 1200,
      "width": 640,
      "height": 5,
      "_gcmds": [
        {
          "_$type": "DrawRectCmd",
          "x": 0,
          "y": 0,
          "width": 1,
          "height": 1,
          "percent": true,
          "lineWidth": 1,
          "lineColor": "rgba(0, 0, 0, 1)",
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
          "height": 5
        }
      ]
    },
    {
      "_$id": "au6vhaop",
      "_$type": "Sprite",
      "name": "groundSpriteTop",
      "y": -5,
      "width": 640,
      "height": 5,
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
          "friction": 0,
          "label": "groundWall",
          "width": 640,
          "height": 5
        }
      ]
    },
    {
      "_$id": "zrbo3tqo",
      "_$type": "Sprite",
      "name": "groundSpriteLeft",
      "x": -5,
      "width": 5,
      "height": 1200,
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
          "label": "groundWall",
          "width": 5,
          "height": 1136
        }
      ]
    },
    {
      "_$id": "xxcy3y6d",
      "_$type": "Sprite",
      "name": "groundSpriteRight",
      "x": 640,
      "width": 5,
      "height": 1200,
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
          "label": "groundWall",
          "width": 5,
          "height": 1136
        }
      ]
    },
    {
      "_$id": "yd502mrr",
      "_$type": "Sprite",
      "name": "$ballSprite",
      "x": 305,
      "y": 300,
      "width": 30,
      "height": 30,
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
          "fillColor": "rgba(66, 228, 17, 1)"
        }
      ],
      "_$comp": [
        {
          "_$type": "RigidBody",
          "type": "static",
          "gravityScale": 0,
          "angularVelocity": 0.5,
          "group": 1
        },
        {
          "_$id": "03bb",
          "_$type": "CircleCollider",
          "friction": 0.3,
          "restitution": 1,
          "label": "ball",
          "radius": 15
        }
      ],
      "_$child": [
        {
          "_$id": "n35dria1",
          "_$type": "Label",
          "name": "lab",
          "x": 10,
          "y": 5,
          "width": 10,
          "height": 21,
          "centerX": 0,
          "centerY": 0,
          "text": "2",
          "fontSize": 20,
          "color": "rgba(255, 0, 0, 1)",
          "fitContent": "yes",
          "bold": true,
          "valign": "top",
          "padding": "0,0,0,0"
        }
      ]
    }
  ]
}