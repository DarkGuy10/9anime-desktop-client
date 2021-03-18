const {remote} = require('electron')

document.querySelector('#app-name').innerText = remote.app.getName()

const info = [];
info.push(`App Version: ${remote.app.getVersion()}`)
info.push(`App Location: ${remote.app.getAppPath()}`)
info.push(`Electron: v${process.versions.electron}`)
info.push(`Chromium: v${process.versions.chrome}`)
info.push(`NodeJS: v${process.versions.node}`)
info.push(`Coded by: <a href = "https://github.com/DarkGuy10/">@DarkGuy10</a>`)
info.push(`Github repo: <a href = "https://github.com/DarkGuy10/">9anime-desktop-client</a>`)

document.querySelector('#info').innerHTML = info.join('<br>')

document.querySelectorAll('a').forEach(a => {
    a.onclick = event => {
        event.preventDefault()
        remote.shell.openExternal('https://google.com')
    }
})