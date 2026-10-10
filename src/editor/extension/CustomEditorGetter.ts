class CustomEditorGetter {
    editor: any;

    public setEditor(editor: any) {
        this.editor = editor;
    }

    public getCursorPosition(): { from: number; to: number } | undefined {
        if (!this.editor) return;

        const { from, to } = this.editor.state.selection;

        return { from, to };
    }

    public writeInCursorPosition(
        position: { from: number; to: number } | undefined,
        text: string
    ) {
        if (!this.editor || !position) return;

        this.editor
            .chain()
            .focus()
            .insertContentAt(
                { from: position.from, to: position.to },
                text
            )
            .run();
    }
}

const CustomEditorGetterInstance = new CustomEditorGetter();

export default CustomEditorGetterInstance;