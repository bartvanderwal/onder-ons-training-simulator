import { Punt } from './Punt.js'

export class Sporter extends Punt {  
    constructor(x, y, sketch, naam = '', basisSnelheid = 0, tempo = TEMPOS.BASIS, kleur = 'black', looptTegengesteld = false, partner = null) {
      super(x, y, sketch, naam)
      this.xDelta = 0
      this.yDelta = 0
      this.sketch = sketch
      this.config = this.sketch.config
      this.kleur = kleur
      this.straal = 20
      this.naam = naam
      this.basisSnelheid = basisSnelheid
      this.tempo = tempo
      this.looptTegengesteld = looptTegengesteld
      if (this.looptTegengesteld) {
        this.doel = this.aantalHoekpunten()-1
      } else {
        this.doel = 1
      }
      this.partner = partner
      this.hoekpuntenGepasseerd = 1;
      this.huidigeRonde = 1;
      this.bepaalHoekEnDelta()
    }
    get snelheidBasis() {
      return this.basisSnelheid
    }
    get snelheid() {
      return this.basisSnelheid * this.tempo;
    }
    
    step() {
      if (this.config.verplaatsBallen) {
        this.config.stepNr++
        this.bepaalDoel()
        this.stapNaarDoel()
      }
    }
    
    aantalHoekpunten() {
      return this.config.hoekpunten.length
    }

    bepaalDoel() {
      // Als sporter partner heeft en bij deze partner komt (e.g. niet net start), keer dan (beiden) om en wissel van tempo.
      const isBijPartner = this.partner && this.isBijSporter(this.partner)
      if (isBijPartner && (!this.isBij(this.config.startpunt))) {        
        // console.log(`Wissel '${this.naam}' met partner '${this.partner.naam}'`)
        this.looptTegengesteld = !this.looptTegengesteld
        this.partner.looptTegengesteld = !this.partner.looptTegengesteld;

        // Swap tempo's en doelen (gebruikmakend van EcmaScript 'destructuring' voor variable value swap: https://dmitripavlutin.com/swap-variables-javascript/#1-destructuring-assignment)
        [this.tempo, this.partner.tempo] = [this.partner.tempo, this.tempo];
        [this.doel, this.partner.doel] = [this.partner.doel, this.doel];
        this.bepaalHoekEnDelta()
        this.partner.bepaalHoekEnDelta()
        // console.log(`Wissel '${this.naam}' en '${this.partner.naam}' voltooid!
        //    \n\tSporter na: ${this}
        //    \n\tPartner na: ${this.partner}`)

        // Doe beiden extra stap (in nieuwe richting) na botsing,
        // om probleem met evt. direct weer botsen te voorkomen
        this.stapNaarDoel()
        this.partner.stapNaarDoel()
      }

      // Als sporter op huidige doel is aangekomen, pak dan het volgende doel.
      const isBijDoel = this.isBij(this.doelPunt())
      if (isBijDoel) {
        if (this.isBij(this.config.startpunt)) {
          this.huidigeRonde++
        }
        this.doel = this.volgendeDoel()
        this.bepaalHoekEnDelta()
      }
    }

    /** TODO: Niet meer 'volgende' doel */
    volgendeDoel() {
      this.hoekpuntenGepasseerd++;
      return this.looptTegengesteld ?
        (this.doel > 0 ? this.doel-1 : this.aantalHoekpunten()-1)
      : (this.doel < this.aantalHoekpunten()-1 ? this.doel+1 : 0)
    }

    isBijSporter(sporter) {
      // TODO: Switchen naar TypeScript voor meer type safety en compile time errors i.p.v. runtime errors.
      return this.isBij(sporter) || sporter.isBij(this);
    }
    
    isBij(punt) {
      // TODO Performance: Gevoeligheid kun je i.p.v. telkens ook éénmaal uitrekenen op het moment (e.g. de plek in code) dat xDelta en yDelta worden uitgerekend.
      const gevoeligheid = 5 // Math.min(this.yDelta, this.xDelta)
      return super.isBij(punt, gevoeligheid)
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
      // console.log(
      //    `Doel van sporter '${this.naam}' is nu: ${this.doel} (hoek: ${this.hoek}, 
      //    Δx: ${Math.round(this.xDelta)}, Δy: ${Math.round(this.yDelta)})`)
    }
    
    stapNaarDoel() {
      // TODO: Mogelijke bug oplossen: De richting bepalen moet tijdens bepaalHoekEnDelta gebeuren en alleen de stap zetten hier.
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

    TEMPOS = {
      BASIS: 1,
      RUSTIG: 0.6,
      DUUR: 0.8,
      VLOT: 1.2
    }

    toString() {
      return `${super.toString()} , doel: ${this.doel}, tempo: ${this.tempo}, tegengesteld?: ${this.looptTegengesteld}, partner.naam: ${this.partner ? this.partner.naam : '-'}, huidigeRonde: ${this.huidigeRonde}, hoek: ${this.hoek}, Δx: ${this.xDelta}, Δy: ${this.yDelta}.` 
    }

  }