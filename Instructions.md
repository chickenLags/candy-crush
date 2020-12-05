# Candy crush
In de repository zit de opzet voor het candy crush spel, maar de spellogica en animatie logica ontbreekt. De taak in van 
deze challenge is dit te implementeren. 

## Quick Start
### Getting started
1. Gooi de node_modules map weg
1. Om het project te runnen moet eerst `npm i` gerund worden.  
1. Het project kan worden gebouwt met het command `npm run build` en kan worden gewatched met het `npm run watch`.
1. De pagina kan worden geopend met `open index.html`  
1. Het startpunt is game/main.js

### Game
In de game folder zitten de classen die specifiek zijn voor candy crush. Hier zal het meeste van je code komen te staan. 
Er zijn nog twee mappen aanwezig in deze map namelijk `scenes` en `objects`.

#### Scenes
- De splashscreen - stelt het eerste menu voor.
- De game - stelt het scherm voor waarop gespeeld wordt. 

#### Objecten
- gridholder - houdt de positie van de grid bij en tekent ook de achtergrond.
- CandyGrid - houdt het grid object bij en logica die eraan gerelateerd is. Dit is een child van GridHolder.
- Candy - is de candy die je op het scherm ziet. De candies worden bewaard in de CandyGrid.
- Selector - is de selector op de geslecteerde candy.

### How to Candy Crush
- https://nl.wikihow.com/Candy-Crush-Saga-spelen 
- https://candycrush-cheats.com/candy-crush-basics/
- punten: https://candycrush.fandom.com/wiki/Score

## Challenge
De logica voor het verwisselen van de snoepjes zit er al in. Die kan je vinden in game/objects/CandyGrid.js onder inputClick(). 
Het daadwerkelijke verwisselen wordt gedaan in update() van game/objects/Candy.js

1. implementeer snoepjes slepen.
1. Logica voor alleen directe buur wisselen
1. Animatie wisselen (overslaan als je er niet uitkomt)
1. Logica voor herkennen 3+ op een rij
1. geef error geluid en voorkom de actie wanneer actie niet mag. 
1. Logica voor verwijderen snoepjes
1. Logica voor “vallen” snoepjes (willekeurig)
1. Grid aanvullen met nieuwe snoepjes
1. Laat geselecteerde snoepje animeren -> het snoepje wordt iets groter en kleiner over tijd.  

### Geluid
- implementeer achtergrond muziek. te vinden in de music folder. zie: https://candycrush.fandom.com/wiki/Music 
- poppend geluid voor bewegen en verwijderen snoepjes. Te vinden in de sounds folder. zie: https://candycrush.fandom.com/wiki/Sound 
- start level en andere geluiden. Te vinden in sounds folder, zie: https://candycrush.fandom.com/wiki/Sound
- https://www.youtube.com/watch?v=d5Rf0An-jEg

### Score bijhouden
1. nadat je op start drukt en nog geen username hebt mag je een username invullen. (die je onthoud in een sessie, localstorage of anders)
1. Hou de punten bij en weergeef het op de pagina, links van de candy grid. 
1. laat punten zien zodra je een combo gemaakt hebt op het scherm. zie sectie "how to candy crush"
1. Gebruik bijv de local storage en laat de resultaten zien op een highscore board.
1. Maak highscore pagina 
1. link naar de highscore pagina op de splash screen

### Endgame
1. herken dat er geen combos meer over zijn.
1. voorkom verdere handelingen op het speelveld.
1. maak een popup die je punten weergeeft
1. voeg de knoppen "opnieuw", "doorspelen" of "hoofdmenu" op de popup
1. als een speler idle is laat dan een mogelijke combo oplichten.

### Menu
candy crush heeft een menu links van de candy grid die lijkt op een banner. maak die na. 
1. plaats de banner en hou de score daarop bij. 
1. implementeer een progres bar met een sterren die behaald kunnen worden. de max punten mogen willekeurig zijn.
1. implementeer logica die het level afsluit zodra het maximum behaald is en een nieuwe game genereert. 
1. implementeer een back button + optioneel een confirmatie modal

### Powers
1. implementeer de vis snoep - vliegt naar een random snoepje 
1. gestreepte snoep (afhankelijk hoe je die maakt) - haalt alle snoepjes weg in een verticale lijn 
1. snoep in zakje - haalt snoepjes weg in een 3x3 omtrek.
1. de chocolade snoep - haalt het hele speelveld leeg.

### Touch
1. Implementeer touch - tapping 
1. implementeer touch - slepen van snoepjes.

### Resizable
Zorg ervoor dat het scherm responsive is voor resizes.

### Animatie 
1. idle animatie voor candies
1. Explosie animatie op de snoepjes afspelen.
1. Explosie voor speciale snoepjes die een rij weghalen.
1. de bliksem animatie voor de 5 op een rij snoepjes.

### Bonus challenge 
1. Gebruik de geadvanceerde spritesheet en implementeer o.a. de gummy bear. 
1. implementeer een max aantal moves + in menu bar de overgebleven moves.
1. laat het spel zichzelf spelen


## Over het project
### Html, css, js, browserify
De HTML bevat een canvas waarop getekend wordt met Javascript. Daarnaast is er ook een css file die de afmetingen van 
de canvas aangeeft en de default margin van de body af haalt. 
In dit project hoor je HTML en CSS verder niet nodig te hebben, ook voor text niet. 

Browserify is gebruikt om het project te managen. classen moeten worden gerequired. `main.js` is het startpunt van deze 
applicatie. Classes worden geimporteert door de require statement, bijv: `const InputHandler = require("../engine/classes/InputHandler.js");`.
Classen heb ik required beginnend met een hoofdletter, bijv: `InputHandler` en global instances zijn met kleine letter, 
in dit geval: `entityManager`.

### Architectuur
De game wordt gestart in de game/main.js, de game loop vind je hier. 
Een eigenschap van de game architectuur is dat er veelvuldig gebruik wordt gemaakt van objecten die zichzelf managen. 
Bijv: Een candy is dus zelf verantwoordelijk voor waar die op het scherm staat, waar die naartoe beweegt, hoe die 
reageert op input en hoe die eruit ziet. 

#### Enigine
In de engine folder zitten de basis elementen en classen die de engine draaiende houden. In principe hoef je hier niets 
aan te passen, maar het kan voorkomen.

#### Managende objecten:
- De entityManager - hieraan kunnen Entity objecten toegevoegd worden met `add()`. Op de toegevoegde objecten wordt iedere 
frame `inputClick()`, `Update()`, en `render()` aangeroepen. Verwijderen van entities kan met `remove()` en alle entities kunnen 
in een keer met `clear()` verwijderd worden. De entityManager accepteert alleen classen die inheriten van Entity.  
- De inputHandler - Luistert naar muis events en geeft dat door aan de entityManager. 

#### Overige objecten:
- Button - Een opzet voor een button is klaar. kan met `let btn = new Button(x, y, width, heigth, text)` aangeroepen worden. 
Functionaliteit toevoegen door onverschrijven: `btn.onclick = () => // onclick code;`. 
- DrawingTools - niet relevant voor dit project. 
- Entities - basisobjecten, voor dit project is mogelijk alleen de Entity class relevant. Die managed het minimale wat 
een object die aan de entitymanager toegevoegt wordt moet kunnen; positie en functies.
- Vector - een struct die een x en y variabel houdt en de operaties erop managed. in dit project wordt de vector ook als
 een point gebruikt. het verschil: https://math.stackexchange.com/questions/645672/what-is-the-difference-between-a-point-and-a-vector 
- Background - is een achtergrond. aan te maken met `let background = new Background('path/to/background.jpeg')` en wordt 
weergeven nadat het aandat het toegevoegd is aan de entity manager. `entityManager.add(background);`.

#### Assets
de voornaamste asset die gebruikt wordt in dit spel is de spritesheet te vinden in img/candies_transparent.png. 
die wordt een keer ingeladen en er worden vervolgens gedeelten ervan geshowed. Meer info:
 https://gamedevelopment.tutsplus.com/tutorials/an-introduction-to-spritesheet-animation--gamedev-13099#  