export class Punt {
    static aantalPunten = 0
    static lineHeight = 20

    constructor(x, y, sketch, naam = '') {
      this.straal = 30
      this.kleur = 'purple'
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
      if (window.stepNr%window.logIter===0) {
        console.log('teken (', this.roundX(), ', ', this.roundY(), ')', 
            'straal: ', this.straal, 'kleur: ', this.kleur)
      }
      this.sketch.stroke(this.kleur)
      this.sketch.fill(this.kleur)
      this.sketch.circle(this.roundX(), this.roundY(), this.straal)
      if (this.naam) {
        this.sketch.stroke('black')
        this.sketch.text(this.naam, this.x, this.y)
        if (this.doel) {
          this.sketch.text(`(x, y): (${this.roundX()}, ${this.roundY()})`, this.roundX(), this.roundY()+Punt.lineHeight)
          this.sketch.text(`, doel: ${this.doel}`, this.roundX(), this.roundY()+2*Punt.lineHeight)
        }
      }
    }
     
    toString() {
      return `x: ${this.roundX()}, y: ${this.roundY()}, naam: ${this.naam}`
    }

    TEMPOS = {
        STANDARD: 1,
        RUSTIG: 0.6,
        DUUR: 0.8,
        VLOT: 1.2
    }
}
