import { WindowStorageMock } from './window-storage.mock';

describe('Storage: Window Storage Mock', () => {
    let windowStorage: WindowStorageMock;

    beforeEach(() => {
        windowStorage = new WindowStorageMock();
    });

    it("#setItem should set 'test1' with value 'test-value1'", () => {
        windowStorage.setItem('test1', 'test-value1');
        expect(windowStorage.values.get('test1')).toEqual('test-value1');
    });

    it("#getItem should return null when no item", () => {
        expect(windowStorage.getItem('test1')).toEqual(null);
    });

    it("#getItem should return 'test1-value' when item exists", () => {
        windowStorage.values.set('test1', 'test-value1');
        expect(windowStorage.getItem('test1')).toEqual('test-value1');
    });

    it("#removeItem should remove item 'test1'", () => {
        windowStorage.values.set('test1', 'test-value1');
        windowStorage.removeItem('test1');
        expect(windowStorage.values.get('test1')).toEqual(undefined);
    });

    it("#clear should remove all items", () => {
        windowStorage.values.set('test1', 'test-value1');
        windowStorage.values.set('test2', 'test-value2');
        windowStorage.clear();
        expect(windowStorage.values.size).toEqual(0);
    });

    it('#key should return null when no item', () => {
        expect(windowStorage.key(0)).toEqual(null);
    });

    it("#key should return 'test1'", () => {
        windowStorage.values.set('test1', 'test-value1');
        windowStorage.values.set('test2', 'test-value2');
        expect(windowStorage.key(0)).toEqual('test1');
    });

    it('length should return 0 with no items', () => {
        expect(windowStorage.length).toEqual(0);
    });

    it('length should return 2 with two items', () => {
        windowStorage.values.set('test1', 'test-value1');
        windowStorage.values.set('test2', 'test-value2');
        expect(windowStorage.length).toEqual(2);
    });
});
