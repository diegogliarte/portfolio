class AppContext {

    static nextWindowId = 0;

    static saveMode(setMode) {
        this.setMode = setMode
    }

    static setMode(value) {
        AppContext.setMode(value)
    }

    static setTheme(theme) {
        this.theme = theme
    }

    static saveWindows(activeScreens, updateActiveScreens) {
        this.activeScreens = activeScreens
        this.updateActiveScreens = updateActiveScreens
    }

    static addWindow(directory) {
        this.updateActiveScreens(windows => [...windows, {
            id: this.nextWindowId,
            directory: directory,
            x: 100 + windows.length * 50,
            y: 100 + windows.length * 50,
            zIndex: windows.length
        }])

        this.nextWindowId++
    }

    static removeWindow(windowId) {
        const currentZIndex = this.activeScreens.find(window => window["id"] === windowId)["zIndex"]
        this.updateActiveScreens(windows => windows
            .map(window => {
            window["zIndex"] = window["zIndex"] > currentZIndex ?
                    Math.max(0, window["zIndex"] - 1) :
                    window["zIndex"]
            return window;
        })
            .filter(
                window => window["id"] !== windowId
            ))
    }

    static updateZIndexOnWindows(topWindowId) {
        const currentZIndex = this.activeScreens.find(window => window["id"] === topWindowId)["zIndex"]
        this.updateActiveScreens(windows => windows.map(window => {
            window["zIndex"] = window["id"] === topWindowId ?
                windows.length - 1 :
                window["zIndex"] >= currentZIndex ?
                    Math.max(0, window["zIndex"] - 1) :
                    window["zIndex"]
            return window;
        }))

    }
}

export default AppContext