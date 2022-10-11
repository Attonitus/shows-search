const d = document,
$search = d.getElementById("search"),
$h1 = d.querySelector("h1"),
$h2 = d.querySelector("h2"),
$main = d.querySelector("main"),
$fragment = d.createDocumentFragment()


const getShows = async (buscado) =>{
    try {
        $h1.innerHTML ="Buscador Shows de TV"
        $main.innerHTML=""
        let buscadoRe = buscado.replace(/\s/g, '+'),
        res = await fetch(`https://api.tvmaze.com/search/shows?q=${buscadoRe}`),
        json = await res.json()

        if(!res.ok)throw{status: res.status, statusText: res.statusText}

        if(json.length === 0){
            $h2.innerHTML = `No existen resultados`
        }else{
            $h2.innerHTML = `Resultados para "${buscado}"`
    
            json.forEach(ele => {
    
                let show = ele.show,
                score = ele.score,
                $article = d.createElement("article"),
                $h3 = d.createElement("h3"),
                $div = d.createElement("div"),
                $img = d.createElement("img"),
                $Scoreh3 = d.createElement("h3")
    
                $h3.innerHTML = show.name
                $article.appendChild($h3)
    
                if(score>0.85){
                    $article.classList.add("good")
                } else if(score>=0.65 && score <= 0.85){
                    $article.classList.add("meh")
                } else if(score < 0.65){
                    $article.classList.add("bad")
                }
    
                $div.innerHTML = show.summary ? show.summary : "Sin descripción"
                $article.appendChild($div)
    
                $img.setAttribute("src", `${show.image.original ? show.image.original : "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png"}`)
                $img.setAttribute("alt", `Imagen original de ${show.name}`)
                $img.setAttribute("title", `Imagen original de ${show.name}`)
                $img.setAttribute("width", `200`)
                $article.appendChild($img)
                $Scoreh3.innerHTML = `Calificación: ${Math.floor(score*100)}`
                $article.appendChild($Scoreh3)
    
                $fragment.appendChild($article)
            });
            $main.innerHTML=""
            $main.appendChild($fragment)
        }

    } catch (err) {
        let message = err.statusText || "Ocurrió un error"
        $h1.innerHTML= `Error ${err.status}: ${message}` 
    }
}

$search.addEventListener("keydown", async e=>{
    if(e.key === "Enter"){
        e.preventDefault()
        getShows($search.value)

    }
})

