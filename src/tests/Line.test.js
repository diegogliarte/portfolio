import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import Line from '../Line';

describe('Line tests', () => {
    it('should renders prompt when passed a prompt prop', () => {
        const prompt = 'test-prompt';
        render(<Line prompt={prompt} theme="light" current={false} />);

        const user = screen.getByText('diegogliarte@ubuntu');
        const tilde = screen.getByText(prompt);
        const dollarSign = screen.getByText('$');

        expect(user).toBeInTheDocument();
        expect(tilde).toBeInTheDocument();
        expect(dollarSign).toBeInTheDocument();
    });

    it('should renders a prompt with a specified theme', () => {
        const theme = 'matrix';
        render(<Line prompt={prompt} theme={theme} />);
        expect(screen.getByTestId('line')).toHaveClass(`${theme}`);
    });

    it('should renders stdout as HTML when passed as a prop', () => {
        const stdout = '<strong>Hello World!</strong>';
        render(<Line stdout={stdout} />);

        const output = screen.getByText('Hello World!');
        expect(output).toBeInTheDocument();
        expect(output).toHaveStyle('font-weight: bold;');
    });

    it('should renders an empty span with a visible attribute when stdout is empty', () => {
        render(<Line stdout="" />);
        const emptySpan = screen.getByText('42');
        expect(emptySpan).toHaveAttribute('visible', 'true');
    });

    it('should renders a cursor when current prop is true', () => {
        render(<Line current={true} />);
        const cursor = screen.getByText('█');
        expect(cursor).toBeInTheDocument();
    });

    it('should does not render a cursor when current prop is false', () => {
        render(<Line current={false} />);
        const cursor = screen.queryByText('█');
        expect(cursor).not.toBeInTheDocument();
    });
});