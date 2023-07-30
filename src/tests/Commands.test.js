import React from 'react';
import Commands from '../terminal/Commands';
import {fireEvent, render} from "@testing-library/react";
import DirectoryManager from "../terminal/DirectoryManager";

describe('Commands test', () => {
    it('should add output to stdout when output is not null', () => {
        const terminal = {
            state: {
                stdout: [],
                stdin: 'command',
            },
            setState: jest.fn(),
        };
        const output = [
            {message: 'Output message', prompt: 'Output prompt'},
            {message: 'Another output message', prompt: 'Another output prompt'},
        ];

        Commands.executeCommand(terminal, output);

        expect(terminal.setState).toHaveBeenCalledWith({
            stdout: [
                {
                    id: 0,
                    stdout: 'command',
                    prompt: expect.any(String),
                },
                {
                    id: 1,
                    stdout: 'Output message',
                    prompt: 'Output prompt',
                },
                {
                    id: 2,
                    stdout: 'Another output message',
                    prompt: 'Another output prompt',
                },
            ],
        });
    });

    it('should not add output to stdout when output is null', () => {
        const terminal = {
            state: {
                stdout: [],
                stdin: 'command',
            },
            setState: jest.fn(),
        };
        const output = null;

        Commands.executeCommand(terminal, output);

        expect(terminal.setState).not.toHaveBeenCalled();
    });

    it('should parse stdin correctly', () => {
        const stdin1 = 'ls';
        const stdin2 = 'cd documents';
        const stdin3 = 'mkdir folder1 folder2 folder3';

        expect(Commands.parseStdin(stdin1)).toEqual({command: 'ls', args: []});
        expect(Commands.parseStdin(stdin2)).toEqual({command: 'cd', args: ['documents']});
        expect(Commands.parseStdin(stdin3)).toEqual({command: 'mkdir', args: ['folder1', 'folder2', 'folder3']});
    });

    it('should return true if the given string is a command', () => {
        expect(Commands.isCommand('ls')).toBe(true);
        expect(Commands.isCommand('cd')).toBe(true);
        expect(Commands.isCommand('help')).toBe(true);
    });

    it('should return false if the given string is not a command', () => {
        expect(Commands.isCommand('foobar')).toBe(false);
        expect(Commands.isCommand('123')).toBe(false);
        expect(Commands.isCommand('')).toBe(false);
    });

});