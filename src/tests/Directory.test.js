import Directory from "../Directory";
import Blob from "../Blob";

describe("Directory tests", () => {
    beforeEach(() => {
        Directory.currentDirectory = new Blob("~", null, "folder")
        Directory.prompt = Directory.currentDirectory.prompt
    })

    it("should change directory", () => {
        Directory.makeDir(["mydir"])
        Directory.changeDir("mydir")
        Directory.updatePrompt()
        expect(Directory.currentDirectory.name).toEqual("mydir")
        expect(Directory.prompt).toEqual("~/mydir")
    })

    it("should change directory to parent directory", () => {
        Directory.makeDir(["mydir"])
        Directory.changeDir("mydir")
        Directory.changeDir("..")
        Directory.updatePrompt()
        expect(Directory.currentDirectory.name).toEqual("~")
        expect(Directory.prompt).toEqual("~")
    })

    it("should create new directory", () => {
        Directory.makeDir(["mydir"])
        expect(Directory.currentDirectory.subDirectories.length).toEqual(1)
        expect(Directory.currentDirectory.getSubDirectory("mydir").name).toEqual("mydir")
    })

    it("should create multiple directories", () => {
        Directory.makeDir(["dir1", "dir2", "dir3"])
        expect(Directory.currentDirectory.subDirectories.length).toEqual(3)
        expect(Directory.currentDirectory.getSubDirectory("dir1").name).toEqual("dir1")
        expect(Directory.currentDirectory.getSubDirectory("dir2").name).toEqual("dir2")
        expect(Directory.currentDirectory.getSubDirectory("dir3").name).toEqual("dir3")
    })

    it("should remove file or directory", () => {
        Directory.makeDir(["mydir"])
        Directory.makeFile(["mydir/file1"])
        Directory.remove(["mydir"])
        expect(Directory.currentDirectory.subDirectories.length).toEqual(0)
    })

    it("should not remove non-existent file or directory", () => {
        const output = Directory.remove(["non-existent-file"])
        expect(output[0]).toEqual(`rm: cannot remove 'non-existent-file': No such file or directory`)
    })

    it("should create new file", () => {
        Directory.makeDir(["mydir"])
        Directory.makeFile(["mydir/file1"])
        expect(Directory.currentDirectory.getSubDirectory("mydir").subDirectories[0].name).toEqual("file1")
        expect(Directory.currentDirectory.getSubDirectory("mydir").subDirectories[0].isFile()).toEqual(true)
    })

    it("should create multiple files", () => {
        Directory.makeDir(["mydir"])
        Directory.makeFile(["mydir/file1", "mydir/file2", "mydir/file3"])
        expect(Directory.currentDirectory.getSubDirectory("mydir").subDirectories.length).toEqual(3)
        expect(Directory.currentDirectory.getSubDirectory("mydir").subDirectories[0].name).toEqual("file1")
        expect(Directory.currentDirectory.getSubDirectory("mydir").subDirectories[1].name).toEqual("file2")
        expect(Directory.currentDirectory.getSubDirectory("mydir").subDirectories[2].name).toEqual("file3")
        expect(Directory.currentDirectory.getSubDirectory("mydir").subDirectories[0].isFile()).toEqual(true)
        expect(Directory.currentDirectory.getSubDirectory("mydir").subDirectories[1].isFile()).toEqual(true)
        expect(Directory.currentDirectory.getSubDirectory("mydir").subDirectories[2].isFile()).toEqual(true)
    })

    it("should not change to a non-existent directory", () => {
        Directory.changeDir("non-existent-dir");
        expect(Directory.currentDirectory.name).toEqual("~");
        expect(Directory.prompt).toEqual("~");
    });

})