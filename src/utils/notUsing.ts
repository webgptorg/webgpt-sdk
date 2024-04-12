/**
 * Does nothing, but preserves the function to fake the usage
 * Linter is tricked into thinking the function is used
 *
 * @param value any function to preserve
 * @returns nothing
 */
export function notUsing(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
): void {
    // Note: Do nothing
    value;
}
