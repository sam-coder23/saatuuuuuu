/**
 * This class is mock for cms api service for home component
 */
export class MockRouter {
    public navigate(value: string): string {
        return value;
    }
    public navigateByUrl(value: string): string {
        return value;
    }
}
