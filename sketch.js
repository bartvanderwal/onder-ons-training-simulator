// import '/node_modules/p5/lib/p5.min.js'
import "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.5.0/p5.js"
// Gebruiken van ES modules in P5: https://www.youtube.com/watch?v=P0bkwncSJag
import { Punt } from './Punt.js'
import { Sporter } from './Sporter.js'

const config = {
  sporters: [],
  hoekpunten: [],
  verplaatsBallen: true,
  stepNr: 0,
  logIteration: 10000,
  draggedHoekpunt: null,
  defaultLijnkleur: 'darkgray'
}

function setup(sketch) {
  // sketch.ellipseMode(sketch.CORNER)
  sketch.createCanvas(400, 400)
  sketch.textAlign(sketch.CENTER)
  sketch.config = config

  let startpunt = new Punt(40, 300, sketch)
  config.startpunt = startpunt
  const hoekpunt1 = new Punt(320, 340, sketch)
  const hoekpunt2 = new Punt(300, 40, sketch)
  const hoekpunt3 = new Punt(90, 30, sketch)
  const hoekpunt4 = new Punt(30, 210, sketch)

  const pauseButton = sketch.createButton('Pauze');
  pauseButton.position(sketch.width2, sketch.height);
  pauseButton.mousePressed(pause);

  config.hoekpunten = [startpunt, hoekpunt1, hoekpunt2, hoekpunt3, hoekpunt4]

  const a = new Sporter(startpunt.x, startpunt.y, sketch, "Donald", 0.9, TEMPOS.DUUR, 'red')
  const b = new Sporter(startpunt.x, startpunt.y, sketch, "Katrien", 1.1, TEMPOS.VLOT, 'darkred', true, a)
  const c = new Sporter(startpunt.x, startpunt.y, sketch, "Kwik", 1.5, TEMPOS.DUUR, 'gray')
  const d = new Sporter(startpunt.x, startpunt.y, sketch, "Kwek", 1.2, TEMPOS.VLOT, 'lightgray', true, c)

  config.sporters = [a, b, c, d]
}

function pause() {
  config.verplaatsBallen = !config.verplaatsBallen
}

function keyPressed(sketch){
  // This means space bar, since it is a space inside of the single quotes.
  if (sketch.key == ' '){ 
    pause()
  }  
}
function mousePressed(sketch) {
  console.log('mouse pressed')
  const muisklikpunt = new Punt(sketch.mouseX, sketch.mouseY)
  config.hoekpunten.forEach(hoekpunt => {
    if (hoekpunt.isBij(muisklikpunt)) {
      config.draggedHoekpunt = hoekpunt
      console.log(`je dragt nu hoekpunt '${hoekpunt.naam}'.` )
    }

  })
  
  // window.pause = !window.pause
  // window.pause ? sketch.loop() : sketch.noLoop()
}

function mouseReleased(sketch) {
  if (config.draggedHoekpunt) {
    console.log(`Je bent gestopt met draggen hoekpunt '${hoekpunt.naam}'.` )
    config.draggedHoekpunt = null
  }
}

function mouseDragged(sketch) {
  if (config.draggedHoekpunt) {
    config.draggedHoekpunt.x = sketch.mouseX
    config.draggedHoekpunt.y = sketch.mouseY
  }
}

function draw(sketch) {
  sketch.background('green')
  config.hoekpunten.forEach((hoekpunt) => {
    hoekpunt.teken()
  })
  config.hoekpunten.forEach((hoekpunt, index) => {
    const volgendeIndex = (index+1)%config.hoekpunten.length
    const volgendeHoekpunt = config.hoekpunten[volgendeIndex]
    sketch.stroke(config.defaultLijnkleur)
    sketch.line(hoekpunt.x, hoekpunt.y, volgendeHoekpunt.x, volgendeHoekpunt.y)
  })
  config.sporters.forEach(sporter => {
    sporter.step()
    sporter.teken()
  })
}

const TEMPOS = {
  STANDARD: 1,
  RUSTIG: 0.6,
  DUUR: 0.8,
  VLOT: 1.2
}

// Initialiseren sketch, omdat we geen 'global mode' gebruiken.
// Zie bv.: https://p5js.org/examples/instance-mode-instantiation.html
const sketch = (s) => {
  s.setup = () => setup(s)
  s.draw = () => draw(s)
  s.keyPressed = () => keyPressed(s)
  s.mousePressed = () => mousePressed(s)
  s.mouseDragged = () => mouseDragged(s)
  s.mouseReleased = () => mouseReleased(s)
}

const sketchInstance = new p5(sketch, '#sketch')
