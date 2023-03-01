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
            let subDirectory = this.isCompoundDirectoryValid(name);

            if (subDirectory !== null) {
                subDirectory.parent.removeBlob(subDirectory)
            } else {
                output.push(`rm: cannot remove '${name}': No such file or directory`)
            }
        }
        return output
    }

    static makeFile(names) {
        let output = []
        for (let name of names) {
            let directories = name.split("/")
            let fileName = directories.pop()

            let subDirectory = this.isCompoundDirectoryValid(directories.join("/"))
            if (subDirectory) {
                const file = new Blob(fileName, subDirectory, "file")
                subDirectory.addBlob(file)
            } else {
                output.push(`touch: cannot touch '${name}': No such file or directory`)
            }

        }
    }

    static isCompoundDirectoryValid(name) {
        let subDirectory = this.currentDirectory
        let directories = name.split("/").filter(element => element)
        for (let directory of directories) {
            subDirectory = subDirectory.getSubDirectory(directory)
            if (subDirectory === null) {
                return null
            }
        }
        return subDirectory;
    }


    static getContent(names) {
        let output = []
        for (let name of names) {
            let directories = name.split("/").filter(element => element)
            let fileName = directories.pop()

            let subDirectory = this.isCompoundDirectoryValid(directories.join("/"))
            let blob = subDirectory.getSubDirectory(fileName)
            if (!subDirectory || !blob) {
                output.push(`cat: '${name}': No such file or directory`)
            } else if (!blob.isFile()) {
                output.push(`cat: '${name}': Is a directory`)
            } else if (blob.content !== "") {
                output.push(blob.content)
            }
        }
        return output
    }

    static getPrompt() {
        return this.prompt
    }

    static updatePrompt() {
        this.prompt = this.currentDirectory.prompt
    }


}

export default Directory