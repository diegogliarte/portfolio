class BlobManager {

    constructor(name, parent, type) {
        this.name = name
        this.parent = parent
        this.type = type
        this.prompt = (parent ? parent.prompt + "/" : "") + name
        this.subDirectories = []
        this.content = type === "file" ? "" : null
    }

    addBlob(blob) {
        this.subDirectories.push(blob)
    }

    removeBlob(blob) {
        let index = this.subDirectories.indexOf(blob)
        this.subDirectories.splice(index, 1)
    }

    getSubDirectory(name) {
        if (name === ".") {
            return this
        }
        if (name === "..") {
            return this.parent !== null ? this.parent : this
        }

        const subDirectory = this.subDirectories.find(subDirectory => subDirectory.name === name);

        return subDirectory || null
    }

    isFile() {
        return this.type === "file"
    }

    isFolder() {
        return this.type === "folder"
    }

}

export default BlobManager