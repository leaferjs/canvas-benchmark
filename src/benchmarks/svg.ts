import { Case } from './core/Case'


let svgNS = 'http://www.w3.org/2000/svg'

export class SVGCase extends Case {

    declare app: HTMLElement
    declare rootNode: HTMLElement

    override async create() {
        const { view, width, height } = this
        const svg = document.createElementNS(svgNS, 'svg') as HTMLElement
        svg.setAttribute("style", `width:${width}px;height:${height}px;`)
        view.appendChild(svg)

        const app = document.createElementNS(svgNS, 'g') as HTMLElement
        svg.appendChild(app)
        app.style.transformOrigin = '0% 0%'

        // must
        this.app = this.rootNode = app
        this.canvas = app
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
        element.setAttribute('transform', `scale(${scale})`)
        if (x !== undefined && y !== undefined) this.setElementPosition(element, x, y)
    }

    override setElementPosition(element: HTMLElement, x: number, y: number): void {
        element.setAttribute('x', x as any as string)
        element.setAttribute('y', y as any as string)
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
        const node = document.createElementNS(svgNS, 'g')
        node.setAttribute('transform', `translate(${x}, ${y})`)
        parent.appendChild(node)
        return node
    }

    override addRect(parent: any, x: number, y: number, width: number, height: number, color: string): any {
        const node = document.createElementNS(svgNS, 'rect')
        node.setAttribute('x', x as any as string)
        node.setAttribute('y', y as any as string)
        node.setAttribute('width', width as any as string)
        node.setAttribute('height', height as any as string)
        node.setAttribute('fill', color)
        parent.appendChild(node)
    }

    override addCircle(parent: any, x: number, y: number, width: number, height: number, color: string): any {
        const node = document.createElementNS(svgNS, 'rect')
        node.setAttribute('x', x as any as string)
        node.setAttribute('y', y as any as string)
        node.setAttribute('width', width as any as string)
        node.setAttribute('height', height as any as string)
        node.setAttribute('fill', color)
        parent.appendChild(node)
    }

    override async createLargeImage() {
        await new Promise((resolve) => {

            const view = this.app
            const image = document.createElementNS(svgNS, "image") as HTMLElement
            image.setAttribute("href", this.imageConfig.largeImageUrl)

            image.onload = () => {
                view.appendChild(image)
                resolve(true)
            }

        })
    }

}