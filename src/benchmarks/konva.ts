import Konva from 'konva'
import { Case } from './core/Case'


const { Stage, Layer, Group, Rect, Image } = Konva

const data = {
    x: 0,
    y: 0,
    height: 10,
    width: 10,
    fill: 'red',
    draggable: true,
}

export class KonvaCase extends Case {

    override async create() {
        const { width, height } = this
        const app = new Stage({ container: this.config.id, width, height })
        const layer = new Layer()
        app.add(layer)

        // must
        this.app = app
        this.canvas = layer.canvas._canvas
        await this.createContent()
        const fn = () => {
            this.firstPaintEnd()
            layer.off('draw', fn)
        }
        layer.on('draw', fn)
    }

    // set

    override setAppScale(scale: number, x: number, y: number): void {
        this.app.scaleX(scale)
        this.app.scaleY(scale)
        this.setAppPosition(x, y)
    }

    override setAppPosition(x: number, y: number): void {
        this.app.x(x)
        this.app.y(y)
    }

    override setElementScale(element: any, scale: number, x?: number, y?: number): void {
        element.scaleX(scale)
        element.scaleY(scale)
        if (x !== undefined && y !== undefined) this.setElementPosition(element, x, y)
    }

    override setElementPosition(element: any, x: number, y: number): void {
        element.x(x)
        element.y(y)
    }

    // get

    override updateElements(): void {
        this.elements = this.app.children[0].children
    }

    override updateDragElements(): void {
        const list = this.flatChildren ? this.app.children[0].children : this.app.children[0].children[0].children
        this.dragElement = list[0]
        this.dragPoint.y = -5
        for (let i = 0; i < this.maxDragElements; i++) {
            this.dragElements.push(list[i])
        }
    }

    // create

    override createRects(): void {
        const view = this.app.children[0]
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
                group.x(startX)
                group.y(startY)
                view.add(group)
                this.createBlock(group, 0, 0, color, lastThousand)
            }

        }
    }

    protected createBlock(group: any, startX: number, startY: number, hsl: string, thousand: number): void {
        let y, rect, yCount = thousand ? thousand * 10 : 100
        for (let i = 0; i < 100; i++) { // ten thousand
            if (i % 10 === 0) startX += 10
            y = startY
            for (var j = 0; j < yCount; j++) {
                if (j % 10 === 0) y += 10
                data.x = startX
                data.y = y
                data.fill = hsl
                rect = new Rect(data)
                group.add(rect)
                y += 12
            }
            startX += 12
        }
    }

    override async createLargeImage() {
        await new Promise((resolve) => {

            const view = this.app.children[0]
            Image.fromURL(this.imageConfig.largeImageUrl, function (image) {
                view.add(image)
                resolve(true)
            })

        })
    }

}