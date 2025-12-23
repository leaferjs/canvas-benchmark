export const engines: IEngineInfo[] = [
    { name: 'pixi', title: 'PixiJS', color: '#E72264', link: 'https://pixijs.com' },
    { name: 'konva', title: 'Konva.js', color: '#0D83CD', link: 'https://konvajs.org' },
    { name: 'fabric', title: 'Fabric.js', color: '#0d50cdff', link: 'https://fabricjs.com' },
    { name: 'svg', title: 'SVG', color: '#ff7b00ff', link: 'https://developer.mozilla.org/en-US/docs/Web/SVG' },
    { name: 'html', title: 'HTML', color: '#f60000ff', link: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
    { name: 'leafer', title: 'LeaferJS', color: '#32cd79', link: 'https://www.leaferjs.com' }
    // add engine...
]

export interface IEngineInfo {
    name: string,
    title: string,
    color: string,
    link: string
}