import { Application, Container, Graphics, Assets, Sprite } from 'pixi.js'
import { Case } from './core/Case'


export class PixiCase extends Case {

    declare app: Application

    override async create() {
        const { view, width, height } = this
        const app = new Application()
        const canvas = document.createElement('canvas')
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        view.appendChild(canvas)
        await app.init({ backgroundColor: '#f2f2f2', canvas, width, height, resolution: devicePixelRatio, resizeTo: view })

        // must
        this.app = app
        this.canvas = canvas
        await this.createContent()
        app.ticker.addOnce(() => this.firstPaintEnd())
    }

    // set

    override setAppScale(scale: number, x: number, y: number): void {
        this.app.stage.scale = scale
        this.setAppPosition(x, y)
    }

    override setAppPosition(x: number, y: number): void {
        this.app.stage.x = x
        this.app.stage.y = y
    }

    override setElementScale(element: Graphics, scale: number, x?: number, y?: number): void {
        element.scale = scale
        if (x !== undefined && y !== undefined) this.setElementPosition(element, x, y)
    }

    override setElementPosition(element: Graphics, x: number, y: number): void {
        element.x = x
        element.y = y
    }

    // get

    override updateElements(): void {
        this.elements = this.app.stage.children
    }

    override updateDragElements(): void {
        const list = this.flatChildren ? this.app.stage.children : this.app.stage.children[0].children
        this.dragElement = list[0]
        this.dragPoint.y = -5
        for (let i = 0; i < this.maxDragElements; i++) {
            this.dragElements.push(list[i])
        }
    }

    // create

    override createRects(): void {
        const view = this.app.stage
        const { tenThousand, thousand, size, column, x, y } = this.getCreateLayout()

        let group, startX: number, startY: number, color: string, lastThousand: number

        for (var i = 0; i < tenThousand; i++) {

            startX = x + size * (i % column)
            startY = y + size * Math.floor(i / column)
            color = this.getRotationColor(i * 3)
            lastThousand = i === tenThousand - 1 ? thousand : 0

            if (this.flatChildren) {
                this.createBlock(view, startX, startY, color, lastThousand)
            } else {
                group = new Container()
                group.x = startX
                group.y = startY
                group.eventMode = 'dynamic'
                view.addChild(group)
                this.createBlock(group, 0, 0, color, lastThousand)
            }

        }
    }

    protected createBlock(group: Container, startX: number, startY: number, hsl: string, thousand: number): void {
        let y, g: Graphics, yCount = thousand ? thousand * 10 : 100
        for (let i = 0; i < 100; i++) {  // ten thousand
            if (i % 10 === 0) startX += 10
            y = startY
            for (var j = 0; j < yCount; j++) {
                if (j % 10 === 0) y += 10
                g = new Graphics()
                g.x = startX
                g.y = y
                g.rect(0, 0, 10, 10)
                g.fill(hsl)
                g.eventMode = 'dynamic'
                group.addChild(g)
                y += 12
            }
            startX += 12
        }
    }

    override async createLargeImage() {
        const view = this.app.stage
        const texture = await Assets.load(this.imageConfig.largeImageUrl)
        const sprite = new Sprite(texture)
        view.addChild(sprite)
    }

}