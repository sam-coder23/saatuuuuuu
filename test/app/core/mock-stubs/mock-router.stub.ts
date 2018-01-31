/**
 * Defines common mock router stub for unit testing
 */
export class MockRouterStub {
    public navigateByUrl(url: string): string {
        return url;
    }

    public navigate(commands: any[]): any[] {
        return commands;
    }
}
