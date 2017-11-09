export class WindowStorageMock {
    public values: Map<string, string> = new Map<string, string>();

    public get length(): number {
        return this.values.size;
    }

    public key(index: number): string {
        let keys = this.values.keys();
        return Array.from(keys)[index] || null;
    }

    public getItem(key: string): string {
        return this.values.get(key) || null;
    }

    public setItem(key: string, data: string): void {
        this.values.set(key, data);
    }

    public removeItem(key: string): void {
        this.values.delete(key);
    }

    public clear(): void {
        this.values.clear();
    }
}
