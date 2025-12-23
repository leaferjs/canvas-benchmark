import Konva from 'konva'
import { Case } from '../core/Case'


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

    declare app: any
    declare rootNode: any
    declare canvas: HTMLCanvasElement

    override async createApp() {
        const { width, height } = this
        const app = new Stage({ container: this.config.id, width, height })
        const layer = new Layer()
        app.add(layer)

        // must
        this.app = app
        this.rootNode = layer
        this.canvas = layer.canvas._canvas
    }

    override defineViewCompleted(): void {
        const fn = () => {
            this.rootNode.off('draw', fn)
            this.firstPaintEnd()
        }
        this.rootNode.on('draw', fn)
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

    override setNodeScale(element: any, scale: number, x?: number, y?: number): void {
        element.scaleX(scale)
        element.scaleY(scale)
        if (x !== undefined && y !== undefined) this.setNodePosition(element, x, y)
    }

    override setNodePosition(element: any, x: number, y: number): void {
        element.x(x)
        element.y(y)
    }

    // get

    override updateNodes(): void {
        this.nodes = this.rootNode.children
    }

    override updateDragNodes(): void {
        const list = this.flatChildren ? this.rootNode.children : this.rootNode.children[0].children
        this.dragNode = list[0]
        for (let i = 0; i < this.maxDragNodes; i++) {
            this.dragNodes.push(list[i])
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
        return node
    }

    override async addImage(parent: any, x: number, y: number, width: number, height: number, url: string): Promise<any> {
        await new Promise((resolve) => {
            Image.fromURL(url, function (node) {
                node.x(x)
                node.y(y)
                node.width(width)
                node.height(height)
                parent.add(node)
                resolve(node)
            })
        })
    }

}