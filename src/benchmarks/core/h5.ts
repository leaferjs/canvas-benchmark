export function getUrlParam(name: string) {
    if (window.URLSearchParams) {
        const params = new URLSearchParams(window.location.search)
        return params.get(name)
    } else {
        name = name.replace(/[\[\]]/g, '\\$&')
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
        const results = regex.exec(window.location.search)
        if (!results) return null
        if (!results[2]) return ''
        return decodeURIComponent(results[2].replace(/\+/g, ' '))
    }
}

export function getId(name: string): HTMLElement {
    return document.getElementById(name) as HTMLElement
}