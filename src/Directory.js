import Blob from "./Blob";


class Directory {

    static currentDirectory = new Blob("~", null, "folder")
    static prompt = Directory.currentDirectory.prompt

    static changeDir(directory) {
        if (directory === "..") {
            this.currentDirectory = this.currentDirectory.parent !== null ? this.currentDirectory.parent : this.currentDirectory
        } else {
            let target = this.currentDirectory.getSubDirectory(directory)
            if (target !== null) {
                this.currentDirectory = target
            }
        }
    }

    static makeDir(names) {
        for (let name of names) {
            const folder = new Blob(name, this.currentDirectory, "folder")
            this.currentDirectory.addBlob(folder)
        }
    }


    static remove(names) {
        let output = []
        for (let name of names) {
            let shouldRemove = true
            let subDirectory = this.currentDirectory
            let directories = name.split("/").filter(element => element)
            for (let directory of directories) {
                subDirectory = subDirectory.getSubDirectory(directory)
                if (subDirectory === null) {
                    shouldRemove = false
                    break
                }
            }

            if (shouldRemove) {
                subDirectory.parent.removeBlob(subDirectory)
            } else {
                output.push(`rm: cannot remove '${name}': No such file or directory`)
            }
        }
        return output
    }

    static makeFile(names) {
        for (let name of names) {
            const file = new Blob(name, this.currentDirectory, "file")
            this.currentDirectory.addBlob(file)
        }
    }

    static getPrompt() {
        return this.prompt
    }

    static updatePrompt() {
        this.prompt = this.currentDirectory.prompt
    }


}

export default Directory