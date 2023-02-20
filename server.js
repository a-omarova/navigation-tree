const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()
const data = require('./src/data.json')

app.prepare()
  .then(() => {
    const server = express()
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({extended: true}))

    server.get('/api/data', (req, res) => {
      return res.send(data)
    })

    server.get('/api/data/top-level', (req, res) => {
      const listOfTopLvl = [];

      data.topLevelIds.forEach((id) => {
        const section = data.entities.pages[id]
        listOfTopLvl.push({
          id: id,
          title: section.title,
          level: section.level,
          hasChildren: section.pages && section.pages.length !== 0
        })
      })

      return res.send(listOfTopLvl)
    })

    server.get('/api/data/:id', (req, res) => {
      const id = req.params.id;
      const nodeList = []

      data.entities.pages[id].pages.forEach((id) => {
        const section = data.entities.pages[id]
        nodeList.push({
          id: id,
          title: section.title,
          level: section.level,
          hasChildren: section.pages && section.pages.length !== 0
        })
      })

      return res.send(nodeList)
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, (err) => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
