import { Leafer, Group, Rect, Image, RenderEvent, ImageEvent } from 'leafer-ui'
import { Case } from './core/Case'


export class LeaferCase extends Case {

    declare app: Leafer

    override async create() {
        const { view, dynamicMode } = this
        const app = new Leafer({ view, usePartLayout: !dynamicMode, usePartRender: !dynamicMode })

        // must
        this.app = app
        this.canvas = app.canvas.view
        await this.createContent()
        app.once(RenderEvent.END, () => this.firstPaintEnd())
    }

    // set

    override setAppScale(scale: number, x: number, y: number): void {
        this.app.scale = scale
        this.setAppPosition(x, y)
    }

    override setAppPosition(x: number, y: number): void {
        this.app.x = x
        this.app.y = y
    }

    override setElementScale(element: Rect, scale: number, x?: number, y?: number): void {
        element.scale = scale
        if (x !== undefined && y !== undefined) this.setElementPosition(element, x, y)
    }

    override setElementPosition(element: Rect, x: number, y: number): void {
        element.x = x
        element.y = y
    }

    // get

    override updateElements(): void {
        this.elements = this.app.children
    }

    override updateDragElements(): void {
        const list = this.flatChildren ? this.app.children : this.app.children[0].children as Rect[]
        this.dragElement = list[0]
        this.dragPoint.y = -5
        for (let i = 0; i < this.maxDragElements; i++) {
            this.dragElements.push(list[i])
        }
    }

    // create

    override createRects(): void {
        const view = this.app
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
                group = new Group()
                group.x = startX
                group.y = startY
                view.add(group)
                this.createBlock(group, 0, 0, color, lastThousand)
            }

        }
    }

    protected createBlock(group: Group, startX: number, startY: number, hsl: string, thousand: number): void {
        let y, rect, yCount = thousand ? thousand * 10 : 100
        for (let i = 0; i < 100; i++) { // ten thousand
            if (i % 10 === 0) startX += 10
            y = startY
            for (var j = 0; j < yCount; j++) {
                if (j % 10 === 0) y += 10
                rect = new Rect(null)
                rect.x = startX
                rect.y = y
                rect.height = 10
                rect.width = 10
                rect.fill = hsl
                rect.draggable = true
                group.add(rect)
                y += 12
            }
            startX += 12
        }
    }

    override async createLargeImage() {
        await new Promise((resolve) => {

            const view = this.app
            const image = new Image({
                url: this.imageConfig.largeImageUrl,
            })
            view.add(image)

            image.once(ImageEvent.LOADED, () => resolve(true))

        })
    }

}