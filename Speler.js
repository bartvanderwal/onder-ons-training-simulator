import { Punt } from './Punt.js'

export class Speler extends Punt {  
    constructor(x, y, sketch, config, naam = '', snelheid = 0, color = 'black') {
      super(x, y, sketch, naam)
      this.xDelta = 0
      this.yDelta = 0
      this.config = config 
      this.doel = 1
      this.color = color
      this.straal = 20
      this.naam = naam
      this.snelheid = snelheid
      this._partner = null
      this.bepaalHoekNaarDoel()
    }
    set partner(val) {
      this._partner = val
    }
    get partner() {
      return this._partner
    }
    get snelheidVlot() {
      return snelheid * TEMPO.VLOT
    }
    get snelheidDuur() {
      return snelheid * TEMPO.DUUR
    }
    get snelheidRustig() {
      return snelheid * TEMPO.RUSTIG
    }
    
    step() {
      if (this.config.verplaatsBallen) {
        stepNr++
        this.bepaalDoel()
        this.stapNaarDoel()
      }
    }
    
    bepaalDoel() {
      // Als speler op huidige doel is aangekiomen, pak dan het volgende doel
      const isBijDoel = this.isBij(this.doelPunt())
      if (isBijDoel) {
          this.doel = (this.doel+1)%this.config.hoekpunten.length
          this.bepaalHoekNaarDoel()
      }
    }
    
    isBij(punt) {
      const result = (Math.round(this.x)-Math.round(punt.x))<this.xDelta 
          && (Math.round(this.y)-Math.round(punt.y))<this.yDelta
      if (result) {
        console.log(`Speler '${this.naam}' isbij punt '${punt.naam}' (this: ${this}, punt: ${punt}: ${result})`)
      } else {
        // console.log(`Equals tussen '${this.naam}' en '${anderPunt.naam}' NIET waar (this: ${this}, anderPunt: ${anderPunt}: ${result})`)
      }
      return result
    }

    doelPunt() {
      return this.config.hoekpunten[this.doel]
    }

    bepaalHoekNaarDoel() {
      this.hoek = Math.atan((this.doelPunt().x-this.x)/(this.y-this.doelPunt().y))
      this.xDelta = Math.sin(this.hoek)*this.snelheid
      this.yDelta = Math.cos(this.hoek)*this.snelheid
      console.log(`Doel van punt ${this.naam} is nu: ${this.doel} en hoek: ${this.hoek}! Δx, Δy: ${this.xDelta},${this.yDelta}`)
    }
    
    stapNaarDoel() {
      // Beweeg afhankelijk van de snelheid (totale snelheid Vt is combi Vx en Vy.
      // Pythagaros, c=√(a²+b²), en Vy=sin(hoek)*Vt en Vx=cos(hoek)*Vt
      // this.x += this.xDelta
      // this.y -= this.yDelta

      if (this.x>this.doelPunt().x) {
         this.x += this.xDelta
      } else {
        this.x += this.xDelta
      }
      if (this.y>this.doelPunt().y) {
        this.y -= this.yDelta
      } else {
        this.y += this.yDelta
      }
    }
  }