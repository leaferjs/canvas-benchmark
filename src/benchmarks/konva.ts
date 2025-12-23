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
        this.rootNode = layer
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
        this.elements = this.rootNode.children
    }

    override updateDragElements(): void {
        const list = this.flatChildren ? this.rootNode.children : this.rootNode.children[0].children
        this.dragElement = list[0]
        for (let i = 0; i < this.maxDragElements; i++) {
            this.dragElements.push(list[i])
        }
    }

    // create

    override addGroup(parent: any, x: number, y: number): any {
        const node = new Group()
        node.x(x)
        node.y(y)
        parent.add(node)
        return node
    }

    override addRect(parent: any, x: number, y: number, width: number, height: number, color: string): any {
        data.x = x
        data.y = y
        data.width = width
        data.height = height
        data.fill = color
        const node = new Rect(data)
        parent.add(node)
    }

    override addCircle(parent: any, x: number, y: number, width: number, height: number, color: string): any {
        data.x = x
        data.y = y
        data.width = width
        data.height = height
        data.fill = color
        const node = new Rect(data)
        parent.add(node)
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