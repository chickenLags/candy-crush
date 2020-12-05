const Entity = require("./Entities/Entity");
const Vector = require("./Vector");

class EntityManager {

    constructor() {
        this.entities = [];
        this.hoveringEntities = [];
    }

    add(entity) {
        if( ! (entity instanceof Entity) ) {
            return;
        }

        this.entities.push(entity);
    }

    remove(entity) {

    }

    clear() {
        this.entities = [];
        this.hoveringEntities = [];
    }

    getEntitiesHovered(mouseEvent) {
        return this.entities.filter( entity => entity.pointWithin(new Vector(mouseEvent.offsetX, mouseEvent.offsetY)));
    }

    onMouseDown(mouseEvent) {
        this.entities.forEach(element => element.onMouseDown(mouseEvent));
    }

    onMouseUp(mouseEvent) {
        this.entities.forEach(element => element.onMouseUp(mouseEvent));
    }

    onMouseClick(mousePoint) {
        this.entities.forEach(e => e.inputClick(mousePoint));
    }

    input(mouseEvents) {
        let mouseIndex = 0;
        let mouseLength = mouseEvents.length;

        let entityIndex = 0;
        let entityLength = this.entities.length;

        for(mouseIndex; mouseIndex < mouseLength; ++mouseIndex) {
            for(entityIndex; entityIndex < entityLength; ++entityIndex) {
                this.entities[entityIndex].input(mouseEvents[mouseIndex]);
            }
        }
    }

    manageHover(mouseEvent) {
        let currentlyHovered = this.getEntitiesHovered(mouseEvent);

        this.hoveringEntities
            .filter(e => !currentlyHovered.includes(e))
            .forEach(e => e.onMouseLeave());

        currentlyHovered
            .filter(e => !this.hoveringEntities.includes(e))
            .forEach(e => e.onMouseEnter());

        this.hoveringEntities = currentlyHovered;
    }

    render(ctx) {
        let renderables = this.entities;
        renderables.forEach(entity => entity.render(ctx));
    }

    update(elapsed) {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(elapsed);
        }

    }

    checkCollisions(subjectEntity, ctx) {
        this.entities.forEach(entity => {
            if (entity.collidable == true) {
                if (subjectEntity.isColliding(entity, ctx) == true) {
                    subjectEntity.collided = true;
                    subjectEntity.fillColor = "#ff0000"
                    return true;
                }
            }
        })

        return false;
    }
}

module.exports = new EntityManager();
