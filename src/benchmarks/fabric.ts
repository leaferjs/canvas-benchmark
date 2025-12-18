import { Canvas, Point, Rect, FabricImage } from 'fabric'
import { Case } from './core/Case'


export class FabricCase extends Case {

    declare app: Canvas

    override async create() {
        const { view, width, height } = this
        const canvas = document.createElement('canvas')
        view.appendChild(canvas)
        const app = new Canvas(canvas, { width, height })

        // must
        this.app = app
        this.canvas = canvas
        await this.createContent()
        app.once('after:render', () => this.firstPaintEnd())
    }

    // set

    override setAppScale(scale: number, x: number, y: number): void {
        this.app.setZoom(scale)
        this.setAppPosition(x, y)
    }

    override setAppPosition(x: number, y: number): void {
        this.app.absolutePan(new Point(x, y))
    }

    override setElementScale(element: Rect, scale: number, x?: number, y?: number): void {
        element.set({
            scaleX: scale,
            scaleY: scale
        })
        if (x !== undefined && y !== undefined) this.setElementPosition(element, x, y)
    }

    override setElementPosition(element: Rect, x: number, y: number): void {
        element.set({
            left: x,
            top: y
        })
        this.app.requestRenderAll()
    }

    // get

    override updateElements(): void {
        this.elements = this.app.getObjects()
    }

    override updateDragElements(): void {
        const list = this.app.getObjects()
        this.dragElement = list[0]
        this.dragPoint.y = this.startY - 5
        for (let i = 0; i < this.maxDragElements; i++) {
            this.dragElements.push(list[i])
        }
    }

    // create

    override createRects(): void {
        const view = this.app
        const { tenThousand, thousand, size, column, x, y } = this.getCreateLayout()

        for (let i = 0; i < tenThousand; i++) {
            this.createBlock(view, x + size * (i % column), y + size * Math.floor(i / column), this.getRotationColor(i * 3), i === tenThousand - 1 ? thousand : 0)
        }
    }

    protected createBlock(group: Canvas, startX: number, startY: number, hsl: string, thousand: number): void {
        let y, rect, yCount = thousand ? thousand * 10 : 100
        for (let i = 0; i < 100; i++) { // ten thousand
            if (i % 10 === 0) startX += 10
            y = startY
            for (var j = 0; j < yCount; j++) {
                if (j % 10 === 0) y += 10
                rect = new Rect()
                rect.left = startX
                rect.top = y
                rect.height = 10
                rect.width = 10
                rect.fill = hsl
                group.add(rect)
                y += 12
            }
            startX += 12
        }
    }

    override async createLargeImage() {
        await new Promise((resolve) => {

            const view = this.app
            FabricImage.fromURL(this.imageConfig.largeImageUrl).then(image => {
                view.add(image)
                resolve(true)
            })

        })
    }

}