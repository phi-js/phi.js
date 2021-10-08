export default [
  {
    "or": [
      {
        "and": [
          {
            "field": "firstname",
            "op": "eq",
            "args": "santiago"
          },
          {
            "field": "lastname",
            "op": "eq",
            "args": "cortes"
          }
        ]
      },

      {
        "call": "deudores",
        "args": {
          "debt": 29162000
        }
      },

      { "field": "id", "op": "eq", "args": 1 }
    ]
  },

  {
    "chain": [
      {
        "info": {
          "icon": "mdi:api",
          "text": "Obtener lista de personas",
          "secondary": "Ejecutar request HTTP"
        },
        "do": {
          "call": "fetch",
          "args": {
            "url": "http://v4.local/people?limit={{limit}}&q={{q}}",
            "options": {
              "method": "get",
              "body": null
            }
          }
        },
        "assign": "personas"
      },
      {
        "info": {
          "icon": "mdi:gate-not",
          "text": "Si hay mas de 50 resultados"
        },
        "do": {
          "if": {
            "and": [
              {
                "op": "gt",
                "arg1": null,
                "arg2": null,
                "field": "personas.length",
                "args": "50"
              }
            ]
          },
          "then": {
            "chain": [
              {
                "info": {
                  "icon": "mdi:window-maximize",
                  "text": "Alerta por exceso",
                  "secondary": "window.alert"
                },
                "do": {
                  "call": "window.alert",
                  "args": {
                    "message": "Hay demasiados resultados",
                    "placeholder": ""
                  }
                },
                "assign": null
              }
            ]
          },
          "else": {
            "chain": [
              {
                "info": {
                  "icon": "mdi:transfer",
                  "text": "Filtrar personas con foto"
                },
                "do": {
                  "op": "array.filter",
                  "arg1": null,
                  "arg2": null,
                  "field": "personas",
                  "args": {
                    "arguments": [
                      "item",
                      "index"
                    ],
                    "function": {
                      "not": {
                        "op": "contains",
                        "arg1": null,
                        "field": "item.avatar",
                        "args": "default"
                      }
                    }
                  }
                },
                "assign": "personas con foto"
              },
              {
                "info": {
                  "icon": "mdi:transfer",
                  "text": "Transformar personas"
                },
                "do": {
                  "op": "array.map",
                  "arg1": null,
                  "arg2": null,
                  "field": "personas con foto",
                  "args": {
                    "arguments": [
                      "item",
                      "index"
                    ],
                    "function": {
                      "id": "{{item.id}}",
                      "title": "{{item.firstName}} {{item.lastName}}",
                      "url": "{{item.avatar}}",
                      "preview": "{{item.avatar}}",
                      "thumbnail": "{{item.avatar}}"
                    }
                  }
                },
                "assign": "filtradas"
              },
              {
                "info": {
                  "icon": "mdi:variable",
                  "text": "Generar objeto final"
                },
                "do": {
                  "call": "echo",
                  "args": {
                    "gallery": {
                      "title": "Mi album de fotos",
                      "files": "{{filtradas}}",
                      "view": "grid"
                    }
                  }
                },
                "assign": null
              }
            ]
          }
        },
        "assign": null
      }
    ]
  },

  {
    "call": "echo",
    "args": "Hola mundo"
  },

  {
    "chain": [
      {
        "info": {
          "icon": "mdi:window-maximize",
          "text": "Solicitar dato",
          "secondary": "window.prompt"
        },
        "do": {
          "call": "window.prompt",
          "args": {
            "message": "Hola! Como te llamas?",
            "placeholder": "N.N."
          }
        },
        "assign": "persona.nombre"
      },
      {
        "info": {
          "icon": "mdi:window-maximize",
          "text": "Alertar",
          "secondary": "window.alert"
        },
        "do": {
          "call": "window.alert",
          "args": {
            "message": "Hola {{persona.nombre}}",
            "placeholder": ""
          }
        },
        "assign": null
      },
      {
        "info": {
          "icon": "mdi:help-rhombus",
          "text": "If ..."
        },
        "do": {
          "if": {
            "and": [
              {
                "op": "eq",
                "arg1": null,
                "arg2": null,
                "field": "persona.nombre",
                "args": "dog"
              }
            ]
          },
          "then": {
            "chain": [
              {
                "info": {
                  "icon": "mdi:window-maximize",
                  "text": "Alertar",
                  "secondary": "window.alert"
                },
                "do": {
                  "call": "window.alert",
                  "args": {
                    "message": "Woof!",
                    "placeholder": ""
                  }
                },
                "assign": null
              }
            ]
          },
          "else": {
            "chain": []
          }
        },
        "assign": null,
        "then": null
      }
    ]
  },

  {
    "info": {
      "text": "Preguntar"
    },
    "do": {
      "if": {
        "call": "window.confirm",
        "args": { "message": "Quieres continuar ?" }
      },

      "then": {
        "call": "window.alert",
        "args": { "message": "Ok, continuamos" }
      },

      "else": {
        "do": {
          "call": "window.prompt",
          "args": {
            "message": "Lo siento, por que?",
            "placeholder": "No quiero decir"
          }
        },
        "then": {
          "arguments": ["entrada"],
          "function": {
            "call": "window.alert",
            "args": "{{entrada}} ?\nPues no me parece una buena razon"
          }
        }
      }
    },
  },

  {
    "chain": [
      {
        "info": {
          "text": "Obtener numeros impares"
        },
        "do": [1, 3, 5, 7, 9, 11],
        "assign": "lista",
      },

      {
        "info": {
          "text": "Transformar la lista"
        },
        "do": {
          "field": "lista",
          "op": "array.map",
          "args": {
            "arguments": ["elemento", "num"],
            "function": {
              "chain": [
                { "do": "Elemento {{elemento}} en {{num}}", "assign": "cadena" },
                { "do": "!!! {{cadena}} !!! {{num}}" }
              ]
            }
          }
        }
      }
    ]
  }
]