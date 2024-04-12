import { v4 } from 'uuid';

/**
 * Generates random UUID v4
 *
 * Warning: This function is cryptographically secure (it uses uuid library internally)
 *
 * @returns uuid branded type
 */
export function $randomUuid(): string {
    return v4();
}
