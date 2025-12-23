import { Case } from './core/Case'


export class HTMLCase extends Case {

    declare app: HTMLDivElement
    declare rootNode: HTMLDivElement

    override async create() {
        const { view } = this
        const app = document.createElement('div')
        app.style.transformOrigin = '0% 0%'
        view.appendChild(app)

        // must
        this.app = this.canvas = this.rootNode = app
        await this.createContent()
        requestAnimationFrame(() => this.firstPaintEnd())
    }

    // set

    override setAppScale(scale: number, x: number, y: number): void {
        this.app.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`
    }

    override setAppPosition(x: number, y: number): void {
        this.app.style.transform = `translate(${x}px, ${y}px)`
    }

    override setElementScale(element: HTMLElement, scale: number, x?: number, y?: number): void {
        if (x !== undefined && y !== undefined) element.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`
        else element.style.transform = `scale(${scale})`
    }

    override setElementPosition(element: HTMLElement, x: number, y: number): void {
        element.style.left = x + 'px'
        element.style.top = y + 'px'
    }

    // get

    override updateElements(): void {
        this.elements = this.rootNode.childNodes as any
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
        const node = document.createElement('div')
        const { style } = node
        style.position = 'absolute'
        style.left = x + 'px'
        style.top = y + 'px'
        parent.appendChild(node)
        return node
    }

    override addRect(parent: any, x: number, y: number, width: number, height: number, color: string): any {
        const node = document.createElement('div')
        const { style } = node
        style.position = 'absolute'
        style.left = x + 'px'
        style.top = y + 'px'
        style.width = width + 'px'
        style.height = height + 'px'
        style.backgroundColor = color
        parent.appendChild(node)
    }

    override addCircle(parent: any, x: number, y: number, width: number, height: number, color: string): any {
        const node = document.createElement('div')
        const { style } = node
        style.position = 'absolute'
        style.left = x + 'px'
        style.top = y + 'px'
        style.width = width + 'px'
        style.height = height + 'px'
        style.backgroundColor = color
        parent.appendChild(node)
    }

    override async createLargeImage() {
        await new Promise((resolve) => {

            const view = this.app
            const image = new Image()
            image.src = this.imageConfig.largeImageUrl
            image.onload = () => {
                view.appendChild(image)
                resolve(true)
            }

        })
    }

}