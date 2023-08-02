


class AppContext {

    static saveMode(setMode) {
        this.setMode = setMode
    }

    static setMode(value) {
        AppContext.setMode(value)
    }


}

export default AppContext