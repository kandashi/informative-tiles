Hooks.once('init', async function () {
    game.keybindings.register("informative-tiles", "showText", {
        name: "Display Tile Info",
        hint: "Shows all tile infomation while held",
        uneditable: [
            {
                key: "KeyI",
                modifiers: []
            }
        ],
        editable: [],
        onDown: () => { infoTile.showData() },
        onUp: () => { infoTile.hideData() },
        restricted: true,
        precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    })
});

Hooks.on("renderTileConfig", (config, html, css) => {
    const text = config.object.getFlag("informative-tiles", "text")
    const xpos = config.object.getFlag("informative-tiles", "xpos")
    const ypos = config.object.getFlag("informative-tiles", "ypos")
    const tab = `<a class="item" data-tab="InfoTiles"><i class="fas fa-envelope-open-text"></i> Info</a>`;

    let contents = `
    <div class="tab" data-tab="InfoTiles">
        <div class="form-group">
            <label>Tile Text</label>
            <textarea name="flags.informative-tiles.text">${text}</textarea>
        </div>
        <div class="form-group">
            <label>Horizontal Placement</label>
            <select name="flags.informative-tiles.xpos" data-dtype="String" value=${xpos}>
                <option value="outerLeft" ${xpos === 'outerLeft' ? 'selected' : ''}>Outer Left</option>
                <option value="innerLeft" ${xpos === 'innerLeft' ? 'selected' : ''}>Inner Left</option>
                <option value="innerRight "${xpos === 'innerRight' ? 'selected' : ''}>Inner Right</option>
                <option value="outerRight" ${xpos === 'outerRight' ? 'selected' : ''}>Outer Right</option>
            </select>
        </div>
        <div class="form-group">
            <label>Vertical Placement</label>
                <select name="flags.informative-tiles.ypos" data-dtype="String" value=${ypos}>
                    <option value="outerTop" ${ypos === 'outerTop' ? 'selected' : ''}>Outer Top</option>
                    <option value="innerTop" ${ypos === 'innerTop' ? 'selected' : ''}>Inner Top</option>
                    <option value="innerBottom "${ypos === 'innerBottom' ? 'selected' : ''}>Inner Bottom</option>
                    <option value="outerBottom" ${ypos === 'outerBottom' ? 'selected' : ''}>Outer Bottom</option>
                </select>
        </div>
    </div>
    `
    html.find(".tabs .item").last().after(tab);
    html.find(".tab").last().after(contents);
})


class infoTile {

    static showData() {
        const infoTiles = canvas.scene.tiles.contents.filter(i => !!i.data.flags["informative-tiles"]?.text)
        const hud = document.getElementById("hud")
        hud.insertAdjacentHTML("beforeend", `<div class="tile-data"></div>`)
        for (let t of infoTiles) { infoTile.addHTML(t) }
    }

    static hideData() {
        let layer = document.getElementsByClassName("tile-data")[0]
        layer.remove()
    }

    static addHTML(tile) {
        const layer = document.getElementsByClassName("tile-data")[0]
        const textData = tile.data.flags["informative-tiles"].text
        const third = tile.data.width / 3
        let position = { top: 0, left: 0 }
        switch (tile.data.flags["informative-tiles"]?.xpos) {
            case "outerLeft": position.left = tile.data.x - third
                break;
            case "innerLeft": position.left = tile.data.x
                break;
            case "innerRight": position.left = tile.data.x + tile.data.width - third
                break;
            case "outerRight": position.left = tile.data.x + tile.data.width
                break;
            default: position.left = tile.data.x + tile.data.width
        }
        switch (tile.data.flags["informative-tiles"]?.ypos) {
            case "outerTop": position.top = tile.data.y - 24
                break;
            case "innerTop": position.top = tile.data.y
                break;
            case "innerBottom": position.top = tile.data.y + tile.data.height - 24
                break;
            case "outerBottom": position.top = tile.data.x + tile.data.height
                break;
            default: position.top = tile.data.y

        }
        let html = `
        <style> 
        .info-tiles.${tile.id} {
            position: absolute;
            top: ${position.top}px;
            left: ${position.left}px;
            inline-size: ${third}px;
        }
        </style>
        <div class="info-tiles ${tile.id}">
            <div class="info-text">
                ${textData}
            </div>
        </div>
        `
        layer.insertAdjacentHTML("beforeend", html)
    }

}

window.infoTile = infoTile
ui.infoTile = infoTile