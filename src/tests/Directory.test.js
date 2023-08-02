import DirectoryManager from "../DirectoryManager";
import BlobManager from "../terminal/BlobManager";

describe("Directory tests", () => {
    beforeEach(() => {
        DirectoryManager.currentDirectory = new BlobManager("~", null, "folder")
        DirectoryManager.prompt = DirectoryManager.currentDirectory.prompt
    })

    it("should change directory", () => {
        DirectoryManager.makeDir(["mydir"])
        DirectoryManager.changeDir("mydir")
        DirectoryManager.updatePrompt()
        expect(DirectoryManager.currentDirectory.name).toEqual("mydir")
        expect(DirectoryManager.prompt).toEqual("~/mydir")
    })

    it("should change directory to parent directory", () => {
        DirectoryManager.makeDir(["mydir"])
        DirectoryManager.changeDir("mydir")
        DirectoryManager.changeDir("..")
        DirectoryManager.updatePrompt()
        expect(DirectoryManager.currentDirectory.name).toEqual("~")
        expect(DirectoryManager.prompt).toEqual("~")
    })

    it("should create new directory", () => {
        DirectoryManager.makeDir(["mydir"])
        expect(DirectoryManager.currentDirectory.subDirectories.length).toEqual(1)
        expect(DirectoryManager.currentDirectory.getSubDirectory("mydir").name).toEqual("mydir")
    })

    it("should create multiple directories", () => {
        DirectoryManager.makeDir(["dir1", "dir2", "dir3"])
        expect(DirectoryManager.currentDirectory.subDirectories.length).toEqual(3)
        expect(DirectoryManager.currentDirectory.getSubDirectory("dir1").name).toEqual("dir1")
        expect(DirectoryManager.currentDirectory.getSubDirectory("dir2").name).toEqual("dir2")
        expect(DirectoryManager.currentDirectory.getSubDirectory("dir3").name).toEqual("dir3")
    })

    it("should remove file or directory", () => {
        DirectoryManager.makeDir(["mydir"])
        DirectoryManager.makeFile(["mydir/file1"])
        DirectoryManager.remove(["mydir"])
        expect(DirectoryManager.currentDirectory.subDirectories.length).toEqual(0)
    })

    it("should not remove non-existent file or directory", () => {
        const output = DirectoryManager.remove(["non-existent-file"])
        expect(output[0]).toEqual(`rm: cannot remove 'non-existent-file': No such file or directory`)
    })

    it("should create new file", () => {
        DirectoryManager.makeDir(["mydir"])
        DirectoryManager.makeFile(["mydir/file1"])
        expect(DirectoryManager.currentDirectory.getSubDirectory("mydir").subDirectories[0].name).toEqual("file1")
        expect(DirectoryManager.currentDirectory.getSubDirectory("mydir").subDirectories[0].isFile()).toEqual(true)
    })

    it("should create multiple files", () => {
        DirectoryManager.makeDir(["mydir"])
        DirectoryManager.makeFile(["mydir/file1", "mydir/file2", "mydir/file3"])
        expect(DirectoryManager.currentDirectory.getSubDirectory("mydir").subDirectories.length).toEqual(3)
        expect(DirectoryManager.currentDirectory.getSubDirectory("mydir").subDirectories[0].name).toEqual("file1")
        expect(DirectoryManager.currentDirectory.getSubDirectory("mydir").subDirectories[1].name).toEqual("file2")
        expect(DirectoryManager.currentDirectory.getSubDirectory("mydir").subDirectories[2].name).toEqual("file3")
        expect(DirectoryManager.currentDirectory.getSubDirectory("mydir").subDirectories[0].isFile()).toEqual(true)
        expect(DirectoryManager.currentDirectory.getSubDirectory("mydir").subDirectories[1].isFile()).toEqual(true)
        expect(DirectoryManager.currentDirectory.getSubDirectory("mydir").subDirectories[2].isFile()).toEqual(true)
    })

    it("should not change to a non-existent directory", () => {
        DirectoryManager.changeDir("non-existent-dir");
        expect(DirectoryManager.currentDirectory.name).toEqual("~");
        expect(DirectoryManager.prompt).toEqual("~");
    });

})