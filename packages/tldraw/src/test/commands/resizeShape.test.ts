import { createShapeId } from '@tldraw/editor'
import { TestEditor } from '../TestEditor'

let editor: TestEditor

jest.useFakeTimers()

const ids = {
	boxA: createShapeId('boxA'),
	boxB: createShapeId('boxB'),
	boxC: createShapeId('boxC'),
	boxD: createShapeId('boxD'),
}

beforeEach(() => {
	editor = new TestEditor()
})

// most of the resizeShape command logic is tested in the resizing.test.ts file
// this file is mainly for testing the default parameters and associated logic

describe('resizing a shape', () => {
	it('always squashes history entries', () => {
		const startHistoryLength = editor.history.numUndos
		expect(startHistoryLength).toBe(0)

		editor.createShapes([{ id: ids.boxA, type: 'geo', props: { w: 100, h: 100 } }])
		expect(editor.history.numUndos).toBe(startHistoryLength + 1)

		editor.mark('start')
		expect(editor.history.numUndos).toBe(startHistoryLength + 2)

		editor.resizeShape(ids.boxA, { x: 2, y: 2 })
		expect(editor.history.numUndos).toBe(startHistoryLength + 3)
		editor.resizeShape(ids.boxA, { x: 2, y: 2 })
		expect(editor.history.numUndos).toBe(startHistoryLength + 3)
		editor.resizeShape(ids.boxA, { x: 2, y: 2 })
		expect(editor.history.numUndos).toBe(startHistoryLength + 3)

		expect(editor.getPageBounds(ids.boxA)).toCloselyMatchObject({
			w: 800,
			h: 800,
		})

		editor.undo()
		expect(editor.getPageBounds(ids.boxA)).toCloselyMatchObject({
			w: 100,
			h: 100,
		})
	})

	it('resizes from the center of the shape by default', () => {
		editor.createShapes([{ id: ids.boxA, type: 'geo', props: { w: 100, h: 100 } }])

		editor.resizeShape(ids.boxA, { x: 2, y: 2 })
		expect(editor.getPageBounds(ids.boxA)).toCloselyMatchObject({
			x: -50,
			y: -50,
			w: 200,
			h: 200,
		})
	})
})
