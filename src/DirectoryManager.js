import BlobManager from "./terminal/BlobManager";


class DirectoryManager {

    static currentDirectory = new BlobManager("~", null, "folder")

    static init() {
        // prompt = /
        this.makeDir(["windows-xp", "ubuntu"])

        // prompt = /ubuntu
        this.changeDir("ubuntu")
        this.makeDir(["life"]);
        // prompt = /ubuntu/life
        this.changeDir("life");

        let meaning = new BlobManager("meaning.txt", this.currentDirectory, "file");
        meaning.content = 42;
        this.currentDirectory.addBlob(meaning);

        // prompt = /ubuntu
        this.changeDir("..");
        // prompt = /
        this.changeDir("..");
        // prompt = /windows-xp
        this.changeDir("windows-xp")

        let folder1 = new BlobManager("folder1", this.currentDirectory, "folder");

        this.currentDirectory.addBlob(new BlobManager("file1.txt", this.currentDirectory, "file"))
        this.currentDirectory.addBlob(new BlobManager("file2.txt", this.currentDirectory, "file"))
        this.currentDirectory.addBlob(new BlobManager("file3.txt", this.currentDirectory, "file"))
        this.currentDirectory.addBlob(new BlobManager("cmd.exe", this.currentDirectory, "terminal"))
        this.currentDirectory.addBlob(folder1)

        // prompt = /windows-xp/folder1
        this.changeDir("folder1")

        this.currentDirectory.addBlob(new BlobManager("file4.txt", this.currentDirectory, "file"))
        this.currentDirectory.addBlob(new BlobManager("file5.txt", this.currentDirectory, "file"))

        // prompt = /windows-xp
        this.changeDir("..");
        // prompt = /
        this.changeDir("..");
        // prompt = /ubuntu
        this.changeDir("ubuntu");

        this.prompt = this.currentDirectory.prompt
    }

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
            const folder = new BlobManager(name, this.currentDirectory, "folder")
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
                const file = new BlobManager(fileName, subDirectory, "file")
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
        this.prompt = this.currentDirectory.prompt
    }

}

export default DirectoryManager