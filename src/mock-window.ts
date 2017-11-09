import { WindowStorageMock } from './storage/window-storage.mock';

export function mockWindow(): Window {
    let _window: any = {};
    _window.localStorage = new WindowStorageMock();
    return _window as Window;
}