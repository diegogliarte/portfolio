import BlobManager from "./terminal/BlobManager";


class DirectoryManager {

    static currentDirectory = new BlobManager("~", null, "folder")
    static ubuntuDirectory = new BlobManager("ubuntu", this.currentDirectory, "folder");
    static windowsXPDirectory = new BlobManager("windows-xp", this.currentDirectory, "folder");

    static init() {
        // prompt = /
        this.currentDirectory.addBlob(this.ubuntuDirectory)
        this.currentDirectory.addBlob(this.windowsXPDirectory)

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


        let certsFile = new BlobManager("certs.txt", this.currentDirectory, "file")
        certsFile.content = "AI-900, SC-900, DP-900 issued by Microsoft\n" +
            "Google IT Automation Professional Certificate, issued by Coursera\n" +
            "Google IT Support Professional Certificate, issued by Coursera\n" +
            "Google Data Analytics, issued by Coursera\n" +
            "First Certificate (B2), issued by Cambridge"

        let cvFile = new BlobManager("CV.pdf", this.currentDirectory, "file")

        let projectsFile = new BlobManager("projects.txt", this.currentDirectory, "file")
        projectsFile.content = "Most of my projects can be found on my GitHub. Some of the most interesting ones are:\n" +
            "\n" +
            "Terminal Portfolio\n" +
            "The website you are browsing right now!\n" +
            ">> React, JS, CSS, HTML, Unix <<\n" +
            "\n" +
            "Sudoku Recognizer\n" +
            "Interprets a video stream to detect a sudoku, build it, and solve it using backtracking\n" +
            ">> Python, OpenCV, Machine Learning, Computer Vision <<\n" +
            "\n" +
            "Various Mini Games\n" +
            "Made in the span of two weeks because I was bored an wanted to see if I would be able to code them without any reference. Snake, Tic Tac Toe, Minesweeper, Flappy Birds... You name it!\n" +
            ">> p5js, JS, CSS, HTML <<\n" +
            "\n" +
            "Terminal Sorting Visualizer\n" +
            "Visualizer for the most common sorting algorithms such as Quicksort, Bubblesort, Selectionsort, among some weird ones like Bongosort or Stalinsort (yeah, you heard right). Used ANSI escape codes to optimize performance\n" +
            ">> Python, ANSI escape codes <<"

        let skillsFile = new BlobManager("skills.txt", this.currentDirectory, "file")
        skillsFile.content = "Languages: Python, JavaScript, bash, Java, SQL, C/C++\n" +
            "Python Tech: OpenCV, numpy, Flask, FastAPI\n" +
            "Website Tech: HTML, CSS, VanillaJS, React\n" +
            "General Tech: Unix, Git, GitHub, Docker, AWS"

        this.currentDirectory.addBlob(certsFile)
        this.currentDirectory.addBlob(cvFile)
        this.currentDirectory.addBlob(projectsFile)
        this.currentDirectory.addBlob(skillsFile)
        this.currentDirectory.addBlob(new BlobManager("cmd.exe", this.currentDirectory, "terminal"))

        
        // this.currentDirectory.addBlob(new BlobManager("file2.txt", this.currentDirectory, "file"))
        // this.currentDirectory.addBlob(new BlobManager("file3.txt", this.currentDirectory, "file"))

        let folder1 = new BlobManager("folder1", this.currentDirectory, "folder");
        let folder2 = new BlobManager("folder2", this.currentDirectory, "folder");
        this.currentDirectory.addBlob(folder1)
        this.currentDirectory.addBlob(folder2)

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