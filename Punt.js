export class Punt {
    static aantalPunten = 0
    static lineHeight = 20

    constructor(x, y, sketch, naam = '') {
      this.straal = 30
      this.kleur = 'lightpurple'
      this.x = x
      this.y = y
      this.sketch = sketch
      if (naam==='') {
        this.naam = '' + Punt.aantalPunten
        Punt.aantalPunten++
      } else {
        this.naam = naam
      }
    }

    roundX() {
      return Math.round(this.x)
    }

    roundY() {
      return Math.round(this.y)
    }

    teken() {
      if (this.sketch.config.stepNr%this.sketch.config.logIteration===0) {
        console.log('teken (', this.roundX(), ', ', this.roundY(), ')', 
            'straal: ', this.straal, 'kleur: ', this.kleur)
      }
      this.sketch.stroke(this.kleur)
      this.sketch.fill(this.kleur)
      this.sketch.circle(this.roundX(), this.roundY(), this.straal)
      if (this.naam) {
        this.sketch.stroke('black')
        this.sketch.fill('black')
        this.sketch.text(this.naam, this.x, this.y)
        if (this.doel!==undefined) {
          // this.sketch.text(`(${this.roundX()}, ${this.roundY()})`, this.roundX(), this.roundY()+Punt.lineHeight)
          // this.sketch.text(`doel: ${this.doel}, v: ${this.snelheid}, pace: ${this.tempo}`, this.roundX(), this.roundY()+2*Punt.lineHeight)
          // this.sketch.text(`v: ${this.snelheid}`, this.roundX(), this.roundY()+3*Punt.lineHeight)
          // this.sketch.text(`pace: ${this.tempo}`, this.roundX(), this.roundY()+4*Punt.lineHeight)
        }
      }
    }

    isBij(punt, gevoeligheid = 2) {
      return Math.abs(Math.round(this.x)-Math.round(punt.x))<Math.abs(gevoeligheid)
          && Math.abs(Math.round(this.y)-Math.round(punt.y))<Math.abs(gevoeligheid)
    }
     
    toString() {
      return `naam: ${this.naam}, x: ${this.roundX()}, y: ${this.roundY()}`
    }

}
