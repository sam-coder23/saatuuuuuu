/**
 * Defines common mock router stub for unit testing
 */
export class MockRouterStub {
    navigateByUrl(url: string) {
        return url;
    }

    navigate(commands: any[]): any[] {
        return commands;
    }
}