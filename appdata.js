const express = require('express')
const app = express()
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('node:fs/promises')

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)
    const links = []
    $('#mw-pages a').each((index, element) => {
      const link = $(element).attr('href')
      links.push(link)
    })
    const data = []
    for(const link of links) {
      const linkUrl = await scrapeLinkUrl(link)
      data.push(linkUrl)
    }
    await fs.writeFile('output.json', JSON.stringify(data, null, 2))
    res.send('ya me he traido to!')
  } catch(err) {
    console.log(`Este es el error ${err}`)
  }
})

const scrapeLinkUrl = async (link) => {
  const response = await axios.get(`https://es.wikipedia.org${link}`)
  const html = response.data
  const $ = cheerio.load(html)

  const h1 = $('h1').text()
  const img = []
  
  $('img').each((index, image) => {
    const src = $(image).attr('src')
    img.push(src)
  })
  
  const text = []

  $('p').each((index, paragraph) => {
    const p = $(paragraph).text()
    text.push({text: p})
  })
  return { h1, img, text }
}

const leerArchivo = async () => {
  try {
    const data = await fs.readFile('output.json', 'utf-8')
    const objeto = JSON.parse(data)

    console.log(objeto.map(element => element.h1))
  } catch (err){
    console.log(err)
  }
}

leerArchivo()

const PORT = 3000
app.listen(PORT, () => {
  console.log(`El servidor está escuchando en el puerto http://localhost:${PORT}`)
})