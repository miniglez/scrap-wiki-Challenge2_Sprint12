const axios = require("axios")
const cheerio = require("cheerio")
const url = "https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap"

const cosa = async(app) => {
    axios.get(url).then(async (res) => {
       if(res.status === 200){
            const html = res.data
            const $ = cheerio.load(html)
            const links = []
            $("#mw-pages a").each((index, element) => {
                const link = $(element).attr("href")
                if(link){
                    links.push(link)
            }
            })
            const allElements = await Promise.all(getAllData(links))
            console.log(allElements)

            const allData = links.map(async (ele) => {
                const allData = await Promise.all(axios.get("https://es.wikipedia.org"+ele).then(response => {
                    const html2 = response.data
                    const $2 = cheerio.load(html2)
                    const imgs = []
                    const ps = []

                    $2("img").each((index, element) => {
                        const img = $(element).attr("src")
                        imgs.push(img)
                    })
                    
                    $2("p").each((index, element) => {
                        const p = $(element).text()
                        ps.push(p)
                    })

                    const element = {
                        h1:  $2("h1").text(),
                        imgs: imgs,
                        p: ps
                    }
                    console.log(element)
                    
                }).catch(() => "Falla"))
                return allData
        })

            
        }
}).catch(() => "Falla")}

const getAllData = (links) => {
    
}

console.log(cosa())