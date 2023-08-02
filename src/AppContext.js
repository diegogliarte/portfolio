


class AppContext {

    static saveMode(setMode) {
        this.setMode = setMode
    }

    static setMode(value) {
        AppContext.setMode(value)
    }

    static setTheme(theme) {
        this.theme = theme
    }


}

export default AppContext