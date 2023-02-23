import Blob from "./Blob";


class Directory {

    static directory = {
        "root": {
            "name": "~",
            "type": "folder",
            "subDirectories": [
                {
                    "name": "folder1",
                    "type": "folder",
                    "subDirectories": [
                        {
                            "name": "folder11",
                            "type": "folder",
                            "subDirectories": {}
                        },
                        {
                            "name": "file11",
                            "type": "file",
                            "content": "this is a inner file"
                        }
                    ]
                },
                {
                    "name": "folder2",
                    "type": "folder",
                    "subDirectories": {}
                },
                {
                    "name": "file1",
                    "type": "file",
                    "content": "this is a file"
                }
            ]
        }
    }


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

    static getPrompt() {
        return this.prompt
    }

    static updatePrompt() {
        this.prompt = this.currentDirectory.prompt
    }



}

export default Directory