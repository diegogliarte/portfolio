import Blob from "./Blob";


class DirectoryManager {

    static rootDirectory = new Blob("/", null, "folder");
    static currentDirectory = DirectoryManager.rootDirectory;
    static prompt = "/";

    static init() {
        this.makeDir(["home"], this.rootDirectory);
        const homeDirectory = this.rootDirectory.getSubDirectory("home");
        this.makeDir(["diegogliarte"], homeDirectory);

        const userDirectory = homeDirectory.getSubDirectory("diegogliarte");
        this.currentDirectory = userDirectory;

        this.makeDir(["life"]);
        this.changeDir("life");

        let meaning = new Blob("meaning.txt", this.currentDirectory, "file");
        meaning.content = "42";

        this.currentDirectory.addBlob(meaning);

        this.currentDirectory = userDirectory;

        this.updatePrompt();
    }

    static changeDir(directory) {
        if (directory === "..") {
            if (this.currentDirectory.parent !== null) {
                this.currentDirectory = this.currentDirectory.parent;
            }
        } else if (directory === "/") {
            this.currentDirectory = this.rootDirectory;
        } else {
            let target = this.currentDirectory.getSubDirectory(directory);
            if (target !== null) {
                this.currentDirectory = target;
            }
        }
    }

    static makeDir(names, parentDirectory = this.currentDirectory) {
        for (let name of names) {
            const folder = new Blob(name, parentDirectory, "folder");
            parentDirectory.addBlob(folder);
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
        return output
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
        let fullPath = this.getFullPath(this.currentDirectory);
        if (fullPath.startsWith("/home/diegogliarte")) {
            this.prompt = fullPath.replace("/home/diegogliarte", "~");
        } else {
            this.prompt = fullPath;
        }
    }

    static getFullPath(directory) {
        let path = [];
        let current = directory;
        while (current !== null) {
            path.unshift(current.name);
            current = current.parent;
        }
        return "/" + path.slice(1).join("/");
    }
}

export default DirectoryManager