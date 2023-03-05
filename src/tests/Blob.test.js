import Blob from "../Blob";

describe("Blob tests", () => {
    let child, parent

    beforeEach(() => {
        parent = new Blob("parent", null, "folder")
        child = new Blob("child", parent, "file")
        parent.addBlob(child)
    })

    it("should have the correct name", () => {
        expect(parent.name).toEqual("parent")
    })

    it("should have the correct type", () => {
        expect(parent.type).toEqual("folder")
    })

    it("should have no parent", () => {
        expect(parent.parent).toEqual(null)
    })

    it("should have the correct prompt", () => {
        expect(parent.prompt).toEqual("parent")
    })

    it("should add a subdirectory", () => {
        expect(parent.subDirectories.length).toEqual(1)
        expect(parent.subDirectories[0]).toEqual(child)
    })

    it("should remove a subdirectory", () => {
        parent.removeBlob(child)
        expect(parent.subDirectories.length).toEqual(0)
    })

    it("should get a subdirectory by name", () => {
        expect(parent.getSubDirectory("child")).toEqual(child)
    })

    it("should return null for non-existent subdirectory", () => {
        expect(parent.getSubDirectory("non-existent-blob")).toEqual(null)
    })

    it("should return the current directory when given '.'", () => {
        expect(parent.getSubDirectory(".")).toEqual(parent)
    })

    it("should return the parent directory when given '..'", () => {
        child.parent = parent
        expect(child.getSubDirectory("..")).toEqual(parent)
    })

    it("should return itself when given '..' and there is no parent directory", () => {
        expect(parent.getSubDirectory("..")).toEqual(parent)
    })

    it("should be a file", () => {
        expect(child.isFile()).toEqual(true)
    })

    it("should not be a folder", () => {
        expect(child.isFolder()).toEqual(false)
    })
})
