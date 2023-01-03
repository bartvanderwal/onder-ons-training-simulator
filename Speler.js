import { Punt } from './Punt.js'

export class Speler extends Punt {  
    constructor(x, y, sketch, config, naam = '', snelheid = 0, kleur = 'black', looptTegengesteld = false) {
      super(x, y, sketch, naam)
      this.xDelta = 0
      this.yDelta = 0
      this.config = config 
      this.kleur = kleur
      this.straal = 20
      this.naam = naam
      this.snelheid = snelheid
      this.looptTegengesteld = looptTegengesteld
      if (this.looptTegengesteld) {
        this.doel = this.aantalHoekpunten()-1
      } else {
        this.doel = 1
      }
      this._partner = null
      this.hoekpuntenGepasseerd = 1;
      this.bepaalHoekEnDelta()
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
    
    aantalHoekpunten() {
      return this.config.hoekpunten.length
    }

    bepaalDoel() {
      // Als speler op huidige doel is aangekiomen, pak dan het volgende doel
      const isBijDoel = this.isBij(this.doelPunt())
      if (isBijDoel) {
        this.hoekpuntenGepasseerd++;
        if (this.looptTegengesteld) {
          this.doel = Speler.modulo(this.aantalHoekpunten()-this.hoekpuntenGepasseerd, this.aantalHoekpunten())
        } else {
          this.doel = Speler.modulo(this.hoekpuntenGepasseerd, this.aantalHoekpunten())
        }
        this.bepaalHoekEnDelta()
      }
    }

    // TODO Add to Math
    static modulo(n, d) {
      // Bron: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder#description
      const result = ((n % d) + d) % d
      return result
    }

    isBij(punt) {
      const result = Math.abs(Math.round(this.x)-Math.round(punt.x))<Math.abs(this.xDelta)
          && Math.abs(Math.round(this.y)-Math.round(punt.y))<Math.abs(this.yDelta)
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

    bepaalHoekEnDelta() {
      this.hoek = Math.atan((this.doelPunt().x-this.x)/(this.y-this.doelPunt().y))

      // Beweeg afhankelijk van de snelheid (totale snelheid Vt is combi Vx en Vy.
      // Pythagaros, c=√(a²+b²), en Vy=sin(hoek)*Vt en Vx=cos(hoek)*Vt
      // this.x += this.xDelta
      // this.y -= this.yDelta
      this.xDelta = Math.sin(this.hoek)*this.snelheid
      this.yDelta = Math.cos(this.hoek)*this.snelheid
      console.log(
          `Doel van punt ${this.naam} is nu: ${this.doel} en hoek: ${this.hoek}!
          Δx: ${Math.round(this.xDelta)}, Δy: ${Math.round(this.yDelta)}`)
    }
    
    stapNaarDoel() {
      if (this.x>this.doelPunt().x) {     // A. Doel ligt links
        if (this.y>this.doelPunt().y) {   // A1. Doel ligt linksboven
          this.richting = 'linksboven'
          this.x += this.xDelta           
          this.y -= this.yDelta               
        } else {                          // A2. Doel ligt linksonder
          this.richting = 'linksonder'
          this.x -= this.xDelta
          this.y += this.yDelta
        }
      } else {                            // B. Doel ligt rechts
        if (this.y>this.doelPunt().y) {   // B1. Doel ligt rechtsboven
          this.richting = 'rechtsboven'
          this.x += this.xDelta
          this.y -= this.yDelta
        } else {
          this.richting = 'rechtsonder'
          this.x -= this.xDelta           // B2. Doel ligt rechtsonder
          this.y += this.yDelta
        }
        // console.log(`Richting ${this.naam} naar doel '{$this.doel}': ${this.richting}`)
        }
    }
  }