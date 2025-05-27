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
      "_$type": "Sprite",
      "name": "groundSprite",
      "y": 1136,
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
          "type": "static",
          "mask": 0
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
      "y": 1180,
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
          "friction": 0,
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
    },
    {
      "_$id": "xrl9jogv",
      "_$prefab": "e7e17fee-1c77-4048-986e-0e2b644516a3",
      "name": "BlockCircle",
      "active": true,
      "x": 338,
      "y": 1096,
      "visible": true
    },
    {
      "_$id": "5jdop7td",
      "_$prefab": "6e72e45d-56d7-4cdc-8882-abbcf868b851",
      "name": "BlockRect",
      "active": true,
      "x": 424,
      "y": 1097,
      "visible": true
    },
    {
      "_$id": "1sh66uqj",
      "_$prefab": "6e72e45d-56d7-4cdc-8882-abbcf868b851",
      "name": "BlockRect(1)",
      "active": true,
      "x": 445,
      "y": 1037,
      "visible": true
    },
    {
      "_$id": "unfna3qf",
      "_$prefab": "e7e17fee-1c77-4048-986e-0e2b644516a3",
      "name": "BlockCircle(1)",
      "active": true,
      "x": 475,
      "y": 965,
      "visible": true
    },
    {
      "_$id": "oetwrmri",
      "_$type": "Sprite",
      "name": "BlockCircle(2)",
      "x": 233,
      "y": 1059,
      "width": 50,
      "height": 50,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "_gcmds": [
        {
          "_$type": "DrawPolyCmd",
          "x": 0,
          "y": 0,
          "points": [
            0,
            0,
            30,
            0,
            40,
            10,
            50,
            50,
            0,
            50
          ],
          "lineWidth": 0,
          "lineColor": "#000000",
          "fillColor": "rgba(0, 0, 0, 1)"
        }
      ],
      "_$comp": [
        {
          "_$type": "RigidBody",
          "type": "static",
          "gravityScale": 0.8,
          "angularVelocity": 0.5
        },
        {
          "_$id": "xhjg",
          "_$type": "BoxCollider",
          "restitution": 1,
          "label": "enemy",
          "width": 50,
          "height": 50
        }
      ],
      "_$child": [
        {
          "_$id": "jti4c65s",
          "_$type": "Label",
          "name": "$lab",
          "x": 20,
          "y": 20,
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
    }
  ]
}