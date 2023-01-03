import '/node_modules/p5/lib/p5.min.js'

// Gebruiken van ES modules in P5: https://www.youtube.com/watch?v=P0bkwncSJag
import { Punt } from './Punt.js'
import { Speler } from './Speler.js'

const config = {
  spelers: [],
  hoekpunten: [],
  verplaatsBallen: true
}

window.stepNr = 0
window.logIter = 10000
const lijnkleur = 'black'

function setup(sketch) {
  // sketch.ellipseMode(sketch.CORNER)
  sketch.textAlign(sketch.CENTER)
  let startpunt = new Punt(20, 300, sketch)

  const hoekpunt1 = new Punt(startpunt.x, startpunt.y, sketch)
  const hoekpunt2 = new Punt(300, 320, sketch)
  const hoekpunt3 = new Punt(250, 20, sketch)
  const hoekpunt4 = new Punt(70, 10, sketch)
  const hoekpunt5 = new Punt(10, 120, sketch)

  config.hoekpunten = [hoekpunt1, hoekpunt2, hoekpunt3, hoekpunt4, hoekpunt5]

  const a = new Speler(startpunt.x, startpunt.y, sketch, config, "A", 4, 'blue')
  const b = new Speler(startpunt.x, startpunt.y, sketch, config, "A'", 3, 'lightblue', true)
  const c = new Speler(startpunt.x, startpunt.y, sketch, config, "B", 2, 'green')
  const d = new Speler(startpunt.x, startpunt.y, sketch, config, "B'", 1, 'lightgreen', true)

  config.spelers = [a, b, c, d]
  sketch.createCanvas(400, 400)
}

function keyPressed(sketch){
  if (sketch.key == ' '){ //this means space bar, since it is a space inside of the single quotes 
    console.log('space ingedrukt')
    config.verplaatsBallen = !config.verplaatsBallen
  }  
}
function mousePressed(sketch) {
  console.log('mouse pressed')
  window.pause = !window.pause
  window.pause ? sketch.loop() : sketch.noLoop()
}

function draw(sketch) {
  sketch.background('gray')
  config.hoekpunten.forEach((hoekpunt, index) => {
    hoekpunt.teken()
    const volgendeIndex = (index+1)%config.hoekpunten.length
    sketch.stroke(lijnkleur)
    const volgendeHoekpunt = config.hoekpunten[volgendeIndex]
    sketch.line(hoekpunt.x, hoekpunt.y, volgendeHoekpunt.x, volgendeHoekpunt.y)
  })
  config.spelers.forEach(speler => {
    speler.step()
    speler.teken()
  })

  // sketch.grid()
  // sketch.mousePos()
}

const TEMPOS = {
  STANDARD: 1,
  RUSTIG: 0.6,
  DUUR: 0.8,
  VLOT: 1.2
}

const sketch = (s) => {
  s.setup = () => setup(s)
  s.draw = () => draw(s)
  s.keyPressed = () => keyPressed(s)
  s.mousePressed = () => mousePressed(s)
}

const sketchInstance = new p5(sketch, '#sketch')
