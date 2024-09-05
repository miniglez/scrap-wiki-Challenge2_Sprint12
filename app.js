const express = require("express")
const app = express()
const axios = require("axios")
const cheerio = require("cheerio")
const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'
const PORT = 3000

const setData = (myData) => {
    const template = 
    `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
        <h1>Elementos Scrapeados</h1>
        ${
            myData.map(element => {
                const template2 = 
                `
                    <h2>${element.h1}</h2>
                    <h3>Urls de imagenes</h3>
                    <ul>
                        ${element.img.map(element2 => {
                            return `<li>${element2}</li>`
                            })}
                    </ul>
                    <h3>Textos</h3>
                    <ul>
                        ${element.p.map(element2 => {
                            return `<li>${element2}</li>`
                            }).join("")}
                    </ul>
                `
                return template2
            }).join("")
        }   
        </body>
        </html>
    `
    return template
}

const getAllData = async (link) => {
        const response = await axios.get("https://es.wikipedia.org"+link)
            
        const html = response.data
        const $ = cheerio.load(html)

        const imgs = []
        const ps = []
        $("img").each((index, element) => {
            const img = $(element).attr("src")
            imgs.push(img)
        })

        $("p").each((index, element) => {
            const p = $(element).text()
            ps.push(p)
        })

        return {
            h1: $("h1").text(),
            img: imgs,
            p: ps
        }
            
}

app.get("/", async (req, res) => {
    try{
        const response = await axios.get(url)
        if(response.status === 200){
            const html = response.data
            const $ = cheerio.load(html)
            const links = []
            $("#mw-pages a").each((index, element) => {
                const link = $(element).attr("href")
                links.push(link)
            })

            const allData = []

            for(let link of links){
                const data = getAllData(link)
                allData.push(data)
            }
            
            const myData = await Promise.all(allData)
            const template = setData(myData)
            res.send(template)
        }
    }
    catch(error){
        console.log("La peticion principal fallo")
    }

})//Final Funcion

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})